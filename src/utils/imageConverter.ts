import JSZip from 'jszip';
import { pipeline, env, type Pipeline } from '@huggingface/transformers';

// Configure transformers.js
// Keep remote models and enable browser caching to avoid re-downloading each session
env.allowLocalModels = false;
env.useBrowserCache = true;

let cachedSegmenter: Pipeline | null = null;

async function getSegmenter(): Promise<Pipeline> {
  if (cachedSegmenter) return cachedSegmenter;
  // Try WebGPU first, then gracefully fall back to WASM
  try {
    cachedSegmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
      device: 'webgpu',
    });
    return cachedSegmenter;
  } catch (err) {
    // Fallback to WASM backend
    cachedSegmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
      device: 'wasm',
    });
    return cachedSegmenter;
  }
}

export async function preloadSegmentationModel(): Promise<void> {
  try {
    await getSegmenter();
  } catch {
    // Ignore preload errors; runtime will surface errors as needed
  }
}

export interface ConvertedFile {
  id: string;
  originalFile: File;
  convertedBlob: Blob;
  previewUrl: string;
  status: 'converting' | 'completed' | 'error';
}

const MAX_IMAGE_DIMENSION = 1024;

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting background removal process...');
    const segmenter = await getSegmenter();
    
    // Convert HTMLImageElement to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Resize image if needed and draw it to canvas
    const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
    console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`);
    
    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    console.log('Image converted to base64');
    
    // Process the image with the segmentation model
    console.log('Processing with segmentation model...');
    const result = await segmenter(imageData);
    
    console.log('Segmentation result:', result);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      throw new Error('Invalid segmentation result');
    }
    
    // Create a new canvas for the masked image
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Apply the mask
    const outputImageData = outputCtx.getImageData(
      0, 0,
      outputCanvas.width,
      outputCanvas.height
    );
    const data = outputImageData.data;
    
    // Apply inverted mask to alpha channel
    for (let i = 0; i < result[0].mask.data.length; i++) {
      // Invert the mask value (1 - value) to keep the subject instead of the background
      const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    console.log('Mask applied successfully');
    
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Successfully created final blob');
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const convertImageToPNG = async (file: File, removeBackgroundEnabled: boolean = true): Promise<Blob> => {
  try {
    if (removeBackgroundEnabled) {
      console.log('Converting with background removal...');
      const img = await loadImage(file);
      return await removeBackground(img);
    } else {
      console.log('Converting without background removal...');
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          
          if (ctx) {
            // Clear canvas with transparent background
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to convert image to PNG'));
              }
            }, 'image/png', 1.0);
          } else {
            reject(new Error('Could not get canvas context'));
          }
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        img.src = URL.createObjectURL(file);
      });
    }
  } catch (error) {
    console.error('Error in convertImageToPNG:', error);
    throw error;
  }
};

export const generatePNGifyFileName = (originalFileName: string): string => {
  const nameWithoutExtension = originalFileName.split('.').slice(0, -1).join('.');
  return `${nameWithoutExtension}-pngify.png`;
};

export const createZipDownload = async (files: ConvertedFile[]) => {
  const completedFiles = files.filter(f => f.status === 'completed');
  
  if (completedFiles.length === 0) return;
  
  if (completedFiles.length === 1) {
    // If only one file, download it directly
    const file = completedFiles[0];
    const url = URL.createObjectURL(file.convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generatePNGifyFileName(file.originalFile.name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return;
  }

  // Create ZIP for multiple files
  const zip = new JSZip();
  
  completedFiles.forEach((file) => {
    const fileName = generatePNGifyFileName(file.originalFile.name);
    zip.file(fileName, file.convertedBlob);
  });

  try {
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    a.href = url;
    a.download = `pngify-converted-${timestamp}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    // Fallback to individual downloads
    completedFiles.forEach((file, index) => {
      setTimeout(() => {
        const url = URL.createObjectURL(file.convertedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = generatePNGifyFileName(file.originalFile.name);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, index * 500); // Stagger downloads
    });
  }
};

export const generateFileId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

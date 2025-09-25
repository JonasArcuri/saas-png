import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  isLoading?: boolean;
}

const FileUpload = ({ onFilesSelected, maxFiles = 5, isLoading = false }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp'];
    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
    const validTypeFiles = files.filter(file => supportedTypes.includes(file.type));
    const oversized = validTypeFiles.filter(file => file.size > MAX_SIZE_BYTES);
    const validFiles = validTypeFiles.filter(file => file.size <= MAX_SIZE_BYTES);
    
    if (validTypeFiles.length !== files.length) {
      toast({
        title: "Alguns arquivos foram ignorados",
        description: "Apenas imagens JPG, PNG, WebP e BMP são suportadas.",
        variant: "destructive",
      });
    }

    if (oversized.length > 0) {
      toast({
        title: "Arquivo(s) muito grande(s)",
        description: `Limite de 10MB por arquivo. ${oversized.length} arquivo(s) foi(ram) ignorado(s).`,
        variant: "destructive",
      });
    }

    if (validFiles.length > maxFiles) {
      toast({
        title: "Muitos arquivos",
        description: `Máximo de ${maxFiles} arquivos permitidos na versão gratuita.`,
        variant: "destructive",
      });
      return;
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  return (
    <Card className="p-8 border-2 border-dashed border-primary/30 bg-background/50 backdrop-blur hover:border-primary/50 transition-all duration-300">
      <div
        className={`text-center space-y-4 ${isDragOver ? 'scale-105' : ''} transition-transform duration-300`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        aria-label="Área de upload: arraste e solte ou selecione imagens"
        tabIndex={0}
      >
        <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse-glow">
          <ImageIcon className="w-8 h-8 text-primary-foreground" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            Arraste suas imagens aqui
          </h3>
          <p className="text-muted-foreground">
            Converta para PNG + remova fundos automaticamente com IA (máximo {maxFiles} arquivos)
          </p>
          <p className="text-sm text-muted-foreground">
            JPG, PNG, WebP, BMP - até 10MB por arquivo
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            variant="upload"
            size="lg"
            disabled={isLoading}
            className="relative overflow-hidden"
            aria-label={isLoading ? "Processando com IA" : "Selecionar arquivos para upload"}
          >
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp,image/bmp"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isLoading}
              aria-hidden="true"
            />
            <Upload className="w-5 h-5 mr-2" />
            {isLoading ? "Processando com IA..." : "Selecionar Arquivos"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FileUpload;
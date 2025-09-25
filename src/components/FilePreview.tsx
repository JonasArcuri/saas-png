import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePNGifyFileName } from "@/utils/imageConverter";

interface ConvertedFile {
  id: string;
  originalFile: File;
  convertedBlob: Blob;
  previewUrl: string;
  status: 'converting' | 'completed' | 'error';
}

interface FilePreviewProps {
  files: ConvertedFile[];
  onRemoveFile: (id: string) => void;
  onDownloadAll: () => void;
}

const FilePreview = ({ files, onRemoveFile, onDownloadAll }: FilePreviewProps) => {
  const { toast } = useToast();

  const downloadFile = (file: ConvertedFile) => {
    const url = URL.createObjectURL(file.convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generatePNGifyFileName(file.originalFile.name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download iniciado",
      description: `${generatePNGifyFileName(file.originalFile.name)} foi baixado com sucesso.`,
    });
  };

  const completedFiles = files.filter(f => f.status === 'completed');

  if (files.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Arquivos Convertidos ({completedFiles.length}/{files.length})
        </h3>
        {completedFiles.length > 1 && (
          <Button variant="success" onClick={onDownloadAll}>
            <Download className="w-4 h-4 mr-2" />
            Baixar Todos (ZIP)
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <Card key={file.id} className="p-4 space-y-3 animate-fade-in">
            <div className="relative">
              <img
                src={file.previewUrl}
                alt={file.originalFile.name}
                className="w-full h-32 object-cover rounded-md bg-muted"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background/80 backdrop-blur"
                onClick={() => onRemoveFile(file.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground truncate">
                  {generatePNGifyFileName(file.originalFile.name)}
                </span>
                <Badge 
                  variant={file.status === 'completed' ? 'default' : 'secondary'}
                  className={file.status === 'completed' ? 'bg-gradient-success' : ''}
                >
                  {file.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {file.status === 'converting' && 'Convertendo + IA...'}
                  {file.status === 'completed' && 'PNG + Sem Fundo'}
                  {file.status === 'error' && 'Erro'}
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {(file.originalFile.size / 1024 / 1024).toFixed(2)} MB
              </div>

              {file.status === 'completed' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => downloadFile(file)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PNG + IA
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FilePreview;
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Download, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import FilePreview from "@/components/FilePreview";
import { convertImageToPNG, createZipDownload, generateFileId, preloadSegmentationModel, type ConvertedFile } from "@/utils/imageConverter";
import { logEvent } from "@/lib/analytics";
import { useAuth } from "@/context/AuthContext";
import AuthDialog from "@/components/AuthDialog";
import { useTranslation } from "react-i18next";

const Index = () => {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [dailyCount, setDailyCount] = useState(() => {
    const saved = localStorage.getItem('pngify-daily-count');
    const savedDate = localStorage.getItem('pngify-last-date');
    const today = new Date().toISOString().slice(0, 10); // UTC date YYYY-MM-DD
    if (savedDate !== today) {
      localStorage.setItem('pngify-last-date', today);
      localStorage.setItem('pngify-daily-count', '0');
      return 0;
    }
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  // remove local PRO flag (payment disabled for now)

  const MAX_DAILY_FREE = 5;

  // Preload model after first user interaction or when idle
  // This reduces the latency of the first conversion
  useState(() => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => preloadSegmentationModel());
    } else {
      setTimeout(() => preloadSegmentationModel(), 1500);
    }
    return 0;
  });

  const handleFilesSelected = useCallback(async (selectedFiles: File[]) => {
    logEvent({ type: 'upload_selected', metadata: { count: selectedFiles.length } });
    if (!user && dailyCount >= MAX_DAILY_FREE) {
      toast({
        title: t('toasts.limit_reached_title'),
        description: t('toasts.limit_reached_desc', { max: MAX_DAILY_FREE }),
        variant: "destructive",
      });
      return;
    }

    const remainingQuota = user ? selectedFiles.length : (MAX_DAILY_FREE - dailyCount);
    const filesToProcess = selectedFiles.slice(0, remainingQuota);

    if (!user && filesToProcess.length < selectedFiles.length) {
      toast({
        title: t('toasts.limited_files_title'),
        description: t('toasts.limited_files_desc', { remaining: remainingQuota }),
        variant: "destructive",
      });
    }

    setIsProcessing(true);
    logEvent({ type: 'convert_started', metadata: { count: filesToProcess.length } });

    const newFiles: ConvertedFile[] = filesToProcess.map(file => ({
      id: generateFileId(),
      originalFile: file,
      convertedBlob: new Blob(), // Placeholder
      previewUrl: URL.createObjectURL(file),
      status: 'converting' as const,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Process files one by one
    for (const fileData of newFiles) {
      try {
        const convertedBlob = await convertImageToPNG(fileData.originalFile, true); // Enable background removal
        
        setFiles(prev => 
          prev.map(f => 
            f.id === fileData.id 
              ? { ...f, convertedBlob, status: 'completed' as const }
              : f
          )
        );

        if (!user) {
          const newCount = dailyCount + 1;
          setDailyCount(newCount);
          localStorage.setItem('pngify-daily-count', newCount.toString());
          const today = new Date().toISOString().slice(0, 10);
          localStorage.setItem('pngify-last-date', today);
        }
        const today = new Date().toISOString().slice(0, 10);
        localStorage.setItem('pngify-last-date', today);

      } catch (error) {
        setFiles(prev => 
          prev.map(f => 
            f.id === fileData.id 
              ? { ...f, status: 'error' as const }
              : f
          )
        );
        
        toast({
          title: t('toasts.error_conversion_title'),
          description: t('toasts.error_conversion_desc', { name: fileData.originalFile.name }),
          variant: "destructive",
        });
        logEvent({ type: 'convert_error', metadata: { name: fileData.originalFile.name } });
      }
    }

    setIsProcessing(false);

    toast({
      title: t('toasts.conversion_done_title'),
      description: t('toasts.conversion_done_desc', { count: filesToProcess.length }),
    });
    logEvent({ type: 'convert_success', metadata: { count: filesToProcess.length } });
  }, [dailyCount, toast]);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.previewUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const handleDownloadAll = useCallback(() => {
    createZipDownload(files);
    logEvent({ type: files.filter(f => f.status === 'completed').length > 1 ? 'download_zip' : 'download_single' });
    toast({
      title: t('toasts.download_started_title'),
      description: t('toasts.download_started_desc'),
    });
  }, [files, toast]);

  const remainingQuota = user ? Infinity : (MAX_DAILY_FREE - dailyCount);

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              🚀 {t('index.hero_badge')}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              {t('index.hero_title_1')}{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                PNG
              </span>{" "}
              {t('index.hero_title_2')}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('index.hero_desc')}
            </p>

            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>{t('index.ia')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>{t('index.bg')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-primary" />
                <span>{t('index.dl')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="container mx-auto px-4 pb-16">
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="mb-4 bg-gradient-primary text-primary-foreground">
              🎯 {t('index.new_feature')}
            </Badge>
            <p className="text-sm text-muted-foreground">{t('index.hero_desc')}</p>
          </div>
            {/* Quota indicator */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  {user ? (
                    <>
                      <p className="text-sm font-medium text-foreground">Plano PRO ativo</p>
                      <p className="text-xs text-muted-foreground">Conversões ilimitadas</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-foreground">{t('index.quota_title', { remaining: remainingQuota, max: MAX_DAILY_FREE })}</p>
                      <p className="text-xs text-muted-foreground">{t('index.quota_desc')}</p>
                    </>
                  )}
                </div>
                {user ? null : (
                  <AuthDialog
                    trigger={
                      <Button variant="ghost" size="sm">
                        {t('index.upgrade')}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    }
                  />
                )}
              </div>
            </Card>

            <FileUpload
              onFilesSelected={handleFilesSelected}
              maxFiles={remainingQuota || 1}
              isLoading={isProcessing}
            />

            <FilePreview
              files={files}
              onRemoveFile={handleRemoveFile}
              onDownloadAll={handleDownloadAll}
            />
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16 border-t border-border/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t('index.why_title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('index.why_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: t('index.feat1'),
                description: t('index.feat1_desc')
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: t('index.feat2'),
                description: t('index.feat2_desc')
              },
              {
                icon: <Download className="w-8 h-8" />,
                title: t('index.feat3'),
                description: t('index.feat3_desc')
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 text-center border-border/50 hover:border-primary/50 transition-all duration-300">
                <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
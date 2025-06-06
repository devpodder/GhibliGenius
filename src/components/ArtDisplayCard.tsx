"use client";

import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Keeping Card for structure, but styling will be minimal
import { Download, Loader2, AlertTriangle, ImageOff } from "lucide-react";
import { useState, useEffect } from "react";

interface ArtDisplayCardProps {
  title: string;
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  onDownload?: () => void;
  showPlaceholder?: boolean;
  placeholderText?: string;
}

const ArtDisplayCard: React.FC<ArtDisplayCardProps> = ({
  title,
  imageUrl,
  isLoading,
  error,
  onDownload,
  showPlaceholder = true,
  placeholderText = "Your art will appear here"
}) => {
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setIsImageLoading(true);
      const img = new window.Image();
      img.onload = () => {
        const maxWidth = 512; 
        const maxHeight = 512;
        let width = img.width;
        let height = img.height;

        if (width === 0 || height === 0) {
            setImageDimensions({ width: maxWidth, height: maxHeight / 1.5 }); 
            setIsImageLoading(false);
            return;
        }
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        setImageDimensions({ width: Math.max(1, width), height: Math.max(1,height) });
        setIsImageLoading(false);
      };
      img.onerror = () => {
        setImageDimensions({ width: 512, height: 340 }); 
        setIsImageLoading(false);
      }
      img.src = imageUrl;
    } else {
      setImageDimensions(null);
      setIsImageLoading(false);
    }
  }, [imageUrl]);

  return (
    <Card className="w-full shadow-none border-none bg-transparent p-0">
      <CardHeader className="p-0 mb-3">
        <CardTitle className="text-lg font-semibold text-foreground text-left">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center min-h-[250px] p-4 bg-background/30 rounded-lg border border-border">
        {(isLoading || isImageLoading) && (
          <div className="flex flex-col items-center text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
            <p>{isLoading ? 'Generating your masterpiece...' : 'Loading image...'}</p>
          </div>
        )}
        {error && !isLoading && !isImageLoading && (
          <div className="flex flex-col items-center text-destructive">
            <AlertTriangle className="h-10 w-10 mb-2" />
            <p className="text-center">Error: {error}</p>
          </div>
        )}
        {!isLoading && !isImageLoading && !error && imageUrl && imageDimensions && (
          <NextImage
            src={imageUrl}
            alt={title}
            width={imageDimensions.width}
            height={imageDimensions.height}
            className="rounded-md object-contain max-w-full max-h-[450px] shadow-sm transition-opacity duration-500 opacity-0 data-[loaded=true]:opacity-100"
            data-ai-hint="art masterpiece"
            onLoad={(e) => e.currentTarget.setAttribute('data-loaded', 'true')}
            unoptimized={imageUrl.startsWith('data:')} 
          />
        )}
        {!isLoading && !isImageLoading && !error && !imageUrl && showPlaceholder && (
           <div className="flex flex-col items-center text-muted-foreground text-center p-6 border-2 border-dashed border-border/70 rounded-md w-full h-[250px] justify-center bg-background/50">
            <ImageOff className="h-12 w-12 mb-3 text-gray-400" />
            <p>{placeholderText}</p>
          </div>
        )}
      </CardContent>
      {imageUrl && !isLoading && !isImageLoading && !error && onDownload && (
        <CardFooter className="flex justify-start p-0 pt-4">
          <Button onClick={onDownload} className="bg-accent hover:bg-accent/90 text-accent-foreground transition-transform hover:scale-105 rounded-lg text-sm py-2.5 px-5">
            <Download className="mr-2 h-4 w-4" />
            Download Art
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ArtDisplayCard;

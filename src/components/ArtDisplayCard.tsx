"use client";

import NextImage from "next/image"; // Renamed to NextImage to avoid conflict
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

        if (width === 0 || height === 0) { // Handle potential 0 dimensions
            setImageDimensions({ width: maxWidth, height: maxHeight/2 }); // Default to a reasonable aspect ratio
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
        setImageDimensions({ width: Math.max(1, width), height: Math.max(1,height) }); // Ensure non-zero dimensions
        setIsImageLoading(false);
      };
      img.onerror = () => {
        // In case image fails to load, use placeholder dimensions
        setImageDimensions({ width: 512, height: 300 });
        setIsImageLoading(false);
      }
      img.src = imageUrl;
    } else {
      setImageDimensions(null);
      setIsImageLoading(false);
    }
  }, [imageUrl]);

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-center text-accent">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center min-h-[300px] p-4">
        {(isLoading || isImageLoading) && (
          <div className="flex flex-col items-center text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
            <p>{isLoading ? 'Generating your masterpiece...' : 'Loading image...'}</p>
          </div>
        )}
        {error && !isLoading && !isImageLoading && (
          <div className="flex flex-col items-center text-destructive">
            <AlertTriangle className="h-12 w-12 mb-2" />
            <p className="text-center">Error: {error}</p>
          </div>
        )}
        {!isLoading && !isImageLoading && !error && imageUrl && imageDimensions && (
          <NextImage // Use NextImage
            src={imageUrl}
            alt={title}
            width={imageDimensions.width}
            height={imageDimensions.height}
            className="rounded-md object-contain max-w-full max-h-[512px] shadow-md transition-opacity duration-500 opacity-0 data-[loaded=true]:opacity-100"
            data-ai-hint="art masterpiece"
            onLoad={(e) => e.currentTarget.setAttribute('data-loaded', 'true')}
            unoptimized={imageUrl.startsWith('data:')} // Useful for data URIs
          />
        )}
        {!isLoading && !isImageLoading && !error && !imageUrl && showPlaceholder && (
           <div className="flex flex-col items-center text-muted-foreground text-center p-8 border-2 border-dashed border-border rounded-md w-full h-[300px] justify-center bg-background/50">
            <ImageOff className="h-16 w-16 mb-4 text-gray-400" />
            <p>{placeholderText}</p>
          </div>
        )}
      </CardContent>
      {imageUrl && !isLoading && !isImageLoading && !error && onDownload && (
        <CardFooter className="flex justify-center pt-4">
          <Button onClick={onDownload} className="bg-accent hover:bg-accent/90 text-accent-foreground transition-transform hover:scale-105">
            <Download className="mr-2 h-5 w-5" />
            Download Art
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ArtDisplayCard;

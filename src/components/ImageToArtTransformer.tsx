
"use client";

import { useState, ChangeEvent, FormEvent, DragEvent, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { transformImageToGhibliStyle } from "@/ai/flows/transform-image-to-ghibli-style";
import ArtDisplayCard from "./ArtDisplayCard";
import { UploadCloud, Wand2, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NextImage from "next/image";
import { cn } from "@/lib/utils";

const ImageToArtTransformer = () => {
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [transformedImageUrl, setTransformedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processFile = (file: File | null | undefined) => {
    if (file) {
      if (file.size > 4 * 1024 * 1024) { 
        setError("File is too large. Please upload an image under 4MB.");
        toast({
          title: "File Too Large",
          description: "Please upload an image under 4MB.",
          variant: "destructive",
        });
        setUploadedImageFile(null);
        setUploadedImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setUploadedImageFile(file);
      setError(null);
      setTransformedImageUrl(null); 

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
    // Clear the input value to allow re-uploading the same file if needed
    if (event.target) {
        event.target.value = "";
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
    const file = event.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleChooseImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!uploadedImageFile || !uploadedImagePreview) {
      setError("Please upload an image first.");
      toast({
        title: "No Image Selected",
        description: "Please upload an image to transform.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setTransformedImageUrl(null);

    try {
      const result = await transformImageToGhibliStyle({ photoDataUri: uploadedImagePreview });
      setTransformedImageUrl(result.transformedImage);
      toast({
        title: "Transformation Complete!",
        description: "Your image has been reimagined in Ghibli style.",
      });
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to transform image. Please try again.";
      setError(errorMessage);
      toast({
        title: "Transformation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!transformedImageUrl) return;
    const link = document.createElement('a');
    link.href = transformedImageUrl; 
    const originalFilename = uploadedImageFile?.name.split('.')[0].replace(/[^\w-]/g, '') || 'transformed_art';
    link.download = `${originalFilename}_ghibli.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Download Started", description: "Your transformed art is being downloaded." });
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="image-upload-dropzone" className="block text-md font-semibold text-foreground mb-2">
          Upload your image to transform
        </label>
        <div
          id="image-upload-dropzone"
          className={cn(
            "flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
            isDraggingOver ? "border-primary bg-primary/10" : "border-border hover:border-primary/70",
            isLoading ? "cursor-not-allowed opacity-70" : ""
          )}
          onDragOver={isLoading ? undefined : handleDragOver}
          onDragLeave={isLoading ? undefined : handleDragLeave}
          onDrop={isLoading ? undefined : handleDrop}
          onClick={isLoading ? undefined : handleChooseImageClick} // Allow click on whole area
        >
          <UploadCloud className={cn("w-12 h-12 mb-3", isDraggingOver ? "text-primary" : "text-primary/80")} />
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">Drag and drop</span> or click to upload
          </p>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={(e) => { 
              e.stopPropagation(); // Prevent dropzone click if button is clicked
              if (!isLoading) handleChooseImageClick();
            }}
            disabled={isLoading}
            className="text-primary border-primary hover:bg-primary/10 hover:text-primary"
          >
            Choose Image
          </Button>
          <Input
            ref={fileInputRef}
            id="image-upload-input"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">Max file size: 4MB (PNG, JPG).</p>
      </div>

      {uploadedImagePreview && !isLoading && (
        <div className="mt-4 p-3 border border-border rounded-lg bg-background/30">
          <p className="text-sm text-muted-foreground mb-2 text-center">Your Uploaded Image:</p>
          <div className="flex justify-center max-h-60">
            <NextImage src={uploadedImagePreview} alt="Uploaded preview" width={512} height={300} className="max-w-full h-auto rounded-md object-contain" data-ai-hint="uploaded image" />
          </div>
        </div>
      )}

      <Button 
        type="button" 
        onClick={handleSubmit} 
        disabled={isLoading || !uploadedImageFile} 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-3 transition-transform hover:scale-105 rounded-lg"
      >
        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
        Generate Ghibli Art
      </Button>

      {(transformedImageUrl || isLoading || error) && (
         <div className="mt-8">
          <ArtDisplayCard
            title="Transformed Ghibli Art"
            imageUrl={transformedImageUrl}
            isLoading={isLoading}
            error={error}
            onDownload={handleDownload}
            placeholderText="Your transformed Ghibli-style art will appear here."
          />
        </div>
      )}
    </div>
  );
};

export default ImageToArtTransformer;

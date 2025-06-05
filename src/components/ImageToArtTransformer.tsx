"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { transformImageToGhibliStyle } from "@/ai/flows/transform-image-to-ghibli-style";
import ArtDisplayCard from "./ArtDisplayCard";
import { UploadCloud, Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NextImage from "next/image";


const ImageToArtTransformer = () => {
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [transformedImageUrl, setTransformedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // Limit file size for Gemini
        setError("File is too large. Please upload an image under 4MB.");
        toast({
          title: "File Too Large",
          description: "Please upload an image under 4MB.",
          variant: "destructive",
        });
        setUploadedImageFile(null);
        setUploadedImagePreview(null);
        // Reset file input
        if(event.target) event.target.value = "";
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
    link.href = transformedImageUrl; // Transformed image is expected to be data URI
    const originalFilename = uploadedImageFile?.name.split('.')[0].replace(/[^\w-]/g, '') || 'transformed_art';
    link.download = `${originalFilename}_ghibli.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Download Started", description: "Your transformed art is being downloaded." });
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-md border-border/70 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
            <UploadCloud /> Transform Your Image
          </CardTitle>
          <CardDescription>Upload an image and watch it turn into a Ghibli-esque scene. Max 4MB (PNG, JPG).</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="image-upload" className="block text-sm font-medium text-foreground sr-only">
                Upload Image
              </label>
              <Input
                id="image-upload"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:font-medium file:rounded-md file:border-0 file:px-4 file:py-2 file:mr-3 cursor-pointer focus:ring-primary focus:border-primary"
                disabled={isLoading}
              />
            </div>
            {uploadedImagePreview && !isLoading && (
              <div className="mt-4 p-2 border border-dashed border-border rounded-md bg-background/50">
                <p className="text-sm text-muted-foreground mb-2 text-center">Your Uploaded Image:</p>
                <NextImage src={uploadedImagePreview} alt="Uploaded preview" width={512} height={300} className="max-w-full max-h-64 mx-auto rounded-md object-contain" data-ai-hint="uploaded image" />
              </div>
            )}
            <Button type="submit" disabled={isLoading || !uploadedImageFile} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105">
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
              Transform Image
            </Button>
          </form>
        </CardContent>
      </Card>

      {(transformedImageUrl || isLoading || error) && (
         <ArtDisplayCard
          title="Transformed Ghibli Art"
          imageUrl={transformedImageUrl}
          isLoading={isLoading}
          error={error}
          onDownload={handleDownload}
          placeholderText="Your transformed Ghibli-style art will appear here."
        />
      )}
    </div>
  );
};

export default ImageToArtTransformer;

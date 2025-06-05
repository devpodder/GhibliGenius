"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateGhibliArtFromText } from "@/ai/flows/generate-ghibli-art-from-text";
import ArtDisplayCard from "./ArtDisplayCard";
import { Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TextToArtGenerator = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      toast({
        title: "Uh oh!",
        description: "Please enter a prompt to generate art.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const result = await generateGhibliArtFromText({ prompt });
      setGeneratedImageUrl(result.imageUrl);
      toast({
        title: "Art Generated!",
        description: "Your Ghibli-style masterpiece is ready.",
      });
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate art. Please try again.";
      setError(errorMessage);
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    
    // For remote URLs that might need fetching (e.g. gs:// or temporary https)
    if (generatedImageUrl.startsWith('http') || generatedImageUrl.startsWith('gs')) {
        fetch(generatedImageUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch image: ${response.statusText}`);
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const filename = prompt.substring(0, 30).replace(/\s+/g, '_').replace(/[^\w-]/g, '').toLowerCase() || 'ghibli_art';
                link.download = `${filename}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                toast({ title: "Download Started", description: "Your art is being downloaded." });
            })
            .catch(err => {
                console.error("Download error:", err);
                toast({ title: "Download Failed", description: "Could not download the image.", variant: "destructive" });
                // Fallback for direct link if fetch fails (e.g. CORS)
                const link = document.createElement('a');
                link.href = generatedImageUrl;
                const filename = prompt.substring(0, 30).replace(/\s+/g, '_').replace(/[^\w-]/g, '').toLowerCase() || 'ghibli_art';
                link.download = `${filename}.png`;
                link.target = "_blank"; // Open in new tab as fallback
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    } else { // For data URIs or other direct links
        const link = document.createElement('a');
        link.href = generatedImageUrl;
        const filename = prompt.substring(0, 30).replace(/\s+/g, '_').replace(/[^\w-]/g, '').toLowerCase() || 'ghibli_art';
        link.download = `${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Download Started", description: "Your art is being downloaded." });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-md border-border/70 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
            <Wand2 /> Describe Your Vision
          </CardTitle>
          <CardDescription>Enter a text prompt and let GhibliGenius create magical art for you. Be descriptive for best results!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="e.g., A serene meadow at dusk, fireflies dancing over a crystal clear pond, distant mountains under a starry sky, Ghibli style."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="focus:ring-primary focus:border-primary text-base"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !prompt.trim()} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105">
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
              Generate Art
            </Button>
          </form>
        </CardContent>
      </Card>

      {(generatedImageUrl || isLoading || error) && (
        <ArtDisplayCard
          title="Generated Ghibli Art"
          imageUrl={generatedImageUrl}
          isLoading={isLoading}
          error={error}
          onDownload={handleDownload}
          placeholderText="Your Ghibli-style art will appear here once generated."
        />
      )}
    </div>
  );
};

export default TextToArtGenerator;

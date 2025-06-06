"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
// Removed Card imports as styling is now handled by page.tsx
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
        title: "Prompt is empty!",
        description: "Please describe your magical scene.",
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
                const link = document.createElement('a');
                link.href = generatedImageUrl;
                const filename = prompt.substring(0, 30).replace(/\s+/g, '_').replace(/[^\w-]/g, '').toLowerCase() || 'ghibli_art';
                link.download = `${filename}.png`;
                link.target = "_blank"; 
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    } else { 
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
    <div className="space-y-6">
      <div>
        <label htmlFor="text-prompt-area" className="block text-md font-semibold text-foreground mb-2">
          Describe your magical scene
        </label>
        <Textarea
          id="text-prompt-area"
          placeholder="e.g., A serene forest clearing with glowing spirits floating among ancient trees, painted in the style of Studio Ghibli..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="focus:ring-primary focus:border-primary text-base bg-background/30 border-border rounded-lg p-3"
          disabled={isLoading}
        />
      </div>
      <Button type="button" onClick={handleSubmit} disabled={isLoading || !prompt.trim()} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-3 transition-transform hover:scale-105 rounded-lg">
        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
        Generate Art
      </Button>

      {(generatedImageUrl || isLoading || error) && (
        <div className="mt-8">
          <ArtDisplayCard
            title="Generated Ghibli Art"
            imageUrl={generatedImageUrl}
            isLoading={isLoading}
            error={error}
            onDownload={handleDownload}
            placeholderText="Your Ghibli-style art will appear here once generated."
          />
        </div>
      )}
    </div>
  );
};

export default TextToArtGenerator;

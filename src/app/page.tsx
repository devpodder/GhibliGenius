import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextToArtGenerator from "@/components/TextToArtGenerator";
import ImageToArtTransformer from "@/components/ImageToArtTransformer";
import { Type, Image as ImageIcon, Leaf } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center selection:bg-primary/30">
      {/* Header removed from here as it's already in layout.tsx */}
      <main className="w-full max-w-3xl mt-8">
        <Tabs defaultValue="text-to-art" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50 p-1.5 rounded-lg">
            <TabsTrigger value="text-to-art" className="py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300">
              <Type className="mr-2 h-5 w-5" /> Text to Art
            </TabsTrigger>
            <TabsTrigger value="image-to-art" className="py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300">
              <ImageIcon className="mr-2 h-5 w-5" /> Image to Art
            </TabsTrigger>
          </TabsList>
          <TabsContent value="text-to-art" className="focus-visible:ring-0 focus-visible:ring-offset-0">
            <TextToArtGenerator />
          </TabsContent>
          <TabsContent value="image-to-art" className="focus-visible:ring-0 focus-visible:ring-offset-0">
            <ImageToArtTransformer />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="py-8 mt-16 text-center text-muted-foreground">
        <p className="flex items-center justify-center gap-2">
          <Leaf size={16} className="text-accent" />
          &copy; {new Date().getFullYear()} GhibliGenius. Crafted with magic & Google Gemini.
        </p>
      </footer>
    </div>
  );
}

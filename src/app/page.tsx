
"use client";

import { useState } from "react"; // Import useState
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextToArtGenerator from "@/components/TextToArtGenerator";
import ImageToArtTransformer from "@/components/ImageToArtTransformer";
import { Sparkles, Edit3, Image as ImageIcon, PencilLine, ImageUp, Wand2, Heart } from "lucide-react";
// Button import removed as it's not directly used here after previous changes. If needed, it's available in sub-components.

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("text-prompt"); // Keep this state if you decide to revert later
  const [isImageUpload, setIsImageUpload] = useState(false); // State for the new toggle
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-background selection:bg-primary/30 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <header className="w-full max-w-5xl text-center py-16 sm:py-24">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium px-4 py-2 rounded-full mb-6 text-sm shadow-sm border border-primary/20">
          <Sparkles className="h-5 w-5" />
          Dev's Magic
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
          Transform Your World
        </h1>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6">
          Into Magic
        </h1>
        <p className="text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Create enchanting Studio Ghibli-style artwork from your imagination or
          transform existing images into magical scenes.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 pb-16">
        {/* Left Column: Generator/Transformer */}
        <div className="lg:col-span-2 bg-card p-6 sm:p-8 rounded-xl shadow-xl flex flex-col items-center"> {/* Left Column Container */}
          {/* New Toggle Switch HTML */}
          <div className="mb-6"> {/* Toggle Switch Div */}
            <input
              type="checkbox"
              name="checkbox"
              id="input-toggle"
              className="input-toggle" // Use className for React
              onChange={() => setIsImageUpload(!isImageUpload)} // Add onChange handler
            />
            <div className="checkbox__container">
              <label htmlFor="input-toggle" className="label-for-toggle"> {/* Changed 'for' to 'htmlFor' for React */}
                <span className="ball arrow"> {/* Changed 'class' to 'className' for React */}
                  {/* You might want to change this icon to indicate the current mode (Text/Image) */}
                  <i className="fas fa-arrow-right"></i> {/* Changed 'class' to 'className' for React */}
                </span>
              </label>
            </div>
          </div>

          {/* Conditionally render components based on toggle state */}
          {/* Wrapped components in a div to maintain layout consistency */}
          <div className="w-full"> {/* Conditional Render Wrapper */}
            {isImageUpload ? (
              <ImageToArtTransformer />
            ) : (
              <TextToArtGenerator />
            )}
          </div> {/* Closes Conditional Render Wrapper */}
          {/* Removed redundant div block that contained commented-out Tabs */}
        </div> {/* Closes Left Column Container */}
      
        {/* Right Column: How the Magic Works */}
        <div className="bg-card p-6 sm:p-8 rounded-xl shadow-xl lg:mt-[calc(2.25rem+1.5rem+1.5rem)]"> {/* Align with tabs visually a bit */}
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Wand2 className="h-7 w-7 text-accent" />
            How the Magic Works
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <PencilLine className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Text to Art</h3>
                <p className="text-sm text-muted-foreground">
                  Describe your dream scene and watch as AI transforms your
                  words into beautiful Ghibli-style artwork.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <ImageUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Image Transform</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your own photos and see them magically reimagined
                  in the iconic, whimsical style of Studio Ghibli.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Magical Results</h3>
                <p className="text-sm text-muted-foreground">
                  Each creation captures the whimsical spirit, soft lighting, and
                  emotional depth of Ghibli animation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}

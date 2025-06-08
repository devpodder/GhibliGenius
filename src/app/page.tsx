
"use client";

import { useState, useEffect } from "react"; // Import useEffect
import TextToArtGenerator from "@/components/TextToArtGenerator";
import ImageToArtTransformer from "@/components/ImageToArtTransformer";
import { Sparkles, Edit3, Image as ImageIcon, PencilLine, ImageUp, Wand2, Heart } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("text-prompt"); 
  const [isImageUpload, setIsImageUpload] = useState(false); 
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-background selection:bg-primary/30 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <header className="w-full max-w-5xl text-center py-16 sm:py-24 group"> {/* Added group class here */}
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium px-4 py-2 rounded-full mb-6 text-sm shadow-sm border border-primary/20">
          <Sparkles className="h-5 w-5" />
          Dev's Magic
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground transition-all duration-300 ease-out group-hover:text-accent group-hover:drop-shadow-[0_0_8px_hsl(var(--accent))]">
          Transform Your World
        </h1>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6 transition-all duration-300 ease-out group-hover:text-accent group-hover:drop-shadow-[0_0_8px_hsl(var(--accent))]">
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
        <div className="lg:col-span-2 bg-card p-6 sm:p-8 rounded-xl shadow-xl flex flex-col items-center">
          {/* New Toggle Switch Section with Labels */}
          <div className="mb-8 flex flex-col items-center">
            <div className="flex items-center space-x-4">
              <span 
                className={`text-lg font-semibold transition-all duration-200 ease-out cursor-pointer ${!isImageUpload ? 'text-primary scale-105' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setIsImageUpload(false)}
              >
                Text-to-Art
              </span>
              
              <div className="relative"> {/* Container for the actual toggle mechanics */}
                <input
                  type="checkbox"
                  name="checkbox"
                  id="input-toggle"
                  className="input-toggle" 
                  checked={isImageUpload}
                  onChange={() => setIsImageUpload(!isImageUpload)}
                  aria-label="Toggle between Text-to-Art and Image-to-Art modes"
                />
                <div className="checkbox__container" role="switch" aria-checked={isImageUpload}>
                  <label htmlFor="input-toggle" className="label-for-toggle cursor-pointer">
                    <span className="ball arrow">
                      {isImageUpload ? (
                        <ImageIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" strokeWidth={2.5} />
                      ) : (
                        <PencilLine className="h-6 w-6 sm:h-7 sm:w-7 text-white" strokeWidth={2.5} />
                      )}
                    </span>
                  </label>
                </div>
              </div>

              <span 
                className={`text-lg font-semibold transition-all duration-200 ease-out cursor-pointer ${isImageUpload ? 'text-primary scale-105' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setIsImageUpload(true)}
              >
                Image-to-Art
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Select a mode or click the switch to toggle.
            </p>
          </div>

          {/* Conditionally render components based on toggle state */}
          <div className="w-full"> 
            {isImageUpload ? (
              <ImageToArtTransformer />
            ) : (
              <TextToArtGenerator />
            )}
          </div> 
        </div> 
      
        {/* Right Column: How the Magic Works */}
        <div className="bg-card p-6 sm:p-8 rounded-xl shadow-xl lg:mt-[calc(2.25rem+1.5rem+1.5rem+2rem)]"> {/* Adjusted margin to align better with new toggle height */}
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
      
      <footer className="w-full max-w-5xl text-center py-8 mt-auto">
        <p className="text-sm text-muted-foreground">
 &copy; {currentYear} Dev's Magic. Crafted with Magic by Debarshi.
        </p>
      </footer>
    </div>
  );
}


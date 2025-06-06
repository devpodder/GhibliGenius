import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'GhibliGenius AI',
  description: 'Transform your world into magic. Create enchanting Studio Ghibli-style artwork.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="min-h-screen flex flex-col">
          <div className="h-2.5 bg-accent w-full" /> {/* Gold top bar */}
          <main className="flex-grow w-full"> {children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}

import { Palette } from 'lucide-react';

const Header = () => (
  <header className="py-8 text-center">
    <div className="flex items-center justify-center gap-3 mb-2">
      <Palette size={40} className="text-primary animate-pulse" />
      <h1 className="text-5xl font-headline font-bold text-primary">GhibliGenius</h1>
    </div>
    <p className="text-lg text-muted-foreground">Create enchanting Ghibli-style art from text or images.</p>
  </header>
);

export default Header;

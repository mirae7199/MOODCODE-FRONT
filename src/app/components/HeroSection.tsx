import { Button } from "./ui/button";

interface HeroSectionProps {
  imageUrl: string;
  title: string;
  subtitle: string;
}

export function HeroSection({ imageUrl, title, subtitle }: HeroSectionProps) {
  return (
    <section className="relative h-[600px] bg-gray-100 overflow-hidden">
      <img 
        src={imageUrl} 
        alt="Hero banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="text-center text-white space-y-6">
          <h2 className="text-5xl tracking-tight">{title}</h2>
          <p className="text-xl">{subtitle}</p>
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-gray-100"
          >
            쇼핑하기
          </Button>
        </div>
      </div>
    </section>
  );
}

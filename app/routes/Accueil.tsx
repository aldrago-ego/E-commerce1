import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "~/components/ui/carousel";
// 1. IMPORTATION DU PLUGIN AUTOPLAY
import Autoplay from "embla-carousel-autoplay";

const SLIDES = [
  {
    id: 1,
    title: "Collection Été 2026",
    subtitle: "Des coupes minimalistes et des matières légères pour la saison.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80",
    textColor: "text-white",
    btnClass: "bg-white text-slate-900 hover:bg-slate-100"
  },
  {
    id: 2,
    title: "L'Élégance au Quotidien",
    subtitle: "Découvrez nos vestes et pantalons cargos pensés pour le confort.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
    textColor: "text-slate-900",
    btnClass: "bg-slate-900 text-white hover:bg-slate-800"
  },
  {
    id: 3,
    title: "Le Streetwear Revisité",
    subtitle: "Des sweats à capuche oversize conçus en coton 100% biologique.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80",
    textColor: "text-white",
    btnClass: "bg-white text-slate-900 hover:bg-slate-100"
  }
];

interface HomePageProps {
  onNavColorChange?: (color: "text-white" | "text-slate-900") => void;
}

export default function HomePage({ onNavColorChange }: HomePageProps) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api || !onNavColorChange) return;

    const handleSelect = () => {
      const currentSlideIndex = api.selectedScrollSnap();
      const currentSlide = SLIDES[currentSlideIndex];
      onNavColorChange(currentSlide.textColor as "text-white" | "text-slate-900");
    };

    api.on("select", handleSelect);
    handleSelect();

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, onNavColorChange]);

  return (
    <div className="relative w-full min-h-screen bg-slate-950 overflow-hidden">
      
      {/* 2. CONFIGURATION DU CARROUSEL AVEC LE PLUGIN */}
      <Carousel 
        setApi={setApi} 
        opts={{ loop: true }} 
        plugins={[
          Autoplay({
            delay: 6000, // Défilement toutes les 6 secondes (6000ms)
            stopOnInteraction: false, // Le défilement continue même si l'utilisateur clique
          }),
        ]}
        className="w-full h-screen"
      >
        <CarouselContent>
          {SLIDES.map((slide) => (
            <CarouselItem key={slide.id} className="relative w-full h-screen">
              <div className="absolute inset-0 bg-slate-900/20 z-10" />
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              <div className="absolute inset-0 z-20 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className={`max-w-xl space-y-6 ${slide.textColor}`}>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none">
                      {slide.title}
                    </h1>
                    <p className="text-lg opacity-90 font-medium tracking-wide">
                      {slide.subtitle}
                    </p>
                    <div className="pt-4">
                      <Button asChild className={`px-8 py-6 rounded-full font-bold uppercase tracking-wider text-xs gap-2 shadow-lg ${slide.btnClass}`}>
                        <Link to="/catalogue">
                          Voir la collection <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

    </div>
  );
}
import { Link, useLocation, Outlet } from "react-router"; // ou "react-router-dom" selon ta config v7
import { ShoppingBag, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";

interface LayoutProps {
  // Optionnel : si tu veux forcer une couleur de texte depuis la page d'accueil
  navTextColor?: "text-white" | "text-slate-900";
}

export default function RootLayout({ navTextColor = "text-slate-900" }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  // Effet pour rendre le layout opaque si l'utilisateur scroll sur la page d'accueil
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Gestion des classes de fond et de texte selon la page et le scroll
  const navbarBg = isHome 
    ? (isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-transparent") 
    : "bg-white border-b border-slate-100";

  const textColor = isHome && !isScrolled ? navTextColor : "text-slate-900";

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      {/* HEADER / NAVBAR */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg} ${textColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* GAUCHE : LOGO */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-black tracking-widest uppercase block">
              VÊTEMENT<span className="text-amber-600">.</span>
            </Link>
          </div>

          {/* MILIEU/DROITE : NAV LINKS */}
          <nav className="hidden md:flex items-center space-x-8 font-medium tracking-wide text-sm uppercase">
            <Link to="/" className="hover:opacity-70 transition-opacity">Accueil</Link>
            <Link to="/catalogue" className="hover:opacity-70 transition-opacity">Catalogue</Link>
            <Link to="/contact" className="hover:opacity-70 transition-opacity">Contact</Link>
          </nav>

          {/* DROITE : ICONES UTILS */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:opacity-70 transition-opacity relative" aria-label="Mon compte">
              <User className="h-5 w-5" />
            </button>
            
            <button className="p-2 hover:opacity-70 transition-opacity relative" aria-label="Panier">
              <ShoppingBag className="h-5 w-5" />
              {/* Badge panier - exemple */}
              <span className="absolute top-1 right-1 bg-amber-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Menu Mobile */}
            <button className="p-2 md:hidden hover:opacity-70 transition-opacity">
              <Menu className="h-5 w-5" />
            </button>
          </div>

        </div>
      </header>

      {/* CONTENU DE LA PAGE */}
      {/* On met un padding-top (pt-20) sauf sur l'accueil pour que le carrousel passe sous le layout transparent */}
      <main className={`flex-grow ${isHome ? "pt-0" : "pt-20"}`}>
        <Outlet />
      </main>

      {/* FOOTER BASIQUE */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} VotreBoutique. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
import { Link, useLocation, Outlet } from "react-router";
import { ShoppingBag, User, Menu, Trash2, X, Plus, Minus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "~/lib/Store";
// Importation des composants Sheet de Shadcn UI
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";

interface LayoutProps {
  navTextColor?: "text-white" | "text-slate-900";
}

export default function RootLayout({ navTextColor = "text-slate-900" }: LayoutProps) {
  // Récupération des données et actions du Store Zustand
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);

  const location = useLocation();
  const isHome = location.pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  
  // ÉTAT DE CHARGEMENT POUR LA COMMANDE
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Gérer l'ouverture du volet manuellement si besoin

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ENVOI DU PANIER AU BACKEND C# POUR ENREGISTRER LA COMMANDE
  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsProcessing(true);

    // On formate les données pour correspondre au CheckoutItemDto du contrôleur C#
    const checkoutPayload = items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      size: item.size,
    }));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Affiche l'erreur renvoyée par le serveur (ex: rupture de stock spontanée)
        alert(data.message || "Une erreur est survenue lors de la validation.");
        return;
      }

      // Commande validée !
      alert("Félicitations ! Votre commande a été enregistrée avec succès.");
      clearCart(); // On vide le store global
      setIsOpen(false); // Ferme le panier
      
      // On rafraîchit la page pour charger les nouveaux stocks sur l'interface
      window.location.reload();

    } catch (error) {
      console.error("Erreur de connexion avec le serveur:", error);
      alert("Impossible de valider la commande. Le serveur est injoignable.");
    } finally {
      setIsProcessing(false);
    }
  };

  const navbarBg = isHome 
    ? (isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-transparent") 
    : "bg-white border-b border-slate-100";

  const textColor = isHome && !isScrolled ? navTextColor : "text-slate-900";

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      {/* HEADER / NAVBAR */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg} ${textColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-black tracking-widest uppercase block">
              VÊTEMENT<span className="text-amber-600">.</span>
            </Link>
          </div>

   {/* NAV LINKS */}
        <nav className="hidden md:flex items-center space-x-8 font-medium tracking-wide text-sm uppercase">
          <Link to="/" className="hover:text-amber-600 transition-colors duration-200">Accueil</Link>
          <Link to="/catalogue" className="hover:text-amber-600 transition-colors duration-200">Catalogue</Link>
          <Link to="/contact" className="hover:text-amber-600 transition-colors duration-200">Contact</Link>
        </nav>
          {/* ICONES UTILS */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:opacity-70 transition-opacity relative" aria-label="Mon compte">
              <User className="h-5 w-5" />
            </button>
            
            {/* PANIER COULISSANT SHADCN UI */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="p-2 hover:opacity-70 transition-opacity relative" aria-label="Panier">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute top-1 right-1 bg-amber-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-in zoom-in duration-200">
                      {totalItems}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-full sm:max-w-md flex flex-col h-full bg-white p-0">
                <SheetHeader className="p-6 pb-0 text-left">
                  <SheetTitle className="text-xl font-black uppercase tracking-tight">Mon Panier</SheetTitle>
                  <SheetDescription>Gérez les articles avant de valider.</SheetDescription>
                </SheetHeader>

                {/* ZONE DÉROULANTE DES ARTICLES */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                      <ShoppingBag className="h-10 w-10 text-slate-300 stroke-[1.5]" />
                      <p className="text-sm font-medium text-slate-500">Votre panier est vide.</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex items-start gap-4 border-b border-slate-50 pb-4 last:border-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 aspect-[3/4] object-cover rounded-xl bg-slate-50 shadow-sm"
                        />
                        <div className="flex-grow min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate uppercase tracking-tight">{item.name}</h4>
                          <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">{item.category}</p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-600">
                              Taille : {item.size}
                            </span>
                            
                            {/* LE SÉLECTEUR DE QUANTITÉ DYNAMIQUE */}
                           {/* LE SÉLECTEUR DE QUANTITÉ DYNAMIQUE */}
<div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
  <button
    onClick={() => decrementQuantity(item.id, item.size)}
    className="p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
    aria-label="Diminuer la quantité"
  >
    <Minus className="h-3 w-3" />
  </button>
  
  <span className="px-3 text-xs font-bold text-slate-800 select-none">
    {item.quantity}
  </span>
  
  <button
    onClick={() => {
      // Bloquer l'augmentation si la quantité dans le panier atteint le stock max disponible
      if (item.quantity >= item.stock) {
        alert(`Désolé, il n'y a que ${item.stock} exemplaires disponibles pour ce modèle.`);
        return;
      }
      incrementQuantity(item.id, item.size);
    }}
    className={`p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors ${item.quantity >= item.stock ? "opacity-40 cursor-not-allowed" : ""}`}
    aria-label="Augmenter la quantité"
  >
    <Plus className="h-3 w-3" />
  </button>
</div>
                          </div>

                          <p className="text-sm font-black text-slate-900 mt-2">
                            {(item.price * item.quantity).toFixed(2)} €
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-colors self-start"
                          aria-label="Supprimer l'article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* BLOC FIXE : TOTAUX ET VALIDATION */}
                {items.length > 0 && (
                  <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-500">Sous-total</span>
                      <span className="font-black text-slate-900 text-lg">{totalPrice.toFixed(2)} €</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <Button 
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Traitement...
                          </>
                        ) : (
                          "Passer à la caisse"
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={clearCart}
                        disabled={isProcessing}
                        className="w-full text-slate-400 hover:text-red-500 text-xs font-semibold uppercase tracking-wider py-4 hover:bg-transparent"
                      >
                        Vider le panier
                      </Button>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* Menu Mobile */}
            <button className="p-2 md:hidden hover:opacity-70 transition-opacity">
              <Menu className="h-5 w-5" />
            </button>
          </div>

        </div>
      </header>

      {/* CONTENU DE LA PAGE */}
      <main className={`flex-grow ${isHome ? "pt-0" : "pt-20"}`}>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} VÊTEMENT. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
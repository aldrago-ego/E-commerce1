import { useEffect, useState } from "react";
import { useParams, Link } from "react-router"; 
import { ArrowLeft, ShoppingBag, Check, AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useCartStore } from "~/lib/Store";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  tag: string;
  stock: number; // Synchronisé avec le modèle C#
}

const SIZES = ["S", "M", "L", "XL"];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>(); 
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [errorSize, setErrorSize] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5288/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Produit introuvable");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      setErrorSize(true);
      return;
    }

    setErrorSize(false);
    addToCart(product, selectedSize);
    alert(`${product.name} (Taille ${selectedSize}) ajouté au panier !`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm font-medium text-slate-500 animate-pulse">Chargement des détails du vêtement...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <p className="text-slate-600 font-semibold">Oups ! Ce vêtement n'existe pas.</p>
        <Link to="/catalogue" className="text-amber-600 font-bold hover:underline mt-4 inline-block">
          Retourner au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Bouton Retour */}
      <Link to="/catalogue" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* BLOC GAUCHE : L'IMAGE DU VÊTEMENT */}
        <div className="relative aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover object-center"
          />
          {product.tag && (
            <span className={`absolute top-4 left-4 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm
              ${product.tag === "Promo" ? "bg-red-500" : "bg-amber-600"}`}>
              {product.tag}
            </span>
          )}
        </div>

        {/* BLOC DROITE : INFOS ET ACHAT */}
        <div className="flex flex-col h-full justify-center">
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">{product.category}</span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mt-2 tracking-tight uppercase leading-none">{product.name}</h1>
          <p className="text-2xl font-black text-slate-900 mt-4">{product.price.toFixed(2)} €</p>
          
          <hr className="my-6 border-slate-100" />

          {/* GESTION VISUELLE DU STOCK */}
          <div className="flex items-center gap-2 mb-6">
            {product.stock === 0 ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-red-50 text-red-700 px-3 py-1 rounded-full">
                <AlertTriangle className="h-3.5 w-3.5" /> Rupture de stock
              </span>
            ) : product.stock <= 3 ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-700 px-3 py-1 rounded-full animate-pulse">
                <AlertTriangle className="h-3.5 w-3.5" /> Plus que {product.stock} articles disponibles !
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                <Check className="h-3.5 w-3.5" /> En stock et prêt à être expédié
              </span>
            )}
          </div>

          {/* SÉLECTION DES TAILLES */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Choisir une taille</span>
              {errorSize && <span className="text-xs font-semibold text-red-500">Veuillez sélectionner une taille</span>}
              {!errorSize && selectedSize && <span className="text-xs font-semibold text-amber-600">Taille sélectionnée : {selectedSize}</span>}
            </div>
            
            <div className="flex gap-3">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  disabled={product.stock === 0}
                  onClick={() => {
                    setSelectedSize(size);
                    setErrorSize(false);
                  }}
                  className={`h-12 w-12 border rounded-xl flex items-center justify-center font-bold text-sm transition-all relative
                    ${product.stock === 0 ? "opacity-40 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400" : ""}
                    ${selectedSize === size 
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm scale-105" 
                      : "border-slate-200 text-slate-700 bg-white hover:border-slate-400"}`}
                >
                  {size}
                  {selectedSize === size && (
                    <span className="absolute -top-1 -right-1 bg-amber-600 rounded-full p-0.5 text-white">
                      <Check className="h-2 w-2" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* BOUTON AJOUT AU PANIER */}
          <div className="mt-8">
            <Button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-7 font-bold uppercase tracking-wider text-xs gap-3 shadow-lg transition-all rounded-xl text-white
                ${product.stock === 0 
                  ? "bg-slate-300 cursor-not-allowed shadow-none" 
                  : "bg-slate-900 hover:bg-slate-800"}`}
            >
              <ShoppingBag className="h-4 w-4" /> 
              {product.stock === 0 
                ? "Rupture de stock" 
                : selectedSize 
                  ? "Ajouter au panier" 
                  : "Sélectionnez une taille"}
            </Button>
          </div>

          {/* Petit texte rassurance */}
          <p className="text-center text-[11px] text-slate-400 mt-4 tracking-wide">
            Livraison standard gratuite • Retours gratuits sous 14 jours
          </p>
        </div>

      </div>
    </div>
  );
}
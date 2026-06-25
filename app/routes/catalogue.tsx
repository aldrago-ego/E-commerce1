import { useState, useEffect } from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";

// On met à jour l'interface pour inclure le stock synchronisé avec le backend
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  tag: string;
  stock: number; // Ajouté pour correspondre à ton modèle C#
}

const CATEGORIES = ["Tous", "Vestes", "T-shirts", "Pantalons", "Sweats", "Robes", "Accessoires"];

export default function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");

  // APPEL API VERS LE BACKEND C#
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`) // Utilisation de la variable d'environnement pour l'URL
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de récupération des vêtements:", err);
        setLoading(false);
      });
  }, []);

  // LOGIQUE COMBINÉE : RECHERCHE + FILTRAGE + TRI
  const processedProducts = products
    // 1. Filtrage par texte recherché
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    // 2. Filtrage par bouton de catégorie
    .filter((product) =>
      selectedCategory === "Tous" || product.category === selectedCategory
    )
    // 3. Application du tri sélectionné
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (sortBy === "price-desc") {
        return b.price - a.price;
      }
      if (sortBy === "newest") {
        if (a.tag === "Nouveau" && b.tag !== "Nouveau") return -1;
        if (a.tag !== "Nouveau" && b.tag === "Nouveau") return 1;
        return b.id - a.id;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-sm font-medium text-slate-500 animate-pulse">Chargement de la collection...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* 1. EN-TÊTE DE LA PAGE */}
      <div className="border-b border-slate-100 pb-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notre Collection</h1>
        <p className="mt-2 text-sm text-slate-500">
          Découvrez nos vêtements conçus pour votre style de tous les jours. ({processedProducts.length} articles)
        </p>
      </div>

      {/* BARRE DE RECHERCHE */}
      <div className="relative w-full max-w-md mb-8">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <Input
          type="text"
          placeholder="Rechercher un vêtement, une catégorie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 py-5 rounded-xl border-slate-200 focus-visible:ring-amber-500 text-sm shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 2. BARRE D'OUTILS (FILTRES & TRI) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        
        {/* Filtres Desktop */}
        <div className="hidden md:flex items-center space-x-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all
                ${selectedCategory === cat 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtres Mobile */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 text-xs uppercase tracking-wider">
                <SlidersHorizontal className="h-4 w-4" />
                Filtrer par catégorie
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader className="text-left mb-6">
                <SheetTitle>Filtres</SheetTitle>
                <SheetDescription>Affinez votre recherche de vêtements.</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col space-y-3">
                <h3 className="font-semibold text-sm text-slate-900 uppercase tracking-wider mb-2">Catégories</h3>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left py-2 px-3 rounded-lg text-sm transition-colors
                      ${selectedCategory === cat ? "bg-slate-100 font-bold text-slate-950" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Section Tri */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] text-xs uppercase tracking-wider font-medium">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Tendances</SelectItem>
              <SelectItem value="price-asc">Prix : du - au +</SelectItem>
              <SelectItem value="price-desc">Prix : du + au -</SelectItem>
              <SelectItem value="newest">Nouveautés</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      {/* 3. GRILLE DE PRODUITS */}
      {processedProducts.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-slate-200 rounded-2xl">
          <p className="text-slate-500 font-medium">Aucun vêtement ne correspond à votre recherche actuelle.</p>
          {(searchQuery || selectedCategory !== "Tous") && (
            <Button 
              variant="link" 
              onClick={() => { setSearchQuery(""); setSelectedCategory("Tous"); }}
              className="mt-2 text-amber-600 text-xs font-bold uppercase tracking-wider"
            >
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8">
          {processedProducts.map((product) => (
            <Link 
              to={`/catalogue/${product.id}`} 
              key={product.id} 
              className="group relative flex flex-col cursor-pointer"
            >
              {/* Conteneur de l'image */}
              <div className="relative w-full aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-[1.01]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {product.tag && (
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm
                    ${product.tag === "Promo" ? "bg-red-500" : "bg-amber-600"}`}>
                    {product.tag}
                  </span>
                )}

                {/* Badge Rupture de stock directement visible sur le catalogue */}
                {product.stock === 0 && (
                  <span className="absolute top-3 right-3 bg-slate-900/90 text-white text-[9px] font-extrabold uppercase px-2 py-1 rounded-md tracking-wider">
                    Épuisé
                  </span>
                )}

                <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:block">
                  <Button className="w-full bg-white/95 text-slate-900 hover:bg-white font-semibold text-xs uppercase tracking-wider shadow-md">
                    Voir l'article
                  </Button>
                </div>
              </div>

              {/* Détails du produit */}
              <div className="mt-4 flex flex-col flex-grow">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">{product.category}</p>
                <h3 className="text-sm font-medium text-slate-800 mt-1 hover:text-slate-950 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm font-bold text-slate-950 mt-1.5">{product.price.toFixed(2)} €</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
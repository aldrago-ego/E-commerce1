import { useState, useEffect } from "react";
import { Plus, FolderPlus, Package, DollarSign } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface Product {
  id?: number;
  name: string;
  price: number;
  category: string;
  image: string;
  tag: string;
}

const CATEGORIES = ["Vestes", "T-shirts", "Pantalons", "Sweats", "Robes", "Accessoires"];

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    price: 0,
    category: "T-shirts",
    image: "",
    tag: ""
  });

  const fetchProducts = () => {
    fetch("http://localhost:5288/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5288/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        fetchProducts(); // Rafraîchit la liste
        setNewProduct({ name: "", price: 0, category: "T-shirts", image: "", tag: "" }); // Reset
        alert("Vêtement ajouté avec succès !");
      }
    } catch (error) {
      console.error("Erreur d'ajout:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-slate-200 pb-5 mb-10">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Espace Administration</h1>
        <p className="text-sm text-slate-500 mt-1">Ajoutez et gérez les articles visibles sur la boutique.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* FORMULAIRE D'AJOUT (Prend 1 colonne) */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm lg:col-span-1">
          <div className="flex items-center gap-2 mb-6 text-amber-600 font-bold uppercase tracking-wider text-sm">
            <FolderPlus className="h-5 w-5" />
            <h2>Nouveau Produit</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600">Nom du vêtement</label>
              <Input 
                required 
                value={newProduct.name} 
                onChange={(e: { target: { value: any; }; }) => setNewProduct({...newProduct, name: e.target.value})}
                placeholder="ex: Bomber Jacket Noir" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600">Prix (€)</label>
              <Input 
                required 
                type="number" 
                step="0.01"
                value={newProduct.price || ""} 
                onChange={(e: { target: { value: string; }; }) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                placeholder="ex: 79.99" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600">Catégorie</label>
              <select 
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600">Lien de la photo (URL)</label>
              <Input 
                required 
                value={newProduct.image} 
                onChange={(e: { target: { value: any; }; }) => setNewProduct({...newProduct, image: e.target.value})}
                placeholder="https://images.unsplash.com/..." 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600">Tag (Optionnel)</label>
              <Input 
                value={newProduct.tag} 
                onChange={(e: { target: { value: any; }; }) => setNewProduct({...newProduct, tag: e.target.value})}
                placeholder="ex: Rare, Promo, -20%" 
              />
            </div>

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-wider text-xs py-5 mt-2">
              <Plus className="h-4 w-4 mr-1" /> Publier l'article
            </Button>
          </form>
        </div>

        {/* LISTE DE CONTRÔLE (Prend 2 colonnes) */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden lg:col-span-2">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Package className="h-4 w-4 text-slate-500" /> Articles en ligne
            </span>
            <span className="bg-slate-200 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {products.length}
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto bg-white">
            {products.map((product) => (
              <div key={product.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">{product.name}</h3>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase font-bold tracking-wider">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-0.5">
                    {product.price.toFixed(2)} €
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
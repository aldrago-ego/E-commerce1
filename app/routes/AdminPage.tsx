import { useState, useEffect } from "react";
import { Plus, FolderPlus, Package, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface Product {
  id?: number;
  name: string;
  price: number;
  category: string;
  image: string;
  tag: string;
  stock: number; // NOUVEAU : Ajout de la propriété de stock
}

const CATEGORIES = ["Vestes", "T-shirts", "Pantalons", "Sweats", "Robes", "Accessoires"];

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // NOUVEAU : État pour savoir si on est en train de modifier un produit existant
  const [editingId, setEditingId] = useState<number | null>(null);

  const [productForm, setProductForm] = useState<Product>({
    name: "",
    price: 0,
    category: "T-shirts",
    image: "",
    tag: "",
    stock: 1 // Valeur par défaut initiale
  });

  const fetchProducts = () => {
    fetch("http://localhost:5288/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Déclenché quand on clique sur le bouton modifier d'un article
  const startEdit = (product: Product) => {
    if (product.id) {
      setEditingId(product.id);
      setProductForm({ ...product }); // Remplit le formulaire de gauche
    }
  };

  // Annuler le mode édition
  const cancelEdit = () => {
    setEditingId(null);
    setProductForm({ name: "", price: 0, category: "T-shirts", image: "", tag: "" , stock: 1 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Détermination de l'URL et de la méthode HTTP (POST pour ajout, PUT pour modification)
    const url = editingId 
      ? `http://localhost:5288/api/products/${editingId}`
      : "http://localhost:5288/api/products";
      
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        fetchProducts(); // Recharge la liste mise à jour
        cancelEdit(); // Réinitialise le formulaire et l'état d'édition
        alert(editingId ? "Vêtement mis à jour !" : "Vêtement ajouté avec succès !");
      } else {
        alert("Une erreur est survenue lors de l'enregistrement.");
      }
    } catch (error) {
      console.error("Erreur d'enregistrement:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cet article définitivement ?")) return;

    try {
      const response = await fetch(`http://localhost:5288/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProducts();
        if (editingId === id) cancelEdit();
        alert("Article retiré de la boutique.");
      }
    } catch (error) {
      console.error("Erreur de suppression:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* EN-TÊTE DE LA PAGE */}
      <div className="border-b border-slate-200 pb-5 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Espace Administration</h1>
          <p className="text-sm text-slate-500 mt-1">Ajoutez, modifiez et gérez les stocks en temps réel.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* FORMULAIRE GAUCHE : AJOUT OU ÉDITION (1 colonne) */}
        <div className={`border p-6 rounded-2xl shadow-sm lg:col-span-1 transition-all duration-300 bg-white
          ${editingId ? "border-amber-500 ring-1 ring-amber-500/20" : "border-slate-200"}`}>
          
          <div className="flex items-center justify-between mb-6">
            <div className={`flex items-center gap-2 font-bold uppercase tracking-wider text-sm ${editingId ? "text-amber-600" : "text-slate-900"}`}>
              <FolderPlus className="h-5 w-5" />
              <h2>{editingId ? "Modifier l'article" : "Nouveau Produit"}</h2>
            </div>
            {editingId && (
              <Button onClick={cancelEdit} variant="ghost" size="sm" className="h-7 text-xs gap-1 text-slate-400 hover:text-slate-600">
                <X className="h-3 w-3" /> Annuler
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600">Nom du vêtement</label>
              <Input 
                required 
                value={productForm.name} 
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                placeholder="ex: Bomber Jacket Noir" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-600">Prix (€)</label>
                <Input 
                  required 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={productForm.price || ""} 
                  onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})}
                  placeholder="ex: 79.99" 
                />
              </div>

              {/* NOUVEAU : CHAMP DE STOCK */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-600">Quantité en Stock</label>
                <Input 
                  required 
                  type="number" 
                  min="0"
                  value={productForm.stock} 
                  onChange={(e) => setProductForm({...productForm, stock: parseInt(e.target.value) || 0})}
                  placeholder="ex: 12" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600">Catégorie</label>
              <select 
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none"
                value={productForm.category}
                onChange={(e) => setProductForm({...productForm, category: e.target.value})}
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
                value={productForm.image} 
                onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                placeholder="https://images.unsplash.com/..." 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600">Tag (Optionnel)</label>
              <Input 
                value={productForm.tag} 
                onChange={(e) => setProductForm({...productForm, tag: e.target.value})}
                placeholder="ex: Rare, Promo, -20%" 
              />
            </div>

            <Button 
              type="submit" 
              className={`w-full text-white font-bold uppercase tracking-wider text-xs py-5 mt-2 transition-colors
                ${editingId ? "bg-amber-600 hover:bg-amber-700" : "bg-slate-900 hover:bg-slate-800"}`}
            >
              {editingId ? (
                <>
                  <Check className="h-4 w-4 mr-1" /> Enregistrer les modifications
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" /> Publier l'article
                </>
              )}
            </Button>
          </form>
        </div>

        {/* LISTE DE CONTRÔLE INTERACTIVE (2 colonnes) */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden lg:col-span-2 bg-white shadow-sm">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Package className="h-4 w-4 text-slate-500" /> Articles en ligne
            </span>
            <span className="bg-slate-200 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {products.length}
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[620px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-sm text-slate-400 animate-pulse">Chargement de la liste d'inventaire...</div>
            ) : products.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">Aucun produit en stock actuellement.</div>
            ) : (
              products.map((product) => (
                <div key={product.id} className={`p-4 flex items-center justify-between transition-colors
                  ${editingId === product.id ? "bg-amber-50/40" : "hover:bg-slate-50/50"}`}>
                  
                  <div className="flex items-center gap-4 min-w-0">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-800 truncate">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 uppercase font-black tracking-wider">
                          {product.category}
                        </span>
                        {/* Indicateur de couleur pour le niveau de stock */}
                        <span className={`text-[10px] font-bold px-1.5 rounded-md
                          ${(product.stock ?? 0) === 0 ? "bg-red-100 text-red-700" : (product.stock ?? 0) <= 3 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                          Stock : {product.stock ?? 0} u
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-shrink-0 ml-4">
                    <span className="text-sm font-black text-slate-900">
                      {product.price.toFixed(2)} €
                    </span>
                    
                    {/* BOUTONS D'ACTIONS (Modifier / Supprimer) */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(product)}
                        className={`p-2 rounded-lg transition-colors 
                          ${editingId === product.id ? "text-amber-600 bg-amber-100" : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"}`}
                        title="Modifier l'article"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => product.id && handleDelete(product.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer définitivement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
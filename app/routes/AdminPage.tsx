import { useState, useEffect } from "react";
import { Plus, FolderPlus, Package, Trash2, Edit2, Check, X, ShieldCheck, Lock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Link } from "react-router";

interface Product {
  id?: number;
  name: string;
  price: number;
  category: string;
  image: string;
  tag: string;
  stock: number;
}

const CATEGORIES = ["Vestes", "T-shirts", "Pantalons", "Sweats", "Robes", "Accessoires"];
// Tu peux changer le mot de passe admin ici !
const ADMIN_PASSWORD = "IAI_TOGO_ADMIN"; 

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  // SÉCURITÉ : États pour l'authentification locale
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [productForm, setProductForm] = useState<Product>({
    name: "",
    price: 0,
    category: "T-shirts",
    image: "",
    tag: "",
    stock: 1
  });

  // Vérifie si l'admin s'est déjà connecté auparavant
  useEffect(() => {
    const sessionAuth = localStorage.getItem("is_admin_authenticated");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
      fetchProducts();
    }
  }, []);

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

  // Gère la connexion locale
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      localStorage.setItem("is_admin_authenticated", "true");
      setIsAuthenticated(true);
      setLoginError(false);
      fetchProducts();
    } else {
      setLoginError(true);
    }
  };

  // Gère la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("is_admin_authenticated");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  const startEdit = (product: Product) => {
    if (product.id) {
      setEditingId(product.id);
      setProductForm({ ...product });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setProductForm({ name: "", price: 0, category: "T-shirts", image: "", tag: "" , stock: 1 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        fetchProducts();
        cancelEdit();
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

  // ÉCRAN DE CONNEXION (Si non authentifié)
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50/50">
        <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center">
          <div className="mx-auto w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Accès Restreint</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">Veuillez saisir le mot de passe administrateur pour gérer la boutique.</p>
          
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">Mot de passe</label>
              <Input 
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className={loginError ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {loginError && (
                <p className="text-xs font-semibold text-red-500 mt-1">Mot de passe incorrect.</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-xs py-5">
              Se connecter
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // INTERFACE ADMIN PRINCIPALE (Si authentifié)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* EN-TÊTE DE LA PAGE */}
      <div className="border-b border-slate-200 pb-5 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div>
    <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-2">
      <ShieldCheck className="h-8 w-8 text-emerald-600" /> Espace Administration
    </h1>
    <p className="text-sm text-slate-500 mt-1">Ajoutez, modifiez et gérez les stocks en temps réel.</p>
  </div>
  
  {/* BLOC DES BOUTONS DE NAVIGATION ET DÉCONNEXION */}
  <div className="flex items-center gap-3 self-start sm:self-center">
    <Link to="/">
      <Button variant="outline" className="text-xs font-bold uppercase tracking-wider border-slate-200 text-slate-600 hover:bg-slate-50">
        Voir le site
      </Button>
    </Link>
    
    <Button onClick={handleLogout} variant="outline" className="text-xs font-bold uppercase tracking-wider border-red-200 text-red-600 hover:bg-red-50">
      Déconnexion
    </Button>
  </div>
</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* FORMULAIRE GAUCHE : AJOUT OU ÉDITION */}
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

        {/* LISTE DE CONTRÔLE INTERACTIVE */}
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
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  // 1. On prépare les données au format attendu par Web3Forms
  const payload = {
    access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY, // Colles ici la clé reçue par mail
    name: formData.name,
    email: formData.email,
    subject: `[Boutique] - ${formData.subject}`,
    message: formData.message,
  };

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      alert("Votre message a bien été envoyé ! Vous allez recevoir une confirmation.");
      setFormData({ name: "", email: "", subject: "", message: "" }); // Reset du formulaire
    } else {
      console.error("Erreur Web3Forms:", result);
      alert("Une erreur est survenue lors de l'envoi du message.");
    }
  } catch (error) {
    console.error("Erreur réseau:", error);
    alert("Impossible de joindre le service d'envoi. Vérifiez votre connexion internet.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* EN-TÊTE DE LA PAGE */}
      <div className="border-b border-slate-200 pb-6 mb-12 text-center md:text-left">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Contactez-nous</h1>
        <p className="text-sm text-slate-500 mt-2">Une question sur une taille, une commande ou un retour ? Notre équipe vous répond.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* BLOC GAUCHE : INFOS DE CONTACT (Prend 1 colonne sur 3) */}
        <div className="lg:col-span-1 space-y-8 bg-slate-900 text-white p-8 rounded-2xl shadow-sm relative overflow-hidden">
          {/* Petit effet visuel en fond */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-600/10 rounded-full blur-2xl" />

          <div className="space-y-2">
            <h2 className="text-xl font-bold uppercase tracking-tight">Nos Coordonnées</h2>
            <p className="text-xs text-slate-400">N'hésitez pas à nous joindre directement par email ou sur nos plateformes.</p>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-amber-500">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email</p>
                <p className="text-sm font-semibold">contact@vetement.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-amber-500">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Téléphone</p>
                <p className="text-sm font-semibold">+228 90 00 00 00</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-amber-500">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Adresse</p>
                <p className="text-sm font-semibold">Lomé, Togo</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 text-[11px] text-slate-500 font-medium">
            Horaires d'ouverture : Lun - Ven • 8h00 - 18h00
          </div>
        </div>

        {/* BLOC DROITE : FORMULAIRE INTERACTIF (Prend 2 colonnes sur 3) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-8 text-amber-600 font-bold uppercase tracking-wider text-sm">
            <MessageSquare className="h-5 w-5" />
            <h2>Envoyer un message</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-600">Votre Nom</label>
                <Input 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="ex: Al Hafid" 
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-600">Adresse Email</label>
                <Input 
                  required 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="ex: al@exemple.com" 
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600">Sujet du message</label>
              <Input 
                required 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="ex: Question sur la livraison d'un article" 
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600">Message</label>
              <Textarea 
                required 
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Écrivez votre message ici..." 
                className="rounded-xl resize-none"
              />
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-xs py-5 px-8 rounded-xl shadow-md gap-2"
              >
                <Send className="h-4 w-4" />
                {loading ? "Envoi en cours..." : "Envoyer le message"}
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
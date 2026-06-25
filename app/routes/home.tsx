import type { Route } from "./+types/home";

import Accueil from "./Accueil";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BOUTIQUE" },
    { name: "description", content: "VENTE DE VÊTEMENTS" },
  ];
}

export default function Home() {
  return <Accueil />;
}


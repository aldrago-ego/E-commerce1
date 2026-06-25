import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    route("AdminPage", "routes/AdminPage.tsx"),
   layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("Accueil", "routes/Accueil.tsx"),
    route("catalogue", "routes/catalogue.tsx"),
    // Modifie la ligne ci-dessous avec le chemin dynamique :
    route("catalogue/:id", "routes/ProductDetailPage.tsx"),
    route("contact", "routes/contact.tsx"),
  ])
] satisfies RouteConfig;

import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("Accueil", "routes/Accueil.tsx"),
    route("catalogue", "routes/catalogue.tsx"),
    route("contact", "routes/contact.tsx"),
])

] satisfies RouteConfig;

# Operación Sur 2027 🏔️

Planificador interactivo del road trip familiar **Santiago → Osorno → Bariloche → Pucón → Santiago**
(2 familias · 9 personas · 10–14 días · salida 04:00).

## Qué hace

- **Mapa interactivo** con las rutas reales (OSRM), paradas, pasos fronterizos y todos los puntos del catálogo
  en capas por categoría (alojamiento / atracción / comida / combustible / extras).
- **Itinerario día a día** (10–14 días configurable) con la madrugada épica del día 1 y píldoras
  conectadas al catálogo.
- **Catálogo de 69 opciones** con fuentes reales: casas para 9 en Airbnb/Booking (o 2 cabañas por familia
  en el mismo recinto), termas con tarifas oficiales (CONAF/Pases Parques, Rutenica, Termas Geométricas),
  restaurantes top de TripAdvisor, combustible y peajes por tramo.
- **Presupuesto vivo**: cada ítem que se agrega suma al total (y se divide por persona/día/familia).
  Todos los precios son **editables** — al confirmar un precio real, se cambia en un clic.
- **Checklist fronterizo** (cédulas, padrón, seguro Mercosur, formulario de salida temporal…).
- El plan se guarda solo en el navegador y se comparte con **Compartir plan** (enlace con el plan incluido).

## Stack

HTML + Vue 3 (CDN) + Leaflet/OSM + OSRM — sin build, servible en GitHub Pages.

## Fuentes de precios (oct 2026)

Bencina (Bencina en Línea / YPF), peajes (Autofact/MOP), alojamiento (Airbnb, Booking, MercadoLibre,
Parairnos), termas y parques (CONAF/Pases Parques, Rutenica, Termas Geométricas, Catedral Alta Patagonia),
restaurantes (TripAdvisor/Turismocity). Precios de referencia — editables en la página.

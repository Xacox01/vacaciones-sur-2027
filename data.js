/* ============================================================
   Operación Sur 2027 — datos del viaje
   Santiago → Osorno → Bariloche → Pucón → Santiago
   2 familias · 9 personas · 12 días (configurable 10–14)
   Precios: referencias de mercado (oct 2026) — TODOS editables
   en la interfaz. Fuentes en cada ítem.
   ============================================================ */

const FX = {
  arsPorClp: 1.55,        // 1 CLP ≈ 1,55 ARS (oct 2026, global66/wise)
  clpPorUsd: 982          // oct 2026 (Bloomberg Línea)
};

const VIAJE = {
  titulo: "Operación Sur 2027",
  subt: "Santiago · Osorno · Bariloche · Pucón",
  dias: 12,                 // 10–14
  salida: "04:00",          // madrugada épica
  vehiculos: 1,             // toggle 1 van grande / 2 autos
  consumo: 10,              // L por 100 km
  bencina_cl: 1250,         // CLP/L bencina 95 (oct 2026, Copec ~$1.240)
  bencina_ar: 2100,         // ARS/L nafta súper YPF (oct 2026, CABA $2.099)
  familias: [
    { nombre: "Familia 1", adultos: 2, ninos: 3 },
    { nombre: "Familia 2", adultos: 2, ninos: 2 }
  ]
};

/* --- Tramos del recorrido (waypoints gruesos; el mapa dibuja las
       rutas reales con OSRM; si falla, línea recta por waypoints) --- */
const TRAMOS = [
  {
    id: "t1", de: "Santiago", a: "Osorno", km: 915, h: "10–11 h", pais: "CL",
    ruta: "Ruta 5 Sur", dia: 1, icono: "🚗",
    nota: "Salida 04:00 — pico de ciudad evitado y llegada con luz. Parada estrella: Salto del Laja.",
    wp: [[-33.4489,-70.6693],[-34.1708,-70.7444],[-35.4264,-71.6554],[-36.6066,-72.1034],[-37.4700,-72.3530],[-38.7359,-72.5904],[-39.6503,-72.9600],[-40.5745,-73.1339]],
    paradas: [
      { n: "Desayuno ruta (Copec / Café 4 Caminos)", km: 180, t: "07:30" },
      { n: "Salto del Laja — parada estrella", km: 480, t: "09:30" },
      { n: "Almuerzo Collipulli / Victoria", km: 640, t: "12:30" },
      { n: "Café + bencina Temuco", km: 780, t: "14:30" }
    ]
  },
  {
    id: "t2", de: "Osorno", a: "Bariloche", km: 210, h: "3,5 h + frontera", pais: "CL→AR",
    ruta: "Ruta 215 · Paso Cardenal Samoré · RN231", dia: 3, icono: "🏔️",
    nota: "Cruce Cardenal Samoré. Parada obligada: Villa La Angostura y el Bosque de Arrayanes.",
    wp: [[-40.5745,-73.1339],[-40.6511,-72.7000],[-40.8358,-72.0075],[-40.7642,-71.6418],[-41.0500,-71.4500],[-41.1335,-71.3103]],
    paradas: [
      { n: "Cruce fronterizo Cardenal Samoré", km: 105, t: "10:30" },
      { n: "Villa La Angostura — Bosque de Arrayanes", km: 145, t: "12:00" },
      { n: "Llegada Bariloche + chocolate caliente", km: 210, t: "17:00" }
    ]
  },
  {
    id: "t3", de: "Bariloche", a: "Pucón", km: 430, h: "8 h con frontera", pais: "AR→CL",
    ruta: "Ruta de los 7 Lagos · San Martín · Paso Tromen", dia: 7, icono: "🛣️",
    nota: "El tramo más lindo del viaje: 7 lagos, San Martín de los Andes, paso Mamuil Malal (Tromen).",
    wp: [[-41.1335,-71.3103],[-40.8700,-71.5900],[-40.6809,-71.6511],[-40.1571,-71.3539],[-39.9439,-71.5055],[-39.6400,-71.5400],[-39.2837,-72.3259]],
    paradas: [
      { n: "Siete Lagos — miradores y fotos", km: 95, t: "10:00" },
      { n: "San Martín de los Andes — almuerzo", km: 145, t: "12:30" },
      { n: "Paso Mamuil Malal (Tromen)", km: 330, t: "16:30" },
      { n: "Llegada Pucón", km: 430, t: "18:30" }
    ]
  },
  {
    id: "t4", de: "Pucón", a: "Santiago", km: 780, h: "8,5–9 h", pais: "CL",
    ruta: "Ruta 5 Norte", dia: 12, icono: "🏠",
    nota: "Última jornada. Opción: parada en Salto del Laja (otra cara) o empujar directo a casa.",
    wp: [[-39.2837,-72.3259],[-38.7359,-72.5904],[-37.4700,-72.3530],[-36.6066,-72.1034],[-35.4264,-71.6554],[-34.1708,-70.7444],[-33.4489,-70.6693]],
    paradas: [
      { n: "Desayuno Villarrica", km: 30, t: "08:30" },
      { n: "Almuerzo Chillán / Los Ángeles", km: 420, t: "13:00" },
      { n: "Llegada a casa", km: 780, t: "18:00" }
    ]
  }
];

/* --- ÍTEMS (catálogo completo) ---
   cat: alojamiento | atraccion | comida | ruta | extra
   unit: noche (grupo) | persona | grupo | vehiculo
   moneda: CLP | ARS  (ARS se convierte con FX)
   precio_nino: opcional (atracciones con tarifa infantil)
   sugerido: se agrega al plan recomendado inicial
   geo: [lat,lng] para el mapa                                    */
const ITEMS = [
  /* ══════════ RUTA D1: SANTIAGO → OSORNO ══════════ */
  { id: "benc-t1", cat: "ruta", base: "Ruta 5 Sur", nombre: "Bencina Santiago → Osorno", desc: "915 km con ~10 L/100 km. Tanquear lleno en Santiago (más barato que la región).", precio: 114400, moneda: "CLP", unit: "vehiculo", geo: [-33.4489,-70.6693], sugerido: true, fuente: { n: "Bencina en Línea / Copec", u: "https://www.bencinaenlinea.cl" } },
  { id: "peaje-t1", cat: "ruta", base: "Ruta 5 Sur", nombre: "Peajes Ruta 5 Sur (Santiago → Osorno)", desc: "Troncales Santiago–Talca–Chillán–Collipulli–Temuco + laterales. Valor 2026.", precio: 21000, moneda: "CLP", unit: "vehiculo", geo: [-35.4264,-71.6554], sugerido: true, fuente: { n: "Autofact / peajes 2026", u: "https://www.autofact.cl/blog/mi-auto/tag/peajes-ruta-5-sur" } },
  { id: "saltolaja", cat: "atraccion", base: "En el camino", nombre: "Salto del Laja (Los Ángeles)", desc: "Cuatro saltos de hasta 35 m, miradores y puente colgante. ¡Entrada GRATIS! Parada perfecta a media mañana.", precio: 0, moneda: "CLP", unit: "grupo", geo: [-37.1531,-72.4399], rating: 4.5, sugerido: true, fuente: { n: "TripAdvisor", u: "https://www.tripadvisor.es/Attraction_Review-g488177-d7225254-Reviews-Saltos_del_Laja-Los_Angeles_Biobio_Region.html" } },
  { id: "est-saltolaja", cat: "ruta", base: "En el camino", nombre: "Estacionamiento Salto del Laja", desc: "Estacionamiento en el acceso a las cataratas.", precio: 3000, moneda: "CLP", unit: "vehiculo", geo: [-37.1531,-72.4399], sugerido: true, fuente: { n: "Relatos Nómadas", u: "https://relatosnomadas.com/visitar-salto-del-laja" } },
  { id: "desay-t1", cat: "comida", base: "En el camino", nombre: "Desayuno ruta (Copec / Café 4 Caminos)", desc: "Café, pan amasado y sopaipillas a las 07:30 — tradición de salida al sur.", precio: 6000, moneda: "CLP", unit: "persona", geo: [-34.5,-70.9], sugerido: true, fuente: { n: "Referencial ruta 5", u: "" } },
  { id: "almuer-t1", cat: "comida", base: "En el camino", nombre: "Almuerzo Collipulli / Victoria", desc: "Menú picada sureño (cazuela o churrasco) para recargar.", precio: 9000, moneda: "CLP", unit: "persona", geo: [-37.5667,-72.35], sugerido: true, fuente: { n: "Referencial ruta 5", u: "" } },
  { id: "cena-d1", cat: "comida", base: "Osorno", nombre: "Cena llegada Osorno (día 1)", desc: "Llegada ~15:30, caminar la costanera del Rahue y cena relajada.", precio: 12000, moneda: "CLP", unit: "persona", geo: [-40.5745,-73.1339], sugerido: true, fuente: { n: "Referencial", u: "" } },

  /* ══════════ OSORNO (base 1 · días 1–3) ══════════ */
  { id: "alo-osorno-1", cat: "alojamiento", base: "Osorno", nombre: "Casa Ann — casa entera remodelada (Airbnb)", desc: "Casa completa equipada, amplia, calefacción y estacionamiento. Ideal 9 personas.", precio: 110000, moneda: "CLP", unit: "noche", geo: [-40.5708,-73.1350], rating: 4.9, sugerido: true, fuente: { n: "Airbnb · Casa Ann", u: "https://es.airbnb.com/rooms/44647528" } },
  { id: "alo-osorno-2", cat: "alojamiento", base: "Osorno", nombre: "Cabaña grande entera familiar N1 (Airbnb)", desc: "Parcela de agrado a 5 min del centro. Opción más económica.", precio: 95000, moneda: "CLP", unit: "noche", geo: [-40.5610,-73.1240], rating: 4.8, sugerido: false, fuente: { n: "Airbnb · Cabaña N1", u: "https://es.airbnb.com/rooms/1254201974460131456" } },
  { id: "alo-osorno-3", cat: "alojamiento", base: "Osorno", nombre: "2 cabañas (una por familia) — mismo recinto, Puyehue", desc: "Alternativa multifamiliar a 20 min de las termas: una cabaña por familia en el mismo predio.", precio: 125000, moneda: "CLP", unit: "noche", geo: [-40.6522,-72.4329], rating: 4.7, sugerido: false, fuente: { n: "Parairnos (cabañas 9 pax)", u: "https://www.parairnos.cl/cabanas-en-chile-para-9-personas" } },
  { id: "termas-aguascalientes", cat: "atraccion", base: "Osorno", nombre: "Termas Aguas Calientes — P.N. Puyehue", desc: "Piscinas termales al aire libre dentro del parque nacional. Adulto $13.000 · niño $8.400.", precio: 13000, precio_nino: 8400, moneda: "CLP", unit: "persona", geo: [-40.7567,-72.4258], rating: 4.7, sugerido: true, fuente: { n: "Rutenica (tarifas oficiales)", u: "https://www.rutenica.cl/products/entrada-piscina-al-aire-libre-termas-aguas-calientes-puyehue" } },
  { id: "pn-puyehue", cat: "atraccion", base: "Osorno", nombre: "P.N. Puyehue — senderos y Antillanca", desc: "Bosques valdivianos, senderos y vistas al volcán Puyehue. Entrada vía Pases Parques.", precio: 5000, precio_nino: 2500, moneda: "CLP", unit: "persona", geo: [-40.6800,-72.1800], rating: 4.8, sugerido: true, fuente: { n: "Pases Parques CONAF", u: "https://www.pasesparques.cl" } },
  { id: "pilmaiquen", cat: "atraccion", base: "Osorno", nombre: "Saltos del Pilmaiquén", desc: "El 'Petrohué chico': saltos turquesa a 40 min de Osorno. Poco conocido y espectacular.", precio: 5000, moneda: "CLP", unit: "persona", geo: [-40.6344,-72.7567], rating: 4.6, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "frutillar", cat: "atraccion", base: "Osorno", nombre: "Frutillar Bajo + Teatro del Lago", desc: "Pueblo patrimonial a orillas del Llanquihue con vista al volcán Osorno. Tour por el teatro.", precio: 10000, precio_nino: 5000, moneda: "CLP", unit: "persona", geo: [-41.1286,-73.0618], rating: 4.9, sugerido: true, fuente: { n: "Teatro del Lago", u: "https://www.teatrodellago.cl" } },
  { id: "kuchen-frutillar", cat: "comida", base: "Osorno", nombre: "Kuchen alemán en Latitud 42° (Frutillar)", desc: "La capital mundial del kuchen: una ronda de kuchen + café frente al lago.", precio: 8000, moneda: "CLP", unit: "persona", geo: [-41.1305,-73.0641], rating: 4.8, sugerido: true, fuente: { n: "Latitud 42°", u: "https://www.latitud42.cl" } },
  { id: "puerto-octay", cat: "atraccion", base: "Osorno", nombre: "Puerto Octay y lago Rupanco", desc: "Bahía de casas centenarias y miradores del Rupanco. Gratuito.", precio: 0, moneda: "CLP", unit: "grupo", geo: [-40.8759,-72.8911], rating: 4.7, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "cassata", cat: "comida", base: "Osorno", nombre: "Cassata Ristorante (Osorno)", desc: "Clásico italiano local, pastas caseras — el más recomendado de la ciudad.", precio: 14000, moneda: "CLP", unit: "persona", geo: [-40.5737,-73.1361], rating: 4.6, sugerido: true, fuente: { n: "TripAdvisor Osorno", u: "https://www.tripadvisor.cl/Restaurants-g303674-Osorno_Los_Lagos_Region.html" } },
  { id: "coiron", cat: "comida", base: "Osorno", nombre: "Coirón — parrilla (Osorno)", desc: "Asados y platos sureños contundentes.", precio: 15000, moneda: "CLP", unit: "persona", geo: [-40.5700,-73.1400], rating: 4.5, sugerido: false, fuente: { n: "Referencial", u: "" } },

  /* ══════════ RUTA D3: OSORNO → VLA → BARILOCHE ══════════ */
  { id: "benc-t2", cat: "ruta", base: "Osorno → Bariloche", nombre: "Bencina Osorno → Bariloche", desc: "210 km. Truco: tanquear en Chile antes del paso (la nafta argentina hoy sale más cara).", precio: 27500, moneda: "CLP", unit: "vehiculo", geo: [-40.7642,-71.6418], sugerido: true, fuente: { n: "Copec/YPF oct 2026", u: "" } },
  { id: "peaje-t2", cat: "ruta", base: "Osorno → Bariloche", nombre: "Peajes RN231/RN40 (Argentina)", desc: "Pocos peajes en Patagonia argentina; presupuesto de referencia.", precio: 5200, moneda: "ARS", unit: "vehiculo", geo: [-40.9,-71.9], sugerido: true, fuente: { n: "Referencial Vialidad Nacional", u: "" } },
  { id: "arrayanes-vla", cat: "atraccion", base: "En el camino", nombre: "Bosque de Arrayanes (Villa La Angostura)", desc: "Caminata ida y vuelta (o arriendo de bicis) entre arrayanes rojizos hasta la península.", precio: 9700, moneda: "ARS", unit: "persona", geo: [-40.7550,-71.6667], rating: 4.8, sugerido: true, fuente: { n: "Parques Nacionales AR", u: "https://www.argentina.gob.ar/interior/parquesnacionales" } },
  { id: "cerrobayo", cat: "atraccion", base: "En el camino", nombre: "Cerro Bayo (Villa La Angostura)", desc: "Telecabina con vista al lago Nahuel Huapi y toda la cordillera.", precio: 22600, moneda: "ARS", unit: "persona", geo: [-40.7690,-71.6230], rating: 4.6, sugerido: false, fuente: { n: "Cerro Bayo", u: "" } },
  { id: "almuer-vla", cat: "comida", base: "En el camino", nombre: "Almuerzo Villa La Angostura", desc: "Trucha o cerveza artesanal local frente al lago.", precio: 14200, moneda: "ARS", unit: "persona", geo: [-40.7642,-71.6418], rating: 4.6, sugerido: true, fuente: { n: "TripAdvisor VLA", u: "https://www.tripadvisor.com.ar/Restaurants-g312838-Villa_La_Angostura_Province_of_Neuquen.html" } },

  /* ══════════ BARILOCHE (base 2 · días 3–7) ══════════ */
  { id: "alo-brc-1", cat: "alojamiento", base: "Bariloche", nombre: "Casa con vista al lago para 10 pax (Booking)", desc: "Casa completa con terraza, jardín y vista al Nahuel Huapi. Enero 2027, temporada alta.", precio: 445000, moneda: "ARS", unit: "noche", geo: [-41.1200,-71.3200], rating: 9.0, sugerido: true, fuente: { n: "Booking · Casa vista al lago 10 pax", u: "https://www.booking.com/hotel/ar/casa-con-vista-al-lago-para-10-pax.es-ar.html" } },
  { id: "alo-brc-2", cat: "alojamiento", base: "Bariloche", nombre: "Casa de campo con costa de lago — Villa Campanario (Booking)", desc: "Casa amplia con jardín gigante y acceso a la costa del lago.", precio: 400000, moneda: "ARS", unit: "noche", geo: [-41.0700,-71.4200], rating: 8.8, sugerido: false, fuente: { n: "Booking · Villa Campanario", u: "https://www.booking.com/hotel/ar/casa-de-campo-villa-campanario1.es-ar.html" } },
  { id: "alo-brc-3", cat: "alojamiento", base: "Bariloche", nombre: "2 cabañas (una por familia) — mismo predio, Melipal", desc: "Cabaña 5 pax + cabaña 4 pax en el mismo predio arbolado. Flexibilidad total entre familias.", precio: 465000, moneda: "ARS", unit: "noche", geo: [-41.1000,-71.4000], rating: 8.9, sugerido: false, fuente: { n: "MercadoLibre AR", u: "https://listado.mercadolibre.com.ar/alquiler-bariloche-8-personas" } },
  { id: "catedral-verano", cat: "atraccion", base: "Bariloche", nombre: "Cerro Catedral — telecabina de verano", desc: "Subida a ~1.900 m: miradores del Nahuel Huapi y senderos de cumbre. Adulto ~ARS 60.000 · niño ~ARS 45.000.", precio: 38700, moneda: "ARS", precio_nino: 29000, unit: "persona", geo: [-41.1651,-71.4415], rating: 4.7, sugerido: true, fuente: { n: "Catedral Alta Patagonia", u: "https://catedralaltapatagonia.com/tarifas" } },
  { id: "campanario", cat: "atraccion", base: "Bariloche", nombre: "Cerro Campanario — aerosilla", desc: "Una de las mejores vistas del mundo según National Geographic.", precio: 7700, moneda: "ARS", unit: "persona", geo: [-41.1269,-71.5386], rating: 4.8, sugerido: true, fuente: { n: "Cerro Campanario", u: "" } },
  { id: "circuito-chico", cat: "atraccion", base: "Bariloche", nombre: "Circuito Chico completo (en auto)", desc: "Playa Bonita, Llao Llao, península y Bahía López. Gratuito (sin aerosillas).", precio: 0, moneda: "CLP", unit: "grupo", geo: [-41.0400,-71.5480], rating: 4.9, sugerido: true, fuente: { n: "Turismo Bariloche", u: "https://www.bariloche.gov.ar" } },
  { id: "isla-victoria", cat: "atraccion", base: "Bariloche", nombre: "Catamarán Isla Victoria + Bosque de Arrayanes", desc: "Navegación desde Puerto Pañuelo, bosque de arrayanes y senderos en la isla. Adulto ~ARS 75.000 · niño ~ARS 45.000.", precio: 48400, moneda: "ARS", precio_nino: 29000, unit: "persona", geo: [-41.0592,-71.5355], rating: 4.7, sugerido: false, fuente: { n: "Cruceros del Lago", u: "https://www.crucerosdelago.com" } },
  { id: "cerro-otto", cat: "atraccion", base: "Bariloche", nombre: "Cerro Otto — aerosilla y confitería giratoria", desc: "Vista 360° y la confitería giratoria, única en Sudamérica.", precio: 9700, moneda: "ARS", unit: "persona", geo: [-41.0970,-71.4700], rating: 4.6, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "colonia-suiza", cat: "atraccion", base: "Bariloche", nombre: "Colonia Suiza + Museo Petersen", desc: "Pueblo de colonos suizos: historias, cerveza artesanal y curanto los miércoles/domingos.", precio: 0, moneda: "CLP", unit: "grupo", geo: [-41.0970,-71.5062], rating: 4.7, sugerido: false, fuente: { n: "Turismo Bariloche", u: "" } },
  { id: "museo-chocolate", cat: "atraccion", base: "Bariloche", nombre: "Museo del Chocolate (Familia Weiss)", desc: "Historia del chocolate barilochense con degustación — la aman los niños.", precio: 5200, moneda: "ARS", unit: "persona", geo: [-41.1340,-71.3090], rating: 4.6, sugerido: true, fuente: { n: "Familia Weiss", u: "https://www.familiaweiss.com.ar" } },
  { id: "rafting-manso", cat: "atraccion", base: "Bariloche", nombre: "Rafting Río Manso (familias)", desc: "Río manso a water level con tramos aptos para niños. Medio día con instructores.", precio: 38200, moneda: "ARS", unit: "persona", geo: [-41.1800,-71.5800], rating: 4.9, sugerido: false, fuente: { n: "Operadores locales (referencial)", u: "" } },
  { id: "boliche-alberto", cat: "comida", base: "Bariloche", nombre: "El Boliche de Alberto — parrilla", desc: "Institución de la parrilla barilochense: bife de chorizo y papas rústicas.", precio: 22600, moneda: "ARS", unit: "persona", geo: [-41.1345,-71.3075], rating: 4.6, sugerido: true, fuente: { n: "Turismocity / TripAdvisor", u: "https://www.tripadvisor.es/Restaurants-g312848-San_Carlos_de_Bariloche_Province_of_Rio_Negro_Patagonia.html" } },
  { id: "weiss-confiteria", cat: "comida", base: "Bariloche", nombre: "Confitería Familia Weiss", desc: "Chocolate caliente con churros y facturas frente al Centro Cívico.", precio: 7700, moneda: "ARS", unit: "persona", geo: [-41.1337,-71.3087], rating: 4.7, sugerido: true, fuente: { n: "Familia Weiss", u: "" } },
  { id: "la-marmite", cat: "comida", base: "Bariloche", nombre: "La Marmite — fondue", desc: "Fondue de queso y chocolate para una noche fresca patagónica.", precio: 24500, moneda: "ARS", unit: "persona", geo: [-41.1320,-71.3120], rating: 4.5, sugerido: false, fuente: { n: "TripAdvisor", u: "" } },
  { id: "blest", cat: "comida", base: "Bariloche", nombre: "Cervecería Blest (Colonia Suiza)", desc: "Cerveza artesanal pionera junto al lago Moreno; platos alemanes.", precio: 14200, moneda: "ARS", unit: "persona", geo: [-41.0900,-71.5200], rating: 4.6, sugerido: true, fuente: { n: "TripAdvisor", u: "" } },
  { id: "manush", cat: "comida", base: "Bariloche", nombre: "Manush — cervecería artesanal (centro)", desc: "Hamburguesas y cervezas propias, ambiente familiar al mediodía.", precio: 12900, moneda: "ARS", unit: "persona", geo: [-41.1338,-71.3096], rating: 4.6, sugerido: false, fuente: { n: "TripAdvisor", u: "" } },
  { id: "super-brc", cat: "comida", base: "Bariloche", nombre: "Despensa supermercado (La Anónima) 4 días", desc: "Desayunos y meriendas en la casa: cereales, pan, dulce de leche, frutas, jugos.", precio: 116000, moneda: "ARS", unit: "grupo", geo: [-41.1300,-71.3100], sugerido: true, fuente: { n: "Referencial La Anónima", u: "" } },

  /* ══════════ RUTA D7: BARILOCHE → PUCÓN (7 lagos) ══════════ */
  { id: "siete-lagos", cat: "atraccion", base: "En el camino", nombre: "Ruta de los Siete Lagos (RN234)", desc: "Lagos Correntoso, Espejo, Villarino, Falkner, Machónico, Lácar… paradas de foto cada 10 min. Gratuita.", precio: 0, moneda: "CLP", unit: "grupo", geo: [-40.6809,-71.6511], rating: 5.0, sugerido: true, fuente: { n: "Neuquén Turismo", u: "https://www.neuquentur.gob.ar" } },
  { id: "almuer-sml", cat: "comida", base: "En el camino", nombre: "Almuerzo San Martín de los Andes", desc: "Trucha ahumada o ciervo en la avenida del lago Lácar.", precio: 16100, moneda: "ARS", unit: "persona", geo: [-40.1571,-71.3539], rating: 4.7, sugerido: true, fuente: { n: "TripAdvisor SML", u: "" } },
  { id: "benc-t3", cat: "ruta", base: "Bariloche → Pucón", nombre: "Bencina Bariloche → Pucón (vía 7 Lagos)", desc: "430 km. Tanquear en San Martín o Junín (sin fila en el paso).", precio: 58300, moneda: "ARS", unit: "vehiculo", geo: [-39.9439,-71.5055], sugerido: true, fuente: { n: "YPF oct 2026", u: "" } },
  { id: "peaje-t3", cat: "ruta", base: "Bariloche → Pucón", nombre: "Peajes RN40/RN234 + paso Tromen", desc: "Referencia de peajes argentinos del tramo.", precio: 3200, moneda: "ARS", unit: "vehiculo", geo: [-39.6400,-71.5400], sugerido: true, fuente: { n: "Referencial", u: "" } },

  /* ══════════ PUCÓN (base 3 · días 7–12) ══════════ */
  { id: "alo-puc-1", cat: "alojamiento", base: "Pucón", nombre: "Casa grande centro Pucón 10–14 pax (Airbnb)", desc: "4 dormitorios, 3 baños, pensada para familias grandes — multifamiliar. Mínimo 10 personas.", precio: 210000, moneda: "CLP", unit: "noche", geo: [-39.2837,-72.3259], rating: 4.4, sugerido: true, fuente: { n: "Airbnb · Casa grande Pucón", u: "https://es.airbnb.com/rooms/22561846" } },
  { id: "alo-puc-2", cat: "alojamiento", base: "Pucón", nombre: "Cabaña 8–9 pax con piscina (Booking)", desc: "Cabaña con terraza, jardín y piscina temperada — a 5 min de la playa.", precio: 180000, moneda: "CLP", unit: "noche", geo: [-39.2900,-72.3300], rating: 4.7, sugerido: false, fuente: { n: "Booking · Cabaña playa 8 personas", u: "https://www.booking.com/hotel/cl/cabana-playa-8-personas.es.html" } },
  { id: "alo-puc-3", cat: "alojamiento", base: "Pucón", nombre: "2 cabañas 5 pax mismo recinto (sector Caburgua)", desc: "Una por familia, quincho compartido y bosque nativo.", precio: 220000, moneda: "CLP", unit: "noche", geo: [-39.3190,-72.1510], rating: 4.8, sugerido: false, fuente: { n: "Parairnos", u: "https://www.parairnos.cl/cabanas-en-chile-para-9-personas" } },
  { id: "termas-geometricas", cat: "atraccion", base: "Pucón", nombre: "Termas Geométricas ⭐", desc: "17 piscinas de piedra en un barranco del P.N. Villarrica — el baño termal más lindo de Chile. Adulto ~$50.000 · niño ~$40.000. Llevar sandwich.", precio: 50000, precio_nino: 40000, moneda: "CLP", unit: "persona", geo: [-39.3964,-71.8446], rating: 4.8, sugerido: true, fuente: { n: "Termas Geométricas (oficial)", u: "https://termasgeometricas.cl" } },
  { id: "pn-villarrica", cat: "atraccion", base: "Pucón", nombre: "P.N. Villarrica — senderos con vista al cráter", desc: "Senderos con vistas del volcán humeante. Entrada Pases Parques: adulto $3.000 · niño $1.500.", precio: 3000, precio_nino: 1500, moneda: "CLP", unit: "persona", geo: [-39.4202,-71.9309], rating: 4.8, sugerido: true, fuente: { n: "Pases Parques CONAF", u: "https://www.pasesparques.cl" } },
  { id: "ascenso-villarrica", cat: "atraccion", base: "Pucón", nombre: "Ascenso al volcán Villarrica (con guía)", desc: "La gran aventura: cráter activo a 2.847 m. Solo mayores de 14, guiado obligatorio. Muy exigente.", precio: 150000, moneda: "CLP", unit: "persona", geo: [-39.4202,-71.9309], rating: 4.9, sugerido: false, fuente: { n: "Operadores Pucón (referencial)", u: "" } },
  { id: "huerquehue", cat: "atraccion", base: "Pucón", nombre: "P.N. Huerquehue — sendero Los Lagos", desc: "Cascadas Nido de Águila + lagunas de montaña sobre el lago Tinquilco. Adulto $3.000 · niño $1.500.", precio: 3000, precio_nino: 1500, moneda: "CLP", unit: "persona", geo: [-39.2903,-72.2003], rating: 4.9, sugerido: true, fuente: { n: "CONAF", u: "https://www.conaf.cl/parque_nacionales/parque-nacional-huerquehue" } },
  { id: "ojos-caburgua", cat: "atraccion", base: "Pucón", nombre: "Ojos del Caburgua", desc: "Saltos de agua azul turquesa en formación volcánica, a 15 min de Pucón.", precio: 5000, precio_nino: 3000, moneda: "CLP", unit: "persona", geo: [-39.3190,-72.1510], rating: 4.6, sugerido: true, fuente: { n: "Referencial", u: "" } },
  { id: "playa-pucon", cat: "atraccion", base: "Pucón", nombre: "Playa Pucón + kayak en el lago Villarrica", desc: "Tarde de playa con vista al volcán; arriendo de kayaks por hora.", precio: 10000, moneda: "CLP", unit: "persona", geo: [-39.2860,-72.3280], rating: 4.5, sugerido: true, fuente: { n: "Operadores playa (referencial)", u: "" } },
  { id: "salto-claro", cat: "atraccion", base: "Pucón", nombre: "Salto del Claro", desc: "Salto de 20 m con áreas de picnic bajo los árboles, a 10 min del centro.", precio: 3500, moneda: "CLP", unit: "persona", geo: [-39.3345,-72.3900], rating: 4.5, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "cavernas", cat: "atraccion", base: "Pucón", nombre: "Cavernas volcánicas del Villarrica", desc: "Túneles de lava recorribles con guía — fascinante para los niños.", precio: 12000, precio_nino: 8000, moneda: "CLP", unit: "persona", geo: [-39.3895,-71.9320], rating: 4.5, sugerido: false, fuente: { n: "Parque Volcán Villarrica", u: "" } },
  { id: "rafting-trancura", cat: "atraccion", base: "Pucón", nombre: "Rafting Trancura (tramo medio familiar)", desc: "Aventura con guías certificadas; tramo apto desde los 8 años.", precio: 25000, moneda: "CLP", unit: "persona", geo: [-39.2900,-72.3200], rating: 4.8, sugerido: false, fuente: { n: "Operadores Pucón (referencial)", u: "" } },
  { id: "termas-palguin", cat: "atraccion", base: "Pucón", nombre: "Termas de Palguín", desc: "Alternativa a Geométricas: más cerca, más barata, pozones naturales.", precio: 15000, precio_nino: 10000, moneda: "CLP", unit: "persona", geo: [-39.3560,-71.8800], rating: 4.4, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "la-maga", cat: "comida", base: "Pucón", nombre: "La Maga — parrilla y cocina de autor", desc: "Top de TripAdvisor en Pucón: cordero patagónico y carnes maduradas.", precio: 22000, moneda: "CLP", unit: "persona", geo: [-39.2845,-72.3285], rating: 4.7, sugerido: true, fuente: { n: "TripAdvisor Pucón", u: "https://www.tripadvisor.es/Restaurants-g294297-Pucon_Araucania_Region.html" } },
  { id: "tres-traphos", cat: "comida", base: "Pucón", nombre: "Tres Traphos — pastas", desc: "Pastas artesanales y salsas caseras, ambiente familiar.", precio: 18000, moneda: "CLP", unit: "persona", geo: [-39.2850,-72.3270], rating: 4.6, sugerido: true, fuente: { n: "TripAdvisor", u: "" } },
  { id: "puerto-pucon", cat: "comida", base: "Pucón", nombre: "Puerto Pucón — mariscos", desc: "El #1 de TripAdvisor: paila marina y congrio frito con vista al lago.", precio: 25000, moneda: "CLP", unit: "persona", geo: [-39.2830,-72.3260], rating: 4.7, sugerido: false, fuente: { n: "TripAdvisor #1 Pucón", u: "" } },
  { id: "el-camino-pucon", cat: "comida", base: "Pucón", nombre: "El Camino — sanguchería & bar", desc: "Sanguchos gigantes y papas — ideal con niños y sin complication.", precio: 12000, moneda: "CLP", unit: "persona", geo: [-39.2855,-72.3262], rating: 4.6, sugerido: true, fuente: { n: "TripAdvisor (516 reseñas)", u: "" } },
  { id: "feria-pucon", cat: "comida", base: "Pucón", nombre: "Feria artesanal + helados (tarde de paseo)", desc: "Artesanía mapuche, miel, souvenir y helado artesanal caminando la avenida.", precio: 6000, moneda: "CLP", unit: "persona", geo: [-39.2842,-72.3277], rating: 4.5, sugerido: true, fuente: { n: "Referencial", u: "" } },

  /* ══════════ VUELTA D12: PUCÓN → SANTIAGO ══════════ */
  { id: "benc-t4", cat: "ruta", base: "Pucón → Santiago", nombre: "Bencina Pucón → Santiago", desc: "780 km. Tanque lleno en Villarrica y recarga en Los Ángeles.", precio: 97500, moneda: "CLP", unit: "vehiculo", geo: [-38.7359,-72.5904], sugerido: true, fuente: { n: "Bencina en Línea", u: "" } },
  { id: "peaje-t4", cat: "ruta", base: "Pucón → Santiago", nombre: "Peajes Ruta 5 (Pucón → Santiago)", desc: "Troncales Temuco–Collipulli–Chillán–Talca + laterales.", precio: 19000, moneda: "CLP", unit: "vehiculo", geo: [-36.6066,-72.1034], sugerido: true, fuente: { n: "Autofact 2026", u: "" } },
  { id: "almuer-t4", cat: "comida", base: "Pucón → Santiago", nombre: "Almuerzo ruta Chillán / Los Ángeles", desc: "Menú dominical o empanadas de horno.", precio: 9000, moneda: "CLP", unit: "persona", geo: [-36.6066,-72.1034], sugerido: true, fuente: { n: "Referencial", u: "" } },
  { id: "cena-final", cat: "comida", base: "Pucón → Santiago", nombre: "Cena de llegada (pizza/picada en casa)", desc: "Llegada ~18:00: pedir pizza y ver las fotos del viaje todos juntos.", precio: 10000, moneda: "CLP", unit: "persona", geo: [-33.4489,-70.6693], sugerido: true, fuente: { n: "Referencial", u: "" } },

  /* ══════════ EXTRAS GLOBALES ══════════ */
  { id: "seguro-ar", cat: "extra", base: "Global", nombre: "Seguro con cobertura Argentina (Mercosur)", desc: "Obligatorio para circular en Argentina: cobertura de daños a terceros por los días del viaje.", precio: 39000, moneda: "CLP", unit: "vehiculo", geo: null, sugerido: true, fuente: { n: "Aduana Chile", u: "https://www.aduana.cl/consejos-para-viajar-a-argentina/aduana/2008-02-13/130700.html" } },
  { id: "souvenirs", cat: "extra", base: "Global", nombre: "Souvenirs y chocolates", desc: "Chocolates Bariloche, artesanía mapuche, libros… presupuesto flexible por persona.", precio: 25000, moneda: "CLP", unit: "persona", geo: null, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "imprevistos", cat: "extra", base: "Global", nombre: "Fondo de imprevistos (neumático, médico, extra)", desc: "Regla de oro de los road trips: un colchón aparte para las sorpresas.", precio: 350000, moneda: "CLP", unit: "grupo", geo: null, sugerido: true, fuente: { n: "Recomendación del planificador", u: "" } }
];

/* --- Itinerario día a día (sugerido) --- */
const ITINERARIO = [
  { dia: 1, base: "Osorno", titulo: "Madrugada épica: Santiago → Osorno", hora: "04:00",
    cuerpo: "Salida 04:00 en punto. Ruta 5 Sur con ciudad despejada, desayuno en la ruta y la gran parada del día: Salto del Laja a las 09:30. Almuerzo en Collipulli, llegada a Osorno ~15:30, caminata por la costanera del río Rahue y cena temprana.",
    items: ["saltolaja","desay-t1","almuer-t1","cena-d1"] },
  { dia: 2, base: "Osorno", titulo: "Día de termas y lagos (Puyehue o Frutillar)",
    cuerpo: "Plan A: P.N. Puyehue + Termas Aguas Calientes (día entero de bosque valdiviano y aguas calientes). Plan B (si llueve): Frutillar Bajo, Teatro del Lago y kuchen en Latitud 42°.",
    items: ["termas-aguascalientes","pn-puyehue","frutillar","kuchen-frutillar"] },
  { dia: 3, base: "Osorno → Bariloche", titulo: "Cruce a Argentina por Cardenal Samoré",
    cuerpo: "Salida 08:30. Cruce fronterizo (~1–2 h según fila: cédulas de todos + padrón + seguro). Parada en Villa La Angostura: Bosque de Arrayanes. Llegada a Bariloche al atardecer, chocolate en Familia Weiss.",
    items: ["arrayanes-vla","almuer-vla","weiss-confiteria"] },
  { dia: 4, base: "Bariloche", titulo: "Circuito Chico: el día de las vistas",
    cuerpo: "Auto por el Circuito Chico: Playa Bonita, Llao Llao, aerosilla del Campanario y tarde en Colonia Suiza. Cena parrilla en El Boliche de Alberto.",
    items: ["circuito-chico","campanario","boliche-alberto"] },
  { dia: 5, base: "Bariloche", titulo: "Cerro Catedral en verano",
    cuerpo: "Mañana en Catedral: telecabina y senderos de cumbre (o rafting en el Manso). Tarde: museo del chocolate y compras por Mitre.",
    items: ["catedral-verano","museo-chocolate","manush"] },
  { dia: 6, base: "Bariloche", titulo: "Lago: catamarán o playa + despensa",
    cuerpo: "Opción navegación: Isla Victoria + Arrayanes desde Puerto Pañuelo. Opción relax: playa de Bahía López. Noche de Blest y despensa para el resto del viaje.",
    items: ["isla-victoria","blest","super-brc"] },
  { dia: 7, base: "Bariloche → Pucón", titulo: "Ruta de los Siete Lagos + Tromen",
    cuerpo: "El día escénico: RN234 por los 7 lagos, almuerzo en San Martín de los Andes, paso Mamuil Malal (cierra 20:00 — salir temprano) y llegada a Pucón.",
    items: ["siete-lagos","almuer-sml","benc-t3","peaje-t3"] },
  { dia: 8, base: "Pucón", titulo: "Termas Geométricas ⭐",
    cuerpo: "Mañana tranquila (feria y helado), tarde/noche en las Termas Geométricas: 17 piscinas de piedra entre helechos gigantes. Llevar traje ya puesto y sandwich.",
    items: ["feria-pucon","termas-geometricas"] },
  { dia: 9, base: "Pucón", titulo: "Volcán y lagunas (Huerquehue o Villarrica)",
    cuerpo: "Senderismo en Huerquehue (lagunas de montaña) o el P.N. Villarrica. Después: Ojos del Caburgua y atardecer en la playa con vista del cráter humeante.",
    items: ["huerquehue","ojos-caburgua","playa-pucon"] },
  { dia: 10, base: "Pucón", titulo: "Día libre configurable",
    cuerpo: "Menú a elección: aventura (rafting Trancura, cavernas volcánicas) o descanso total (Salto del Claro + termas de Palguín + asado en la casa).",
    items: ["rafting-trancura","cavernas","salto-claro"] },
  { dia: 11, base: "Pucón", titulo: "Última mañana: mercado y cierre",
    cuerpo: "Compras de último momento, kayak en el lago y asado de despedida en el quincho. Maletas listas para la ruta de mañana.",
    items: ["playa-pucon","souvenirs"] },
  { dia: 12, base: "Pucón → Santiago", titulo: "Regreso a casa (780 km)",
    cuerpo: "Salida 08:30 tras desayuno en Villarrica. Ruta 5 con parada de almuerzo en Chillán. Llegada ~18:00: pizza y selección oficial de fotos del viaje.",
    items: ["benc-t4","peaje-t4","almuer-t4","cena-final"] }
];

/* --- Checklist documentos paso fronterizo --- */
const CHECKLIST = [
  "Cédula de identidad o pasaporte VIGENTE de los 9 viajeros (niños también)",
  "Padrón del vehículo y permiso de circulación",
  "Seguro con cobertura en Argentina (Mercosur) — se compra online o en el paso",
  "Formulario Salida y Admisión Temporal del vehículo (se completa en el paso)",
  "Revisión Técnica vigente + emisiones",
  "Si el auto no es del conductor: autorización notarial del propietario",
  "TAG activo (Chile) + algo de efectivo ARS/CLP para la ruta",
  "Botiquín, protector solar y agua: en el paso no hay servicios"
];

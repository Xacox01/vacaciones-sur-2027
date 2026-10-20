/* ============================================================
   Operación Sur 2027 — datos del viaje
   Santiago → Osorno → Bariloche → Pucón → Santiago
   2 familias · 9 personas · 11–15 NOCHES (12–16 días)
   Bloques de fechas propuestos:
     A) 10 ene 2027 – 5 feb 2027   B) 8 feb 2027 – 21 feb 2027
   Cada parada de ruta tiene VARIAS opciones (económico/medio/premium)
   para elegir entre precio y calidad. Precios: referencias de mercado
   (oct 2026) — TODOS editables en la interfaz. Fuentes en cada ítem.
   ============================================================ */

const FX = {
  arsPorClp: 1.55,        // 1 CLP ≈ 1,55 ARS (oct 2026, global66/wise)
  clpPorUsd: 982          // oct 2026 (Bloomberg Línea)
};

const BLOQUES = [
  { id: "A", nombre: "Bloque A · enero",  inicio: "2027-01-10", fin: "2027-02-05",
    nota: "10 de enero al 5 de febrero de 2027 — hasta 26 noches disponibles" },
  { id: "B", nombre: "Bloque B · febrero", inicio: "2027-02-08", fin: "2027-02-21",
    nota: "8 al 21 de febrero de 2027 — 13 noches fijas (tempora más baja que enero)" }
];

const VIAJE = {
  titulo: "Operación Sur 2027",
  subt: "Santiago · Osorno · Bariloche · Pucón",
  noches: 12,               // SLIDER: 11–15 noches (capado por bloque)
  salida: "04:00",          // madrugada épica
  bloque: "A",              // bloque de fechas A o B
  salidaFecha: "2027-01-10",// dentro del bloque elegido
  vehiculos: 2,             // 2 autos reales: Toyota Rush + Mazda CX-5 (peajes y misc ×2)
  tanques: { rush: 45, cx5: 58 },   // litros — Rush 45 L (Toyota Perú); CX-5 56–58 L (Autofact)
  consumos: { rush: 11, cx5: 11 },  // km por litro — promedio pedido por el dueño (editable)
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
      { n: "Desayuno ruta — 3 opciones (casa / Pronto Copec km 57 / cafetería Rancagua)", km: 180, t: "07:30" },
      { n: "Salto del Laja — parada estrella", km: 480, t: "09:30" },
      { n: "Almuerzo Collipulli / Victoria — 3 opciones", km: 640, t: "12:30" },
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
      { n: "Desayuno Villarrica — 2 opciones", km: 30, t: "08:30" },
      { n: "Almuerzo Chillán / Los Ángeles — 3 opciones", km: 420, t: "13:00" },
      { n: "Llegada a casa", km: 780, t: "18:00" }
    ]
  }
];

/* --- Marcas de km acumulado desde Santiago (para ubicar las cargas
       de bencina de la simulación de estanques; aproximaciones) --- */
const MARKS_BENC = [
  { km: 0,    lugar: "Santiago — carga inicial" },
  { km: 57,   lugar: "Angostura (Pronto Copec)" },
  { km: 180,  lugar: "Ruta 5 — zona Rancagua/Talca" },
  { km: 480,  lugar: "Salto del Laja" },
  { km: 640,  lugar: "Collipulli / Victoria" },
  { km: 780,  lugar: "Temuco" },
  { km: 915,  lugar: "Osorno" },
  { km: 1020, lugar: "Paso Cardenal Samoré (frontera)" },
  { km: 1060, lugar: "Villa La Angostura" },
  { km: 1125, lugar: "Bariloche" },
  { km: 1270, lugar: "San Martín de los Andes" },
  { km: 1400, lugar: "Junín de los Andes" },
  { km: 1455, lugar: "Paso Mamuil Malal / Tromen (frontera)" },
  { km: 1555, lugar: "Pucón" },
  { km: 1585, lugar: "Villarrica" },
  { km: 1655, lugar: "Temuco (vuelta)" },
  { km: 1825, lugar: "Los Ángeles (vuelta)" },
  { km: 1975, lugar: "Chillán (vuelta)" },
  { km: 2335, lugar: "Santiago — llegada" }
];
/* frontera Samoré ≈ km 1020 (CL→AR) · frontera Tromen ≈ km 1455 (AR→CL) */

/* --- ÍTEMS (catálogo completo) ---
   cat: alojamiento | atraccion | comida | ruta | extra
   unit: noche (grupo) | persona | grupo | vehiculo
   moneda: CLP | ARS  (ARS se convierte con FX)
   precio_nino: opcional (atracciones con tarifa infantil)
   sugerido: se agrega al plan recomendado inicial
   geo: [lat,lng] para el mapa                                    */
const ITEMS = [
  /* ══════════ RUTA D1: SANTIAGO → OSORNO ══════════ */
  { id: "benc-sim", cat: "ruta", base: "Todo el viaje", nombre: "Bencina — plan de estanques (Rush + CX-5)", desc: "SIMULACIÓN DE ESTANQUES · Carga virtual llena al salir (Rush 45 L → 495 km, CX-5 58 L → 638 km, a 11 km/L) y recargas justo donde el estanque chico se quedaría seco: ahí el Rush llena completo y el CX-5 solo lo que le falta para llenar. Detalle, lugares y parámetros editables en el panel «Plan de estanques» del itinerario.", precio: 0, moneda: "CLP", unit: "sim", geo: null, sugerido: true, fuente: { n: "Toyota Perú (45 L) · Autofact CX-5 (56-58 L)", u: "https://www.autofact.cl/blog/comprar-auto/modelos/mazda-cx5" } },
  { id: "peaje-t1", cat: "ruta", base: "Ruta 5 Sur", nombre: "Peajes Ruta 5 Sur (Santiago → Osorno)", desc: "Troncales Santiago–Talca–Chillán–Collipulli–Temuco + laterales. Valor 2026.", precio: 21000, moneda: "CLP", unit: "vehiculo", geo: [-35.4264,-71.6554], sugerido: true, fuente: { n: "Autofact / peajes 2026", u: "https://www.autofact.cl/blog/mi-auto/tag/peajes-ruta-5-sur" } },
  { id: "saltolaja", cat: "atraccion", base: "En el camino", nombre: "Salto del Laja (Los Ángeles)", desc: "Cuatro saltos de hasta 35 m, miradores y puente colgante. ¡Entrada GRATIS! Parada perfecta a media mañana.", precio: 0, moneda: "CLP", unit: "grupo", geo: [-37.1531,-72.4399], rating: 4.5, sugerido: true, fuente: { n: "TripAdvisor", u: "https://www.tripadvisor.es/Attraction_Review-g488177-d7225254-Reviews-Saltos_del_Laja-Los_Angeles_Biobio_Region.html" } },
  { id: "est-saltolaja", cat: "ruta", base: "En el camino", nombre: "Estacionamiento Salto del Laja", desc: "Estacionamiento en el acceso a las cataratas.", precio: 3000, moneda: "CLP", unit: "vehiculo", geo: [-37.1531,-72.4399], sugerido: true, fuente: { n: "Relatos Nómadas", u: "https://relatosnomadas.com/visitar-salto-del-laja" } },
  { id: "desay-t1", cat: "comida", base: "En el camino", nombre: "Desayuno en casa antes de salir 04:00", nivel: "económico", desc: "OPCIÓN ECONÓMICA · Sandwiches y thermos preparados la noche anterior — cero paradas hasta el Salto del Laja.", precio: 1500, moneda: "CLP", unit: "persona", geo: null, sugerido: true, fuente: { n: "Planificador", u: "" } },
  { id: "desay-t1b", cat: "comida", base: "En el camino", nombre: "Pronto Copec — Angostura km 57 (lado IDA)", nivel: "económico", desc: "OPCIÓN RÁPIDA · Calzada con sentido al SUR (km 57, no la de vuelta). Sándwich miga + café $4.990 · combo huevo/café/jugo AM. Abierto 24 h.", precio: 4990, moneda: "CLP", unit: "persona", geo: [-33.9650, -70.7420], sugerido: false, fuente: { n: "Menú Pronto Copec (oficial)", u: "https://prontocopec.cl/menu-rally-vilage.pdf" } },
  { id: "desay-t1c", cat: "comida", base: "En el camino", nombre: "Cafetería en Rancagua (km 84, desvío 5 min)", nivel: "medio", desc: "OPCIÓN CONFIORT · Café de especialidad y tostadas en cafeterías de Rancagua/San Fernando (Makila, El Pedregal). Salir 04:00 → desayunar 07:00 sentados.", precio: 7500, moneda: "CLP", unit: "persona", geo: [-34.1610, -70.7400], sugerido: false, fuente: { n: "TripAdvisor cafés San Fernando", u: "https://www.tripadvisor.com/Restaurants-g1020885-c8-zfp2-San_Fernando_O_Higgins_Region.html" } },
  { id: "almuer-t1b", cat: "comida", base: "En el camino", nombre: "Casino de ruta — sándwich + bebida (Collipulli)", nivel: "económico", desc: "OPCIÓN ECONÓMICA · Pronto/Shell del trayecto: sándwich, empanada y bebida sin salir de la ruta.", precio: 5500, moneda: "CLP", unit: "persona", geo: [-37.5667,-72.35], sugerido: false, fuente: { n: "Referencial ruta 5", u: "" } },
  { id: "almuer-t1", cat: "comida", base: "En el camino", nombre: "Menú picada sureño (Collipulli / Victoria)", nivel: "medio", desc: "OPCIÓN MEDIO · Menú picada sureño (cazuela o churrasco) para recargar.", precio: 9000, moneda: "CLP", unit: "persona", geo: [-37.5667,-72.35], sugerido: true, fuente: { n: "Referencial ruta 5", u: "" } },
  { id: "almuer-t1c", cat: "comida", base: "En el camino", nombre: "Restaurante con mesa servida (Victoria)", nivel: "premium", desc: "OPCIÓN PREMIUM · Sentarse sin apuro: plato de fondo + postre en restaurant de la ciudad (Victoria, 5 min de la ruta).", precio: 14000, moneda: "CLP", unit: "persona", geo: [-38.2325,-72.3328], sugerido: false, fuente: { n: "Referencial ruta 5", u: "" } },
  { id: "cena-d1", cat: "comida", base: "Osorno", nombre: "Cena llegada Osorno (día 1)", nivel: "medio", desc: "OPCIÓN MEDIO · Llegada ~15:30, caminar la costanera del Rahue y cena relajada.", precio: 12000, moneda: "CLP", unit: "persona", geo: [-40.5745,-73.1339], sugerido: true, fuente: { n: "Referencial", u: "" } },
  { id: "cena-d1b", cat: "comida", base: "Osorno", nombre: "Picada local en Osorno (completos y sopaipillas)", nivel: "económico", desc: "OPCIÓN ECONÓMICA · Completos, sopaipillas y cerveza en picadas del centro — divertido y barato para llegar cansados.", precio: 6000, moneda: "CLP", unit: "persona", geo: [-40.5745,-73.1339], sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "despensa-osr", cat: "comida", base: "Osorno", nombre: "Despensa casa Osorno (desayunos días 2–3)", desc: "Desayunos en la casa: pan, mermelada, cereales, leche, frutas, café — compra grande en supermercado local.", precio: 55000, moneda: "CLP", unit: "grupo", geo: [-40.5745,-73.1350], sugerido: true, fuente: { n: "Supermercados Osorno (Líder/Jumbo)", u: "" } },

  /* ══════════ OSORNO (base 1 · días 1–3) ══════════ */
  { id: "alo-osorno-1", cat: "alojamiento", base: "Osorno", nombre: "Casa Ann — casa entera remodelada (Airbnb)", desc: "Casa completa equipada, amplia, calefacción y estacionamiento. Ideal 9 personas.", precio: 110000, moneda: "CLP", unit: "noche", geo: [-40.5708,-73.1350], rating: 4.9, sugerido: true, fuente: { n: "Airbnb · Casa Ann", u: "https://es.airbnb.com/rooms/44647528" } },
  { id: "alo-osorno-2", cat: "alojamiento", base: "Osorno", nombre: "Cabaña grande entera familiar N1 (Airbnb)", desc: "Parcela de agrado a 5 min del centro. Opción más económica.", precio: 95000, moneda: "CLP", unit: "noche", geo: [-40.5610,-73.1240], rating: 4.8, sugerido: false, fuente: { n: "Airbnb · Cabaña N1", u: "https://es.airbnb.com/rooms/1254201974460131456" } },
  { id: "alo-osorno-3", cat: "alojamiento", base: "Osorno", nombre: "2 cabañas (una por familia) — mismo recinto, Puyehue", desc: "Alternativa multifamiliar a 20 min de las termas: una cabaña por familia en el mismo predio.", precio: 125000, moneda: "CLP", unit: "noche", geo: [-40.6522,-72.4329], rating: 4.7, sugerido: false, nivel: "premium", fuente: { n: "Parairnos (cabañas 9 pax)", u: "https://www.parairnos.cl/cabanas-en-chile-para-9-personas" } },
  { id: "alo-osr-e", cat: "alojamiento", base: "Osorno", nombre: "Casa Grande con Tinaja — Puyehue, Ruta 215 (Booking)", nivel: "económico", desc: "OPCIÓN BARATA Y BIEN REPUTADA · Casa grande con tinaja a 10 min del lago Puyehue y Rupanco: 34 reseñas «Exceptional», parking privado gratis. Queda en camino al cruce Samoré.", precio: 95000, moneda: "CLP", unit: "noche", geo: [-40.6700,-72.4500], rating: 4.8, sugerido: false, fuente: { n: "Booking · Casa Grande con Tinaja", u: "https://www.booking.com/hotel/cl/big-house-en-el-paraiso.es.html" } },
  { id: "termas-aguascalientes", cat: "atraccion", base: "Osorno", nombre: "Termas Aguas Calientes — P.N. Puyehue", desc: "Piscinas termales al aire libre dentro del parque nacional. Adulto $13.000 · niño $8.400.", precio: 13000, precio_nino: 8400, moneda: "CLP", unit: "persona", geo: [-40.7567,-72.4258], rating: 4.7, sugerido: true, fuente: { n: "Rutenica (tarifas oficiales)", u: "https://www.rutenica.cl/products/entrada-piscina-al-aire-libre-termas-aguas-calientes-puyehue" } },
  { id: "pn-puyehue", cat: "atraccion", base: "Osorno", nombre: "P.N. Puyehue — senderos y Antillanca", desc: "Bosques valdivianos, senderos y vistas al volcán Puyehue. Entrada vía Pases Parques.", precio: 5000, precio_nino: 2500, moneda: "CLP", unit: "persona", geo: [-40.6800,-72.1800], rating: 4.8, sugerido: true, fuente: { n: "Pases Parques CONAF", u: "https://www.pasesparques.cl" } },
  { id: "pilmaiquen", cat: "atraccion", base: "Osorno", nombre: "Saltos del Pilmaiquén", desc: "El 'Petrohué chico': saltos turquesa a 40 min de Osorno. Poco conocido y espectacular.", precio: 5000, moneda: "CLP", unit: "persona", geo: [-40.6344,-72.7567], rating: 4.6, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "frutillar", cat: "atraccion", base: "Osorno", nombre: "Frutillar Bajo + Teatro del Lago", desc: "Pueblo patrimonial a orillas del Llanquihue con vista al volcán Osorno. Tour por el teatro.", precio: 10000, precio_nino: 5000, moneda: "CLP", unit: "persona", geo: [-41.1286,-73.0618], rating: 4.9, sugerido: true, fuente: { n: "Teatro del Lago", u: "https://www.teatrodellago.cl" } },
  { id: "kuchen-frutillar", cat: "comida", base: "Osorno", nombre: "Kuchen alemán en Latitud 42° (Frutillar)", desc: "La capital mundial del kuchen: una ronda de kuchen + café frente al lago.", precio: 8000, moneda: "CLP", unit: "persona", geo: [-41.1305,-73.0641], rating: 4.8, sugerido: true, fuente: { n: "Latitud 42°", u: "https://www.latitud42.cl" } },
  { id: "puerto-octay", cat: "atraccion", base: "Osorno", nombre: "Puerto Octay y lago Rupanco", desc: "Bahía de casas centenarias y miradores del Rupanco. Gratuito.", precio: 0, moneda: "CLP", unit: "grupo", geo: [-40.8759,-72.8911], rating: 4.7, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "cassata", cat: "comida", base: "Osorno", nombre: "Cassata Ristorante (Osorno)", desc: "Clásico italiano local, pastas caseras — el más recomendado de la ciudad.", precio: 14000, moneda: "CLP", unit: "persona", geo: [-40.5737,-73.1361], rating: 4.6, sugerido: true, fuente: { n: "TripAdvisor Osorno", u: "https://www.tripadvisor.cl/Restaurants-g303674-Osorno_Los_Lagos_Region.html" } },
  { id: "coiron", cat: "comida", base: "Osorno", nombre: "Coirón — parrilla (Osorno)", desc: "Asados y platos sureños contundentes.", precio: 15000, moneda: "CLP", unit: "persona", geo: [-40.5700,-73.1400], rating: 4.5, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "pizza-osr", cat: "comida", base: "Osorno", nombre: "Pizzería familiar (Osorno)", nivel: "medio", desc: "Opción fácil con niños: pizza grande + bebidas para compartir en la casa o local.", precio: 9500, moneda: "CLP", unit: "persona", geo: [-40.5745,-73.1339], sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "cena-casa-osr", cat: "comida", base: "Osorno", nombre: "Cena en la casa Osorno (pasta / asado casero)", nivel: "económico", desc: "Opción económica: cocinar en la casa con la despensa ya comprada — pasta, asado o completos caseros.", precio: 7000, moneda: "CLP", unit: "persona", geo: [-40.5708,-73.1350], sugerido: false, fuente: { n: "Planificador", u: "" } },
  { id: "petrohue", cat: "atraccion", base: "Osorno", nombre: "Saltos del Petrohué", desc: "Cascadas turquesa sobre lava del volcán Osorno, senderos de madera entre bosques. Adulto ~$7.500 · niño ~$4.000.", precio: 7500, precio_nino: 4000, moneda: "CLP", unit: "persona", geo: [-41.1561,-72.4424], rating: 4.8, sugerido: false, fuente: { n: "Pases Parques CONAF", u: "https://www.pasesparques.cl" } },
  { id: "volcan-osorno", cat: "atraccion", base: "Osorno", nombre: "Volcán Osorno — centro de ski y miradores", desc: "Subida en auto hasta la ladera del volcán: miradores sobre el lago Todos los Santos y paisaje lunar de lava.", precio: 8000, precio_nino: 4000, moneda: "CLP", unit: "persona", geo: [-41.0983,-72.5461], rating: 4.7, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "puerto-varas", cat: "atraccion", base: "Osorno", nombre: "Puerto Varas — costanera del Llanquihue", desc: "Paseo por la costanera, iglesia del Sagrado Corazón (madera patrimonial) y cafés con vista al lago. Gratuito.", precio: 0, moneda: "CLP", unit: "grupo", geo: [-41.3210,-72.9854], rating: 4.8, sugerido: false, fuente: { n: "Turismo Puerto Varas", u: "" } },
  { id: "kayak-rupanco", cat: "atraccion", base: "Osorno", nombre: "Kayak en lago Rupanco o Puyehue", desc: "Tarde de kayak en aguas tranquilas con vista de volcanes; operadores locales con equipo para niños.", precio: 12000, moneda: "CLP", unit: "persona", geo: [-40.8017,-72.6000], rating: 4.6, sugerido: false, fuente: { n: "Operadores locales (referencial)", u: "" } },
  { id: "cafe-danes", cat: "comida", base: "Osorno", nombre: "Café Danés (Frutillar)", desc: "Kuchen y pasteles de tradición danesa-alemana frente al lago — el otro clásico dulce de Frutillar.", precio: 6500, moneda: "CLP", unit: "persona", geo: [-41.1290,-73.0620], rating: 4.7, sugerido: false, fuente: { n: "Referencial Frutillar", u: "" } },
  { id: "casa-valdes", cat: "comida", base: "Osorno", nombre: "Casa Valdés (Puerto Varas)", nivel: "premium", desc: "Institución gastronómica de la zona: pescados del sur, wild salmon y postres legendarios.", precio: 18000, moneda: "CLP", unit: "persona", geo: [-41.3220,-72.9840], rating: 4.6, sugerido: false, fuente: { n: "TripAdvisor Puerto Varas", u: "https://www.tripadvisor.cl/Restaurants-g303688-Puerto_Varas_Los_Lagos_Region.html" } },
  { id: "almuer-ensenada", cat: "comida", base: "Osorno", nombre: "Almuerzo en Ensenada (camino al Petrohué)", nivel: "medio", desc: "Opción media: rústico de lago (trucha, cazuela o choripán) en Ensenada, a los pies del volcán.", precio: 10000, moneda: "CLP", unit: "persona", geo: [-41.1667,-72.4833], sugerido: false, fuente: { n: "Referencial", u: "" } },

  /* ══════════ RUTA D3: OSORNO → VLA → BARILOCHE ══════════ */
  { id: "peaje-t2", cat: "ruta", base: "Osorno → Bariloche", nombre: "Peajes RN231/RN40 (Argentina)", desc: "Pocos peajes en Patagonia argentina; presupuesto de referencia.", precio: 5200, moneda: "ARS", unit: "vehiculo", geo: [-40.9,-71.9], sugerido: true, fuente: { n: "Referencial Vialidad Nacional", u: "" } },
  { id: "arrayanes-vla", cat: "atraccion", base: "En el camino", nombre: "Bosque de Arrayanes (Villa La Angostura)", desc: "Caminata ida y vuelta (o arriendo de bicis) entre arrayanes rojizos hasta la península.", precio: 9700, moneda: "ARS", unit: "persona", geo: [-40.7550,-71.6667], rating: 4.8, sugerido: true, fuente: { n: "Parques Nacionales AR", u: "https://www.argentina.gob.ar/interior/parquesnacionales" } },
  { id: "cerrobayo", cat: "atraccion", base: "En el camino", nombre: "Cerro Bayo (Villa La Angostura)", desc: "Telecabina con vista al lago Nahuel Huapi y toda la cordillera.", precio: 22600, moneda: "ARS", unit: "persona", geo: [-40.7690,-71.6230], rating: 4.6, sugerido: false, fuente: { n: "Cerro Bayo", u: "" } },
  { id: "almuer-vla-b", cat: "comida", base: "En el camino", nombre: "Cantina local VLA — milanesa al pan + cerveza", nivel: "económico", desc: "OPCIÓN ECONÓMICA · Milanesa al pan o lomito en cantina de la avenida, rápido para seguir camino.", precio: 9500, moneda: "ARS", unit: "persona", geo: [-40.7642,-71.6418], sugerido: false, fuente: { n: "Referencial VLA", u: "" } },
  { id: "almuer-vla", cat: "comida", base: "En el camino", nombre: "Almuerzo Villa La Angostura", nivel: "medio", desc: "OPCIÓN MEDIO · Trucha o cerveza artesanal local frente al lago.", precio: 14200, moneda: "ARS", unit: "persona", geo: [-40.7642,-71.6418], rating: 4.6, sugerido: true, fuente: { n: "TripAdvisor VLA", u: "https://www.tripadvisor.com.ar/Restaurants-g312838-Villa_La_Angostura_Province_of_Neuquen.html" } },
  { id: "almuer-vla-c", cat: "comida", base: "En el camino", nombre: "Restaurante frente al lago — trucha patagónica", nivel: "premium", desc: "OPCIÓN PREMIUM · Trucha de lago y vinos patagónicos con vista al Nahuel Huapi.", precio: 21000, moneda: "ARS", unit: "persona", geo: [-40.7642,-71.6418], sugerido: false, fuente: { n: "Referencial VLA", u: "" } },
  { id: "amor-pan", cat: "comida", base: "En el camino", nombre: "Amor de Pan — café y pastelería (VLA)", desc: "El café favorito de Villa La Angostura: tartas, pan de masa madre y café de especialidad.", precio: 9000, moneda: "ARS", unit: "persona", geo: [-40.7638,-71.6406], rating: 4.8, sugerido: false, fuente: { n: "TripAdvisor VLA", u: "" } },

  /* ══════════ BARILOCHE (base 2 · días 3–7) ══════════ */
  { id: "alo-brc-1", cat: "alojamiento", base: "Bariloche", nombre: "Casa con vista al lago para 10 pax (Booking)", desc: "Casa completa con terraza, jardín y vista al Nahuel Huapi. Enero 2027, temporada alta.", precio: 445000, moneda: "ARS", unit: "noche", geo: [-41.1200,-71.3200], rating: 9.0, sugerido: true, fuente: { n: "Booking · Casa vista al lago 10 pax", u: "https://www.booking.com/hotel/ar/casa-con-vista-al-lago-para-10-pax.es-ar.html" } },
  { id: "alo-brc-2", cat: "alojamiento", base: "Bariloche", nombre: "Casa de campo con costa de lago — Villa Campanario (Booking)", desc: "Casa amplia con jardín gigante y acceso a la costa del lago.", precio: 400000, moneda: "ARS", unit: "noche", geo: [-41.0700,-71.4200], rating: 8.8, sugerido: false, fuente: { n: "Booking · Villa Campanario", u: "https://www.booking.com/hotel/ar/casa-de-campo-villa-campanario1.es-ar.html" } },
  { id: "alo-brc-3", cat: "alojamiento", base: "Bariloche", nombre: "2 cabañas (una por familia) — mismo predio, Melipal", desc: "Cabaña 5 pax + cabaña 4 pax en el mismo predio arbolado. Flexibilidad total entre familias.", precio: 465000, moneda: "ARS", unit: "noche", geo: [-41.1000,-71.4000], rating: 8.9, sugerido: false, nivel: "premium", fuente: { n: "MercadoLibre AR", u: "https://listado.mercadolibre.com.ar/alquiler-bariloche-8-personas" } },
  { id: "alo-brc-e", cat: "alojamiento", base: "Bariloche", nombre: "Casa/cabaña 9–10 pax por dueños directos (Parairnos/ML)", nivel: "económico", desc: "OPCIÓN BARATA · Listados directos de dueños sin comisión: casas 9–10 pax desde ARS 250.000–350.000/noche en enero (vs ARS 400–450k en Booking). Reputación verificable en reseñas de cada listing.", precio: 300000, moneda: "ARS", unit: "noche", geo: [-41.1000,-71.3500], sugerido: false, fuente: { n: "Parairnos Bariloche 10 pax", u: "https://www.parairnos.com/alquileres-en-bariloche-para-10-personas" } },
  { id: "catedral-verano", cat: "atraccion", base: "Bariloche", nombre: "Cerro Catedral — telecabina de verano", desc: "Subida a ~1.900 m: miradores del Nahuel Huapi y senderos de cumbre. Adulto ~ARS 60.000 · niño ~ARS 45.000.", precio: 38700, moneda: "ARS", precio_nino: 29000, unit: "persona", geo: [-41.1651,-71.4415], rating: 4.7, sugerido: true, fuente: { n: "Catedral Alta Patagonia", u: "https://catedralaltapatagonia.com/tarifas" } },
  { id: "campanario", cat: "atraccion", base: "Bariloche", nombre: "Cerro Campanario — aerosilla", desc: "Una de las mejores vistas del mundo según National Geographic.", precio: 7700, moneda: "ARS", unit: "persona", geo: [-41.1269,-71.5386], rating: 4.8, sugerido: true, fuente: { n: "Cerro Campanario", u: "" } },
  { id: "circuito-chico", cat: "atraccion", base: "Bariloche", nombre: "Circuito Chico completo (en auto)", desc: "Playa Bonita, Llao Llao, península y Bahía López. Gratuito (sin aerosillas).", precio: 0, moneda: "CLP", unit: "grupo", geo: [-41.0400,-71.5480], rating: 4.9, sugerido: true, fuente: { n: "Turismo Bariloche", u: "https://www.bariloche.gov.ar" } },
  { id: "isla-victoria", cat: "atraccion", base: "Bariloche", nombre: "Catamarán Isla Victoria + Bosque de Arrayanes", desc: "Navegación desde Puerto Pañuelo, bosque de arrayanes y senderos en la isla. Adulto ~ARS 75.000 · niño ~ARS 45.000.", precio: 48400, moneda: "ARS", precio_nino: 29000, unit: "persona", geo: [-41.0592,-71.5355], rating: 4.7, sugerido: false, fuente: { n: "Cruceros del Lago", u: "https://www.crucerosdelago.com" } },
  { id: "cerro-otto", cat: "atraccion", base: "Bariloche", nombre: "Cerro Otto — aerosilla y confitería giratoria", desc: "Vista 360° y la confitería giratoria, única en Sudamérica.", precio: 9700, moneda: "ARS", unit: "persona", geo: [-41.0970,-71.4700], rating: 4.6, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "colonia-suiza", cat: "atraccion", base: "Bariloche", nombre: "Colonia Suiza + Museo Petersen", desc: "Pueblo de colonos suizos: historias, cerveza artesanal y curanto los miércoles/domingos.", precio: 0, moneda: "CLP", unit: "grupo", geo: [-41.0970,-71.5062], rating: 4.7, sugerido: false, fuente: { n: "Turismo Bariloche", u: "" } },
  { id: "museo-chocolate", cat: "atraccion", base: "Bariloche", nombre: "Museo del Chocolate (Familia Weiss)", desc: "Historia del chocolate barilochense con degustación — la aman los niños.", precio: 5200, moneda: "ARS", unit: "persona", geo: [-41.1340,-71.3090], rating: 4.6, sugerido: true, fuente: { n: "Familia Weiss", u: "https://www.familiaweiss.com.ar" } },
  { id: "rafting-manso", cat: "atraccion", base: "Bariloche", nombre: "Rafting Río Manso (familias)", desc: "Río manso a water level con tramos aptos para niños. Medio día con instructores.", precio: 38200, moneda: "ARS", unit: "persona", geo: [-41.1800,-71.5800], rating: 4.9, sugerido: false, fuente: { n: "Operadores locales (referencial)", u: "" } },
  { id: "boliche-alberto", cat: "comida", base: "Bariloche", nombre: "El Boliche de Alberto — parrilla", desc: "Institución de la parrilla barilochense: bife de chorizo y papas rústicas.", precio: 22600, moneda: "ARS", unit: "persona", geo: [-41.1345,-71.3075], rating: 4.6, sugerido: true, fuente: { n: "Turismocity / TripAdvisor", u: "https://www.tripadvisor.es/Restaurants-g312848-San_Carlos_de_Bariloche_Province_of_Rio_Negro_Patagonia.html" } },
  { id: "weiss-confiteria", cat: "comida", base: "Bariloche", nombre: "Confitería Familia Weiss", nivel: "medio", desc: "OPCIÓN MEDIO · Chocolate caliente con churros y facturas frente al Centro Cívico.", precio: 7700, moneda: "ARS", unit: "persona", geo: [-41.1337,-71.3087], rating: 4.7, sugerido: true, fuente: { n: "Familia Weiss", u: "" } },
  { id: "choc-brc-b", cat: "comida", base: "Bariloche", nombre: "Chocolatería/heladería económica en Mitre", nivel: "económico", desc: "OPCIÓN ECONÓMICA · Cazo de chocolate al paso o helado artesanal por la avenida Mitre — mismo ritual, mitad de precio.", precio: 4500, moneda: "ARS", unit: "persona", geo: [-41.1340,-71.3090], sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "la-marmite", cat: "comida", base: "Bariloche", nombre: "La Marmite — fondue", desc: "Fondue de queso y chocolate para una noche fresca patagónica.", precio: 24500, moneda: "ARS", unit: "persona", geo: [-41.1320,-71.3120], rating: 4.5, sugerido: false, fuente: { n: "TripAdvisor", u: "" } },
  { id: "blest", cat: "comida", base: "Bariloche", nombre: "Cervecería Blest (Colonia Suiza)", desc: "Cerveza artesanal pionera junto al lago Moreno; platos alemanes.", precio: 14200, moneda: "ARS", unit: "persona", geo: [-41.0900,-71.5200], rating: 4.6, sugerido: true, fuente: { n: "TripAdvisor", u: "" } },
  { id: "manush", cat: "comida", base: "Bariloche", nombre: "Manush — cervecería artesanal (centro)", desc: "Hamburguesas y cervezas propias, ambiente familiar al mediodía.", precio: 12900, moneda: "ARS", unit: "persona", geo: [-41.1338,-71.3096], rating: 4.6, sugerido: false, fuente: { n: "TripAdvisor", u: "" } },
  { id: "super-brc", cat: "comida", base: "Bariloche", nombre: "Despensa supermercado (La Anónima) 4 días", desc: "Desayunos y meriendas en la casa: cereales, pan, dulce de leche, frutas, jugos.", precio: 116000, moneda: "ARS", unit: "grupo", geo: [-41.1300,-71.3100], sugerido: true, fuente: { n: "Referencial La Anónima", u: "" } },
  { id: "la-marca", cat: "comida", base: "Bariloche", nombre: "La Marca — parrilla clásica", desc: "Parrilla de toda la vida en Bariloche: asado, vacío y papas fritas para la familia completa.", precio: 24000, moneda: "ARS", unit: "persona", geo: [-41.1355,-71.3095], rating: 4.5, sugerido: false, fuente: { n: "TripAdvisor Bariloche", u: "" } },
  { id: "albertino", cat: "comida", base: "Bariloche", nombre: "Albertino — bistro de cocina (centro)", desc: "Cocina cuidado en el centro: cordero, trucha y pastas con buen vino.", precio: 22000, moneda: "ARS", unit: "persona", geo: [-41.1337,-71.3100], rating: 4.5, sugerido: false, fuente: { n: "TripAdvisor Bariloche", u: "" } },
  { id: "mamuschka", cat: "comida", base: "Bariloche", nombre: "Mamuschka — chocolatería", desc: "Chocolates y alfajores de la chocolatería más reconocida de la avenida Mitre.", precio: 6000, moneda: "ARS", unit: "persona", geo: [-41.1341,-71.3075], rating: 4.7, sugerido: false, fuente: { n: "Mamuschka", u: "" } },
  { id: "rapa-nui", cat: "comida", base: "Bariloche", nombre: "Chocolatería Rapa Nui", desc: "Chocolate, helados y una confitería con vista — infaltable en el paseo por Mitre.", precio: 6500, moneda: "ARS", unit: "persona", geo: [-41.1345,-71.3064], rating: 4.7, sugerido: false, fuente: { n: "Rapa Nui", u: "" } },
  { id: "jauja", cat: "comida", base: "Bariloche", nombre: "Heladería Jauja — helado artesanal", desc: "Helado artesanal patagónico (frambuesa, calafate, chocolate al agua) — ganador de premios.", precio: 5500, moneda: "ARS", unit: "persona", geo: [-41.1330,-71.3110], rating: 4.8, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "patagonia-brewpub", cat: "comida", base: "Bariloche", nombre: "Cervecería Patagonia — brewpub Melipal", desc: "Cervezas con vista al lago Moreno en el brewpub de Patagonia; tablas y hamburguesas.", precio: 16000, moneda: "ARS", unit: "persona", geo: [-41.1046,-71.4370], rating: 4.7, sugerido: false, fuente: { n: "Cervecería Patagonia", u: "" } },
  { id: "bachmann", cat: "comida", base: "Bariloche", nombre: "Cervecería Bachmann (centro)", desc: "La cervecería clásica del centro: cervezas de receta alemana y platos contundentes.", precio: 14000, moneda: "ARS", unit: "persona", geo: [-41.1343,-71.3088], rating: 4.5, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "curanto-colonia", cat: "comida", base: "Bariloche", nombre: "Curanto Victor Goye (Colonia Suiza)", nivel: "premium", desc: "El curanto más famoso de la Patagonia: cocido en hoyo con piedras calientes. Miércoles y domingos — reservar.", precio: 28000, moneda: "ARS", unit: "persona", geo: [-41.0970,-71.5062], rating: 4.7, sugerido: false, fuente: { n: "Colonia Suiza", u: "" } },
  { id: "tronador", cat: "atraccion", base: "Bariloche", nombre: "Cerro Tronador + Ventisquero Negro", desc: "Excursión al macizo fronterizo: glaciar negro, miradores del Puntiagudo y bosques milenarios. Día completo.", precio: 35000, moneda: "ARS", unit: "persona", geo: [-41.4920,-71.8470], rating: 4.8, sugerido: false, fuente: { n: "Operadores Bariloche (referencial)", u: "" } },
  { id: "nahuelito", cat: "atraccion", base: "Bariloche", nombre: "Parque Nahuelito (temático)", desc: "Dinosaurios a escala y el mito del Nahuelito — entretenimiento garantizado para los más chicos.", precio: 12000, precio_nino: 8000, moneda: "ARS", unit: "persona", geo: [-41.0670,-71.4900], rating: 4.4, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "playa-bonita", cat: "atraccion", base: "Bariloche", nombre: "Playa Bonita / Melipal — tarde de playa", desc: "Playas de arena volcánica sobre el Nahuel Huapi con vista a la península. Gratuitas.", precio: 0, moneda: "CLP", unit: "grupo", geo: [-41.0830,-71.4660], rating: 4.7, sugerido: false, fuente: { n: "Turismo Bariloche", u: "" } },
  { id: "canopy-brc", cat: "atraccion", base: "Bariloche", nombre: "Canopy / tirolesa en bosque", desc: "Tirolesas entre coihues y lengas con guías certificados; tramos para niños desde 6 años.", precio: 28000, moneda: "ARS", unit: "persona", geo: [-41.1000,-71.4800], rating: 4.6, sugerido: false, fuente: { n: "Operadores (referencial)", u: "" } },
  { id: "kayak-moreno", cat: "atraccion", base: "Bariloche", nombre: "Kayak en lago Moreno (medio día)", desc: "Remada tranquila entre bahías y bosques con guías; kayak doble para familia.", precio: 30000, moneda: "ARS", unit: "persona", geo: [-41.0500,-71.5600], rating: 4.8, sugerido: false, fuente: { n: "Operadores (referencial)", u: "" } },

  /* ══════════ RUTA D7: BARILOCHE → PUCÓN (7 lagos) ══════════ */
  { id: "siete-lagos", cat: "atraccion", base: "En el camino", nombre: "Ruta de los Siete Lagos (RN234)", desc: "Lagos Correntoso, Espejo, Villarino, Falkner, Machónico, Lácar… paradas de foto cada 10 min. Gratuita.", precio: 0, moneda: "CLP", unit: "grupo", geo: [-40.6809,-71.6511], rating: 5.0, sugerido: true, fuente: { n: "Neuquén Turismo", u: "https://www.neuquentur.gob.ar" } },
  { id: "almuer-sml-b", cat: "comida", base: "En el camino", nombre: "Empanadas Nonino / Corazón Contento (al paso)", nivel: "económico", desc: "OPCIÓN ECONÓMICA · Los favoritos baratos de TripAdvisor en San Martín: empanadas al horno o comida casera al paso.", precio: 11000, moneda: "ARS", unit: "persona", geo: [-40.1571,-71.3539], rating: 4.4, sugerido: false, fuente: { n: "TripAdvisor comer barato SML", u: "https://www.tripadvisor.com.ar/Restaurants-g312843-zfp16-San_Martin_de_los_Andes_Province_of_Neuquen_Patagonia.html" } },
  { id: "almuer-sml", cat: "comida", base: "En el camino", nombre: "Almuerzo San Martín de los Andes", nivel: "medio", desc: "OPCIÓN MEDIO · Trucha ahumada o ciervo en la avenida del lago Lácar.", precio: 16100, moneda: "ARS", unit: "persona", geo: [-40.1571,-71.3539], rating: 4.7, sugerido: true, fuente: { n: "TripAdvisor SML", u: "" } },
  { id: "almuer-sml-c", cat: "comida", base: "En el camino", nombre: "Parrilla Patagonia Piscis (SML)", nivel: "premium", desc: "OPCIÓN PREMIUM · Parrillada patagónica completa en uno de los clásicos de la ciudad.", precio: 24000, moneda: "ARS", unit: "persona", geo: [-40.1571,-71.3539], sugerido: false, fuente: { n: "Interpatagonia / municipal", u: "https://sanmartindelosandes.gob.ar/gastronomias" } },
  { id: "mer-junin", cat: "comida", base: "En el camino", nombre: "Merienda en Junín de los Andes (panadería)", desc: "Parada dulce antes del paso Tromen: facturas + café con leche en panadería de Junín (última ciudad antes de la cordillera).", precio: 4500, moneda: "ARS", unit: "persona", geo: [-39.9439,-71.5055], sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "peaje-t3", cat: "ruta", base: "Bariloche → Pucón", nombre: "Peajes RN40/RN234 + paso Tromen", desc: "Referencia de peajes argentinos del tramo.", precio: 3200, moneda: "ARS", unit: "vehiculo", geo: [-39.6400,-71.5400], sugerido: true, fuente: { n: "Referencial", u: "" } },

  /* ══════════ PUCÓN (base 3 · días 7–12) ══════════ */
  { id: "alo-puc-1", cat: "alojamiento", base: "Pucón", nombre: "Casa grande centro Pucón 10–14 pax (Airbnb)", desc: "4 dormitorios, 3 baños, pensada para familias grandes — multifamiliar. Mínimo 10 personas.", precio: 210000, moneda: "CLP", unit: "noche", geo: [-39.2837,-72.3259], rating: 4.4, sugerido: true, fuente: { n: "Airbnb · Casa grande Pucón", u: "https://es.airbnb.com/rooms/22561846" } },
  { id: "alo-puc-2", cat: "alojamiento", base: "Pucón", nombre: "Cabaña 8–9 pax con piscina (Booking)", desc: "Cabaña con terraza, jardín y piscina temperada — a 5 min de la playa.", precio: 180000, moneda: "CLP", unit: "noche", geo: [-39.2900,-72.3300], rating: 4.7, sugerido: false, fuente: { n: "Booking · Cabaña playa 8 personas", u: "https://www.booking.com/hotel/cl/cabana-playa-8-personas.es.html" } },
  { id: "alo-puc-3", cat: "alojamiento", base: "Pucón", nombre: "2 cabañas 5 pax mismo recinto (sector Caburgua)", desc: "Una por familia, quincho compartido y bosque nativo.", precio: 220000, moneda: "CLP", unit: "noche", geo: [-39.3190,-72.1510], rating: 4.8, sugerido: false, nivel: "premium", fuente: { n: "Parairnos", u: "https://www.parairnos.cl/cabanas-en-chile-para-9-personas" } },
  { id: "alo-puc-e", cat: "alojamiento", base: "Pucón", nombre: "Cabaña 9 pax con quincho — dueño directo (Parairnos)", nivel: "económico", desc: "OPCIÓN BARATA · Arriendo directo a dueños sin comisión: 6 propiedades para 9 personas entre $75.000 y $150.000/noche. Bien evaluadas y con parrilla.", precio: 95000, moneda: "CLP", unit: "noche", geo: [-39.2900,-72.3300], sugerido: false, fuente: { n: "Parairnos Pucón 9 pax", u: "https://www.parairnos.cl/arriendos-en-pucon-para-9-personas" } },
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
  { id: "pozones", cat: "atraccion", base: "Pucón", nombre: "Termas Los Pozones", desc: "Seis pozones de piedra al borde del río, los favoritos por precio y ambiente — a 30 min de Pucón. Adulto ~$12.000 · niño ~$8.000.", precio: 12000, precio_nino: 8000, moneda: "CLP", unit: "persona", geo: [-39.3630,-71.8690], rating: 4.7, sugerido: false, fuente: { n: "Termas Los Pozones", u: "" } },
  { id: "conguillio", cat: "atraccion", base: "Pucón", nombre: "P.N. Conguillío — araucarias y volcán Llaima", desc: "Excursión del día completo: bosques de araucarias milenarias, laguna Verde y el Llaima humeante. Adulto ~$7.000 · niño ~$3.500.", precio: 7000, precio_nino: 3500, moneda: "CLP", unit: "persona", geo: [-38.6500,-71.6500], rating: 4.9, sugerido: false, fuente: { n: "CONAF", u: "https://www.conaf.cl" } },
  { id: "canopy-villarrica", cat: "atraccion", base: "Pucón", nombre: "Canopy Villarrica — tirolesas", desc: "Circuito de tirolesas sobre el bosque con vista al volcán; seguro y guiado, apto para niños.", precio: 22000, moneda: "CLP", unit: "persona", geo: [-39.2950,-72.3000], rating: 4.6, sugerido: false, fuente: { n: "Operadores Pucón (referencial)", u: "" } },
  { id: "cabalgata-pucon", cat: "atraccion", base: "Pucón", nombre: "Cabalgata criolla (2 horas)", desc: "Caballos criollos por bosques y ríos con guías locales; para toda la familia sin experiencia.", precio: 20000, moneda: "CLP", unit: "persona", geo: [-39.2900,-72.2800], rating: 4.7, sugerido: false, fuente: { n: "Operadores Pucón (referencial)", u: "" } },
  { id: "lago-caburgua", cat: "atraccion", base: "Pucón", nombre: "Playa Blanca — lago Caburgua", desc: "Agua turquesa y arena blanca en el lago Caburgua; playa ideal para niños. Entrada ~$4.000.", precio: 4000, moneda: "CLP", unit: "persona", geo: [-39.3300,-72.1050], rating: 4.7, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "museo-mapuche", cat: "atraccion", base: "Pucón", nombre: "Museo Mapuche de Pucón", desc: "Colección de cultura mapuche en el centro — corto, barato y educativo para los niños.", precio: 2000, moneda: "CLP", unit: "persona", geo: [-39.2850,-72.3285], rating: 4.4, sugerido: false, fuente: { n: "Municipalidad de Pucón", u: "" } },
  { id: "cafe-de-la-p", cat: "comida", base: "Pucón", nombre: "Café de la P — cafetería de especialidad", desc: "El mejor café de Pucón: tostado propio, tortas y desayunos de calidad.", precio: 7000, moneda: "CLP", unit: "persona", geo: [-39.2862,-72.3280], rating: 4.7, sugerido: false, fuente: { n: "TripAdvisor Pucón", u: "" } },
  { id: "la-generosa", cat: "comida", base: "Pucón", nombre: "La Generosa — pizzería clásica", desc: "Pizzas al horno y pastas, clásico familiar de Pucón para la noche.", precio: 11000, moneda: "CLP", unit: "persona", geo: [-39.2870,-72.3260], rating: 4.6, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "asado-quincho", cat: "comida", base: "Pucón", nombre: "Asado de despedida en el quincho (casa)", desc: "Comprar carne en carnicería local y hacer el gran asado de cierre en el quincho de la cabaña.", precio: 45000, moneda: "CLP", unit: "grupo", geo: [-39.2900,-72.3300], sugerido: false, fuente: { n: "Planificador", u: "" } },
  { id: "cena-casa-puc", cat: "comida", base: "Pucón", nombre: "Cena en la casa (pasta / delivery)", nivel: "económico", desc: "Opción económica: cocinar en la cabaña o pedir pizza/sushi delivery después del día largo.", precio: 7000, moneda: "CLP", unit: "persona", geo: [-39.2900,-72.3300], sugerido: false, fuente: { n: "Planificador", u: "" } },

  /* ══════════ VUELTA D12: PUCÓN → SANTIAGO ══════════ */
  { id: "desay-v", cat: "comida", base: "Pucón → Santiago", nombre: "Panadería Villarrica (marraqueta con palta + café)", nivel: "económico", desc: "OPCIÓN ECONÓMICA · Pan amasado saliente, palta y café con leche en panadería de Villarrica a 08:30.", precio: 3500, moneda: "CLP", unit: "persona", geo: [-39.2845,-72.2279], sugerido: true, fuente: { n: "Referencial", u: "" } },
  { id: "desay-v-b", cat: "comida", base: "Pucón → Santiago", nombre: "Cafetería junto al lago (Pucón)", nivel: "medio", desc: "OPCIÓN CONFIORT · Desayuno completo con vista al lago Villarrica antes de los 780 km.", precio: 7500, moneda: "CLP", unit: "persona", geo: [-39.2860,-72.3280], sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "peaje-t4", cat: "ruta", base: "Pucón → Santiago", nombre: "Peajes Ruta 5 (Pucón → Santiago)", desc: "Troncales Temuco–Collipulli–Chillán–Talca + laterales.", precio: 19000, moneda: "CLP", unit: "vehiculo", geo: [-36.6066,-72.1034], sugerido: true, fuente: { n: "Autofact 2026", u: "" } },
  { id: "almuer-t4b", cat: "comida", base: "Pucón → Santiago", nombre: "Empanadas de horno de camino (Los Ángeles/Chillán)", nivel: "económico", desc: "OPCIÓN ECONÓMICA · Empanadas de horno y cola de mono en puestos de camino — rápida y sabrosa.", precio: 4500, moneda: "CLP", unit: "persona", geo: [-37.4700,-72.3530], sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "almuer-t4", cat: "comida", base: "Pucón → Santiago", nombre: "Almuerzo ruta Chillán / Los Ángeles", nivel: "medio", desc: "OPCIÓN MEDIO · Menú dominical o plato de fondo en restaurant de camino.", precio: 9000, moneda: "CLP", unit: "persona", geo: [-36.6066,-72.1034], sugerido: true, fuente: { n: "Referencial", u: "" } },
  { id: "almuer-t4c", cat: "comida", base: "Pucón → Santiago", nombre: "Parrilla en Chillán (el clásico de camino)", nivel: "premium", desc: "OPCIÓN PREMIUM · Asado con ensalada en parrilla chillaneja — cierre de viaje con todo.", precio: 15000, moneda: "CLP", unit: "persona", geo: [-36.6066,-72.1034], sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "cena-final", cat: "comida", base: "Pucón → Santiago", nombre: "Cena de llegada (pizza/picada en casa)", desc: "Llegada ~18:00: pedir pizza y ver las fotos del viaje todos juntos.", precio: 10000, moneda: "CLP", unit: "persona", geo: [-33.4489,-70.6693], sugerido: true, fuente: { n: "Referencial", u: "" } },

  /* ══════════ EXTRAS GLOBALES ══════════ */
  { id: "seguro-ar", cat: "extra", base: "Global", nombre: "Seguro con cobertura Argentina (Mercosur)", desc: "Obligatorio para circular en Argentina: cobertura de daños a terceros por los días del viaje.", precio: 39000, moneda: "CLP", unit: "vehiculo", geo: null, sugerido: true, fuente: { n: "Aduana Chile", u: "https://www.aduana.cl/consejos-para-viajar-a-argentina/aduana/2008-02-13/130700.html" } },
  { id: "souvenirs", cat: "extra", base: "Global", nombre: "Souvenirs y chocolates", desc: "Chocolates Bariloche, artesanía mapuche, libros… presupuesto flexible por persona.", precio: 25000, moneda: "CLP", unit: "persona", geo: null, sugerido: false, fuente: { n: "Referencial", u: "" } },
  { id: "imprevistos", cat: "extra", base: "Global", nombre: "Fondo de imprevistos (neumático, médico, extra)", desc: "Regla de oro de los road trips: un colchón aparte para las sorpresas.", precio: 350000, moneda: "CLP", unit: "grupo", geo: null, sugerido: true, fuente: { n: "Recomendación del planificador", u: "" } }
];

/* --- Itinerario estructurado día a día ---
   Cada día agrupa TODO lo que se haría:
   - tramo:   id del tramo de ruta (ver TRAMOS) o null
   - costos:  costos automáticos del día (peajes, bencina, seguro)
   - desayuno/almuerzo/cena: opciones con nivel económico/medio/premium
   - manana/tarde/noche: actividades y paseos del momento
   - dormirBase: opciones de alojamiento de esa base (ver DORMIR)
   - plan: resumen del día · nota: tip operativo                  */
const DORMIR = {
  Osorno:     ["alo-osorno-1", "alo-osorno-2", "alo-osr-e", "alo-osorno-3"],
  Bariloche:  ["alo-brc-1", "alo-brc-2", "alo-brc-e", "alo-brc-3"],
  Pucón:      ["alo-puc-1", "alo-puc-2", "alo-puc-e", "alo-puc-3"]
};

const DIAS = [
  { dia: 1, base: "Santiago → Osorno", titulo: "Madrugada épica: Ruta 5 Sur", tramo: "t1",
    costos: ["benc-sim", "peaje-t1", "seguro-ar"],
    desayuno: ["desay-t1", "desay-t1b", "desay-t1c"],
    manana: ["saltolaja", "est-saltolaja"],
    almuerzo: ["almuer-t1b", "almuer-t1", "almuer-t1c"],
    tarde: [],
    cena: ["cena-d1b", "cena-d1", "pizza-osr"],
    noche: ["despensa-osr"],
    dormirBase: "Osorno",
    plan: "Salida 04:00 en punto, Ruta 5 con ciudad despejada, desayuno en la ruta y la gran parada del día: Salto del Laja a las 09:30. Almuerzo en Collipulli, llegada a Osorno ~15:30 y compra de despensa para los desayunos.",
    nota: "Con auto lleno desde Santiago (plan de estanques) la primera carga calculada sale camino al sur." },

  { dia: 2, base: "Osorno", titulo: "Termas y lagos: Puyehue o Frutillar", tramo: null,
    costos: [],
    desayuno: ["despensa-osr"],
    manana: ["pn-puyehue", "termas-aguascalientes", "petrohue", "volcan-osorno"],
    almuerzo: ["almuer-ensenada"],
    tarde: ["frutillar", "puerto-varas", "puerto-octay", "pilmaiquen", "kayak-rupanco"],
    cena: ["cassata", "coiron", "cena-casa-osr"],
    noche: ["kuchen-frutillar", "cafe-danes", "casa-valdes"],
    dormirBase: "Osorno",
    plan: "Plan A: P.N. Puyehue con sus senderos y Termas Aguas Calientes — día de bosque valdiviano. Plan B (lindo): Petrohué, volcán Osorno y Ensenada. Plan C (si llueve): Frutillar, Puerto Varas y kuchen frente al lago.",
    nota: "Los saltos del Pilmaiquén y Puerto Octay quedan cortos si el día viene relajado." },

  { dia: 3, base: "Osorno → Bariloche", titulo: "Cruce a Argentina por Cardenal Samoré", tramo: "t2",
    costos: ["peaje-t2"],
    desayuno: ["despensa-osr"],
    manana: ["arrayanes-vla", "cerrobayo"],
    almuerzo: ["almuer-vla-b", "almuer-vla", "almuer-vla-c"],
    tarde: ["amor-pan"],
    cena: ["weiss-confiteria", "choc-brc-b", "manush"],
    noche: ["jauja"],
    dormirBase: "Bariloche",
    plan: "Salida 08:30. Cruce fronterizo (~1–2 h: cédulas de todos + padrón + seguro). Parada estrella en Villa La Angostura: Bosque de Arrayanes. Llegada a Bariloche al atardecer con el primer chocolate de la saga.",
    nota: "Pasar el paso temprano evita filas de micros y camiones en temporada alta." },

  { dia: 4, base: "Bariloche", titulo: "Circuito Chico: el día de las vistas", tramo: null,
    costos: [],
    desayuno: ["super-brc"],
    manana: ["circuito-chico", "campanario", "playa-bonita"],
    almuerzo: ["curanto-colonia", "blest", "bachmann"],
    tarde: ["cerro-otto", "colonia-suiza", "patagonia-brewpub"],
    cena: ["boliche-alberto", "la-marca", "albertino"],
    noche: ["jauja"],
    dormirBase: "Bariloche",
    plan: "Día clásico en auto: Playa Bonita, península de Llao Llao, aerosilla del Campanario (una de las mejores vistas del mundo) y Colonia Suiza. Cierre con la parrilla más tradicional de la ciudad.",
    nota: "Si cae miércoles o domingo, el curanto de Victor Goye en Colonia Suiza es imbatible (reservar)." },

  { dia: 5, base: "Bariloche", titulo: "Cerro Catedral en verano", tramo: null,
    costos: [],
    desayuno: ["super-brc"],
    manana: ["catedral-verano", "rafting-manso"],
    almuerzo: ["manush", "la-marca"],
    tarde: ["museo-chocolate", "mamuschka", "rapa-nui"],
    cena: ["la-marmite", "albertino"],
    noche: ["choc-brc-b"],
    dormirBase: "Bariloche",
    plan: "Mañana en Catedral: telecabina a ~1.900 m y senderos de cumbre (los más aventureros pueden cambiar por rafting en el Manso). Tarde de chocolates por la avenida Mitre y museo del chocolate.",
    nota: "La subida del telecabina conviene temprano: después de las 12:00 se arma fila." },

  { dia: 6, base: "Bariloche", titulo: "Lago: catamarán, Tronador o playa", tramo: null,
    costos: [],
    desayuno: ["super-brc"],
    manana: ["isla-victoria", "tronador", "kayak-moreno", "canopy-brc", "nahuelito"],
    almuerzo: ["patagonia-brewpub", "blest"],
    tarde: ["playa-bonita", "cerro-otto"],
    cena: ["la-marca", "boliche-alberto"],
    noche: ["jauja"],
    dormirBase: "Bariloche",
    plan: "Menú a elección: navegación al Isla Victoria + Arrayanes desde Puerto Pañuelo, excursión al Tronador con su glaciar negro, kayak en el Moreno o tarde de playa y helado. Despensa para el resto del viaje.",
    nota: "El catamarán y el Tronador toman el día entero; la playa se combina con cualquiera." },

  { dia: 7, base: "Bariloche → Pucón", titulo: "Ruta de los Siete Lagos + Tromen", tramo: "t3",
    costos: ["peaje-t3"],
    desayuno: ["super-brc"],
    manana: ["siete-lagos"],
    almuerzo: ["almuer-sml-b", "almuer-sml", "almuer-sml-c"],
    tarde: ["mer-junin"],
    cena: ["el-camino-pucon", "la-generosa", "cena-casa-puc"],
    dormirBase: "Pucón",
    plan: "El día escénico del viaje: RN234 por los Siete Lagos con paradas de foto cada 10 minutos, almuerzo en San Martín de los Andes, merienda en Junín y paso Mamuil Malal (Tromen) hasta Pucón.",
    nota: "El paso Tromen cierra a las 20:00 — salir de Bariloche antes de las 09:00." },

  { dia: 8, base: "Pucón", titulo: "Termas Geométricas ⭐", tramo: null,
    costos: [],
    desayuno: ["cafe-de-la-p"],
    manana: ["feria-pucon", "museo-mapuche"],
    almuerzo: ["la-generosa", "el-camino-pucon"],
    tarde: [],
    noche: ["termas-geometricas", "pozones", "termas-palguin"],
    cena: ["cena-casa-puc"],
    dormirBase: "Pucón",
    plan: "Mañana tranquila: feria artesanal, museo mapuche y café de especialidad. Tarde/noche en las termas elegidas — Geométricas (17 piscinas de piedra en un barranco), Los Pozones o Palguín.",
    nota: "Llevar el traje ya puesto y un sándwich: en Geométricas no hay menú." },

  { dia: 9, base: "Pucón", titulo: "Volcán y lagunas de montaña", tramo: null,
    costos: [],
    desayuno: ["cafe-de-la-p"],
    manana: ["huerquehue", "pn-villarrica", "ascenso-villarrica"],
    almuerzo: ["el-camino-pucon"],
    tarde: ["ojos-caburgua", "lago-caburgua", "salto-claro", "playa-pucon"],
    cena: ["la-maga", "tres-traphos", "puerto-pucon"],
    noche: ["playa-pucon"],
    dormirBase: "Pucón",
    plan: "Senderismo en Huerquehue (cascadas + lagunas de montaña) o el P.N. Villarrica; los muy valientes suben al cráter con guía. Tarde de saltos turquesa y atardecer en la playa con el volcán humeando de fondo.",
    nota: "El ascenso al Villarrica es exigente (14+ años) y depende del viento: cotizar con antelación." },

  { dia: 10, base: "Pucón", titulo: "Día libre configurable", tramo: null,
    costos: [],
    desayuno: ["cafe-de-la-p"],
    manana: ["rafting-trancura", "canopy-villarrica", "cabalgata-pucon", "cavernas"],
    almuerzo: ["la-generosa"],
    tarde: ["salto-claro", "termas-palguin", "museo-mapuche"],
    cena: ["cena-casa-puc", "la-generosa"],
    noche: [],
    dormirBase: "Pucón",
    plan: "Menú a elección: aventura (rafting del Trancura, tirolesas, cabalgata, cavernas volcánicas) o descanso total (Salto del Claro, termas de Palguín y siesta larga).",
    nota: "Perfecto para dividir al grupo: los valientes al rafting, los del relax a las termas." },

  { dia: 11, base: "Pucón", titulo: "Última mañana: mercado y cierre", tramo: null,
    costos: [],
    desayuno: ["cafe-de-la-p"],
    manana: ["playa-pucon", "feria-pucon"],
    almuerzo: ["la-generosa", "el-camino-pucon"],
    tarde: ["souvenirs"],
    cena: ["asado-quincho", "cena-casa-puc"],
    noche: [],
    dormirBase: "Pucón",
    plan: "Compras de último momento, kayak o playa y el gran asado de despedida en el quincho. Maletas listas y checklist fronterizo revisado para la ruta de mañana.",
    nota: "Revisar el checklist de documentos hoy: mañana arranca a las 08:30." }
];

/* Día final: regreso a Santiago (se posiciona siempre al final) */
const REGRESO = {
  dia: 12, base: "Pucón → Santiago", titulo: "Regreso a casa (780 km)", tramo: "t4",
  costos: ["peaje-t4"],
  desayuno: ["desay-v", "desay-v-b"],
  manana: [],
  almuerzo: ["almuer-t4b", "almuer-t4", "almuer-t4c"],
  tarde: [],
  cena: ["cena-final"],
  noche: [],
  dormirBase: null,
  plan: "Salida 08:30 tras el desayuno en Villarrica. Ruta 5 con parada de almuerzo en Chillán y llegada a casa ~18:00. Cierre oficial: pizza y selección de fotos del viaje todos juntos.",
  nota: "Volver a cargar el estanque en Pucón: la simulación del plan de estanques cubre la vuelta completa." };

/* Días extra (se insertan automáticamente al subir la duración del slider) */
const EXTRAS = [
  { tras: 2, base: "Osorno", titulo: "Extra: Puerto Octay y Pilmaiquén", tramo: null,
    costos: [],
    desayuno: ["despensa-osr"],
    manana: ["puerto-octay", "pilmaiquen"],
    almuerzo: ["almuer-ensenada"],
    tarde: ["kayak-rupanco"],
    cena: ["cena-casa-osr", "cassata"],
    noche: [],
    dormirBase: "Osorno",
    plan: "Vuelta relajada por el lago Rupanco: bahía de Puerto Octay, miradores, saltos del Pilmaiquén y kayak al atardecer.",
    nota: "Día de ritmo suave, ideal entre el viaje largo y el cruce a Argentina." },
  { tras: 6, base: "Bariloche", titulo: "Extra: Otto, Colonia Suiza y playa", tramo: null,
    costos: [],
    desayuno: ["super-brc"],
    manana: ["cerro-otto", "colonia-suiza"],
    almuerzo: ["curanto-colonia", "blest"],
    tarde: ["playa-bonita", "nahuelito"],
    cena: ["bachmann", "la-marca"],
    noche: ["jauja"],
    dormirBase: "Bariloche",
    plan: "Aerosilla del Otto y su confitería giratoria, Colonia Suiza con su feria artesanal, tarde de playa y dinosaurios en el Parque Nahuelito.",
    nota: "El día más flexible de Bariloche: se adapta al clima y a las pilas del grupo." },
  { tras: 10, base: "Pucón", titulo: "Extra: Caburgua, Pozones y asado", tramo: null,
    costos: [],
    desayuno: ["cafe-de-la-p"],
    manana: ["ojos-caburgua", "lago-caburgua"],
    almuerzo: ["el-camino-pucon"],
    tarde: ["pozones"],
    noche: ["playa-pucon"],
    cena: ["asado-quincho", "la-generosa"],
    dormirBase: "Pucón",
    plan: "Playa Blanca en el lago Caburgua por la mañana, pozones termales al borde del río por la tarde y asado en el quincho.",
    nota: "El combo favorito de los niños: agua turquesa + pozones + asado." },
  { tras: 11, base: "Pucón", titulo: "Extra: Conguillío y sus araucarias", tramo: null,
    costos: [],
    desayuno: ["cafe-de-la-p"],
    manana: ["conguillio"],
    almuerzo: ["el-camino-pucon"],
    tarde: [],
    cena: ["cena-casa-puc", "la-generosa"],
    noche: [],
    dormirBase: "Pucón",
    plan: "Día completo al P.N. Conguillío: bosques de araucarias milenarias, laguna Verde y el volcán Llaima. Llevar picnic y bencina llena.",
    nota: "Son ~2 h por tramo desde Pucón: salir temprano y avisar en la cabaña la hora de vuelta." }
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

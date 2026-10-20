/* ============================================================
   Operación Sur 2027 — app interactiva v3
   Vue 3 + Leaflet autoalojados · cero build · ES2022
   Itinerario día a día + presupuesto vivo + doble monedero
   + plan de estanques por auto (Rush + CX-5)
   ============================================================ */

const NIVEL_C = { "económico": "#059669", "medio": "#d97706", "premium": "#7c3aed" };

const CLS = {
  alojamiento: { label: "Alojamiento", color: "#0891b2", icon: "🏠" },
  atraccion:   { label: "Atracción",   color: "#f59e0b", icon: "🎟️" },
  comida:      { label: "Comida",      color: "#ef4444", icon: "🍽️" },
  ruta:        { label: "Combustible y ruta", color: "#6366f1", icon: "⛽" },
  extra:       { label: "Extras",      color: "#8b5cf6", icon: "🧭" }
};

const { createApp, computed, reactive, onMounted, watch } = Vue;

createApp({
  setup() {
    /* ---------- estado ---------- */
    const cat = reactive({
      cfg: { ...VIAJE, fx: { ...FX } },
      seleccion: {},      // id -> {n?} meta
      precios: {},        // id -> precio editado (en moneda original)
      filtroBase: "todos",
      filtroCat: "todas",
      filtroNivel: "todos",
      busqueda: "",
      rutasOk: false,
      capaActiva: { alojamiento: true, atraccion: true, comida: true, ruta: true, extra: true },
      showCanasta: false,
      showAjustes: false,
      diaActiva: 1,
      copiado: false
    });

    const items = reactive(ITEMS.map(x => ({ ...x })));
    const itemPorId = id => items.find(x => x.id === id);
    const checklist = reactive(CHECKLIST.map((t, i) => ({ id: i, texto: t, ok: false })));

    /* ---------- persistencia + compartir ---------- */
    function serializar() {
      return JSON.stringify({ s: cat.seleccion, p: cat.precios, c: cat.cfg, k: checklist.map(c => c.ok) });
    }
    function restaurar(obj) {
      if (obj.s) cat.seleccion = obj.s;
      if (obj.p) cat.precios = obj.p;
      if (obj.c) {
        const c = { ...obj.c };
        if (c.dias && !c.noches) c.noches = Math.max(11, Math.min(15, c.dias - 1));
        if (!c.bloque || !BLOQUES.some(b => b.id === c.bloque)) c.bloque = "A";
        if (!c.salidaFecha) c.salidaFecha = (BLOQUES.find(b => b.id === c.bloque) || BLOQUES[0]).inicio;
        c.vehiculos = 2;  // siempre los 2 autos reales (Rush + CX-5)
        cat.cfg = { ...cat.cfg, ...c };
      }
      if (obj.k) obj.k.forEach((v, i) => { if (checklist[i]) checklist[i].ok = v; });
    }
    function guardar() {
      try { localStorage.setItem("opsur2027", serializar()); } catch (e) {}
    }
    function cargarUrl() {
      try {
        const h = location.hash;
        if (h.startsWith("#plan=")) {
          restaurar(JSON.parse(decodeURIComponent(escape(atob(h.slice(6))))));
        } else {
          const saved = localStorage.getItem("opsur2027");
          if (saved) restaurar(JSON.parse(saved));
          else planRecomendado();
        }
      } catch (e) { planRecomendado(); }
    }
    function compartir() {
      const hash = "#plan=" + btoa(unescape(encodeURIComponent(serializar())));
      history.replaceState(null, "", hash);
      navigator.clipboard && navigator.clipboard.writeText(location.href).catch(() => {});
      cat.copiado = true;
      setTimeout(() => cat.copiado = false, 2500);
    }

    function planRecomendado() {
      cat.seleccion = {};
      items.filter(x => x.sugerido).forEach(x => {
        const n = x.unit === "noche" ? nochesBase(x.base) : 1;
        cat.seleccion[x.id] = { n };
      });
    }
    function planVacio() { cat.seleccion = {}; }

    /* ---------- noches por base (slider 11–15; el resto va a Pucón) ---------- */
    function nochesBase(base) {
      const n = cat.cfg.noches;
      const os = n >= 13 ? 3 : 2;
      const br = n >= 15 ? 5 : (n >= 12 ? 4 : 3);
      const pu = Math.max(2, n - os - br);
      if (base === "Osorno") return os;
      if (base === "Bariloche") return br;
      if (base === "Pucón") return pu;
      return 1;
    }
    const totalNoches = computed(() => cat.cfg.noches);
    const totalDias = computed(() => cat.cfg.noches + 1);

    /* ---------- fechas ---------- */
    function addDias(iso, n) {
      const d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n);
      return d.toISOString().slice(0, 10);
    }
    function diffDias(a, b) {
      return Math.round((new Date(a + "T12:00:00Z") - new Date(b + "T12:00:00Z")) / 864e5);
    }
    function fmtFDia(iso) {
      return new Date(iso + "T12:00:00Z").toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
    }
    const bloqueAct = computed(() => BLOQUES.find(b => b.id === cat.cfg.bloque) || BLOQUES[0]);
    const finViaje = computed(() => addDias(cat.cfg.salidaFecha, cat.cfg.noches));
    const nochesMax = computed(() => Math.min(15, Math.max(11, diffDias(bloqueAct.value.fin, cat.cfg.salidaFecha))));
    function fechaDia(n) { return fmtFDia(addDias(cat.cfg.salidaFecha, n - 1)); }
    function validarNoches() {
      const b = bloqueAct.value;
      let s = cat.cfg.salidaFecha;
      if (s < b.inicio) s = b.inicio;
      const capSalida = addDias(b.fin, -Math.max(11, cat.cfg.noches));
      if (s > capSalida) s = (capSalida < b.inicio) ? b.inicio : capSalida;
      cat.cfg.salidaFecha = s;
      const maxN = Math.max(11, diffDias(b.fin, s));
      if (cat.cfg.noches > Math.min(15, maxN)) cat.cfg.noches = Math.min(15, maxN);
      if (cat.cfg.noches < 11) cat.cfg.noches = 11;
    }

    /* ---------- moneda: doble monedero (ARS/USD + CLP a la vez) ---------- */
    function aCLP(precio, moneda) {
      if (moneda === "ARS") return precio / cat.cfg.fx.arsPorClp;
      if (moneda === "USD") return precio * cat.cfg.fx.clpPorUsd;
      return precio;
    }
    function fmtCLP(v) { return "$" + Math.round(v).toLocaleString("es-CL"); }
    function precioEditOriginal(item) {
      return cat.precios[item.id] !== undefined ? cat.precios[item.id] : item.precio;
    }
    function equivCLP(item) {
      const p = precioEditOriginal(item);
      if (!p || p <= 0 || item.moneda === "CLP") return null;
      return fmtCLP(aCLP(p, item.moneda)) + " CLP";
    }
    function fmtMonOrig(item) {
      const p = precioEditOriginal(item);
      const suf = item.unit === "persona" ? "/persona" : item.unit === "noche" ? "/noche" : item.unit === "vehiculo" ? "/veh" : "";
      return p.toLocaleString("es-CL") + " " + item.moneda + suf;
    }
    function editarPrecio(item, val) {
      const v = parseFloat(val);
      if (isNaN(v)) { delete cat.precios[item.id]; return; }
      cat.precios[item.id] = v;
      guardar();
    }
    /* precio para las tarjetas del itinerario (HTML: moneda original + ≈CLP) */
    function precioTxt(it) {
      if (it.unit === "sim") return fmtCLP(benc.value.totalCLP) + " · automático";
      const p = precioEditOriginal(it);
      const suf = it.unit === "persona" ? " p/p" : it.unit === "noche" ? " /noche" : it.unit === "vehiculo" ? " /veh" : "";
      if (!p || p <= 0) return "¡Gratis!";
      if (it.moneda === "CLP") return fmtCLP(p) + suf;
      return p.toLocaleString("es-CL") + " " + it.moneda + suf +
             ' <small>≈ ' + fmtCLP(aCLP(p, it.moneda)) + "</small>";
    }
    function nivelKey(n) {
      return (n || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    /* ---------- motor de costos ----------
       noche ×n · persona ×9 (niños con precio_nino) · grupo ×1 · vehículo ×2 */
    function costoCLP(id) {
      const item = itemPorId(id);
      if (!item) return 0;
      const meta = cat.seleccion[id];
      if (!meta) return 0;
      if (item.unit === "sim") return benc.value.totalCLP;
      const p = cat.precios[item.id] !== undefined ? cat.precios[item.id] : item.precio;
      let total = 0;
      if (item.unit === "noche") {
        total = aCLP(p, item.moneda) * (meta.n || 1);
      } else if (item.unit === "persona") {
        const pn = item.precio_nino !== undefined
          ? (cat.precios[item.id + ":nino"] !== undefined ? cat.precios[item.id + ":nino"] : item.precio_nino)
          : null;
        const nAd = cat.cfg.familias.reduce((a, f) => a + f.adultos, 0);
        const nNi = cat.cfg.familias.reduce((a, f) => a + f.ninos, 0);
        total = aCLP(p, item.moneda) * nAd + (pn !== null ? aCLP(pn, item.moneda) * nNi : aCLP(p, item.moneda) * nNi);
      } else if (item.unit === "vehiculo") {
        total = aCLP(p, item.moneda) * cat.cfg.vehiculos;
      } else {
        total = aCLP(p, item.moneda);
      }
      return total;
    }
    const elegidos = computed(() =>
      Object.keys(cat.seleccion).map(id => itemPorId(id)).filter(Boolean)
        .map(item => ({ ...item, total: costoCLP(item.id) }))
    );
    const totalCLP = computed(() => elegidos.value.reduce((a, x) => a + x.total, 0));
    const porPersona = computed(() => totalCLP.value / 9);
    const porDia = computed(() => totalCLP.value / (cat.cfg.noches + 1));
    const enUSD = computed(() => totalCLP.value / cat.cfg.fx.clpPorUsd);
    const porCategoria = computed(() => {
      const acc = {};
      elegidos.value.forEach(x => { acc[x.cat] = (acc[x.cat] || 0) + x.total; });
      const total = totalCLP.value || 1;
      return Object.entries(acc)
        .map(([k, v]) => ({ cat: k, ...CLS[k], total: v, pct: (v / total) * 100 }))
        .sort((a, b) => b.total - a.total);
    });
    const porFamilia = computed(() => [
      { nombre: "Familia 1", pax: 5, total: totalCLP.value * 5 / 9 },
      { nombre: "Familia 2", pax: 4, total: totalCLP.value * 4 / 9 }
    ]);

    /* ---------- catálogo (explorar) ---------- */
    const bases = ["todos", ...new Set(items.map(x => x.base))];
    const categorias = ["todas", ...Object.keys(CLS)];
    const niveles = ["económico", "medio", "premium"];
    const catalogo = computed(() => {
      const q = cat.busqueda.trim().toLowerCase();
      return items.filter(x =>
        (cat.filtroBase === "todos" || x.base === cat.filtroBase) &&
        (cat.filtroCat === "todas" || x.cat === cat.filtroCat) &&
        (cat.filtroNivel === "todos" || x.nivel === cat.filtroNivel) &&
        (!q || (x.nombre + " " + x.desc + " " + x.base).toLowerCase().includes(q))
      );
    });
    function esta(id) { return !!cat.seleccion[id]; }
    function toggle(item) {
      if (cat.seleccion[item.id]) delete cat.seleccion[item.id];
      else cat.seleccion[item.id] = { n: item.unit === "noche" ? nochesBase(item.base) : 1 };
      guardar();
    }
    function noches(id) { return (cat.seleccion[id] || {}).n || 1; }
    function setNoches(id, n) {
      if (!cat.seleccion[id]) return;
      cat.seleccion[id].n = Math.max(1, Math.min(cat.cfg.noches, n));
      guardar();
    }

    /* ---------- itinerario día a día ---------- */
    const diasVisibles = computed(() => {
      const n = cat.cfg.noches + 1;                       // 12–16 días
      const lista = DIAS.map(d => ({ ...d }));
      EXTRAS.slice(0, Math.max(0, n - 12)).forEach(e => { // días extra en su posición
        const idx = lista.findIndex(d => d.dia === e.tras) + 1;
        lista.splice(idx, 0, { ...e });
      });
      lista.push({ ...REGRESO });
      return lista.slice(0, n).map((d, i) => ({ ...d, dia: i + 1 }));
    });
    const diaActual = computed(() =>
      diasVisibles.value.find(d => d.dia === cat.diaActiva) || diasVisibles.value[0]
    );
    function irDia(n) {
      const max = diasVisibles.value.length;
      cat.diaActiva = Math.min(max, Math.max(1, n));
      requestAnimationFrame(() => {
        const el = document.querySelector(".day");
        if (el && window.scrollY > el.offsetTop - 160) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    function itemsDe(ids) { return (ids || []).map(id => itemPorId(id)).filter(Boolean); }
    function tramoDe(id) { return TRAMOS.find(t => t.id === id) || null; }
    function dormirDe(d) { return d.dormirBase ? itemsDe(DORMIR[d.dormirBase]) : []; }
    function bloquesDe(d) { return [
      { icono: "🌅", titulo: "Mañana", items: itemsDe(d.manana) },
      { icono: "☀️", titulo: "Tarde", items: itemsDe(d.tarde) },
      { icono: "🌙", titulo: "Noche", items: itemsDe(d.noche) }
    ]; }
    function slotsDe(d) { return [
      { icono: "☕", titulo: "Desayuno", items: itemsDe(d.desayuno) },
      { icono: "🍴", titulo: "Almuerzo", items: itemsDe(d.almuerzo) },
      { icono: "🍲", titulo: "Cena", items: itemsDe(d.cena) }
    ].filter(s => s.items.length); }
    function tieneComidas(d) { return slotsDe(d).length > 0; }
    function diaElegidos(d) {
      const ids = [...(d.costos || []), ...(d.desayuno || []), ...(d.almuerzo || []), ...(d.cena || []),
                   ...(d.manana || []), ...(d.tarde || []), ...(d.noche || []),
                   ...(d.dormirBase ? DORMIR[d.dormirBase] : [])];
      return ids.filter((id, i) => ids.indexOf(id) === i && esta(id)).length;
    }

    /* ---------- mapa ---------- */
    let map, layers = {}, rutasLayer;
    const iconoDiv = (color, emoji, size) => L.divIcon({
      className: "mk",
      html: `<div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 4px;transform:rotate(-45deg);background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(15,23,42,.35);display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);font-size:${size * 0.45}px">${emoji}</span></div>`,
      iconSize: [size, size], iconAnchor: [size / 2, size], popupAnchor: [0, -size * 0.8]
    });
    function popupHTML(item) {
      const c = CLS[item.cat];
      const en = esta(item.id);
      const p = precioEditOriginal(item);
      const precioTxtPop = p > 0
        ? (item.moneda !== "CLP"
            ? `${p.toLocaleString("es-CL")} ${item.moneda} <small>≈ ${fmtCLP(aCLP(p, item.moneda))} CLP</small>`
            : fmtCLP(p)) + (item.unit === "persona" ? " pp" : item.unit === "noche" ? " /noche" : item.unit === "vehiculo" ? " /veh" : "")
        : "¡GRATIS!";
      return `<div class="pop">
        <div class="pop-cat" style="background:${c.color}">${c.icon} ${c.label}</div>
        <div class="pop-nombre">${item.nombre}${item.nivel ? ` <span style="display:inline-block;font-size:10.5px;font-weight:800;padding:2px 8px;border-radius:99px;color:#fff;background:${NIVEL_C[item.nivel] || "#64748b"};vertical-align:middle">${item.nivel.toUpperCase()}</span>` : ""}</div>
        <div class="pop-desc">${item.desc || ""}</div>
        <div class="pop-precio">${precioTxtPop}${item.rating ? ` · ★${item.rating}` : ""}</div>
        ${item.fuente && item.fuente.u ? `<a href="${item.fuente.u}" target="_blank" rel="noopener">Fuente: ${item.fuente.n} ↗</a>` : ""}
        <button data-add="${item.id}" class="pop-btn" style="background:${en ? "#e2e8f0;color:#334155" : c.color}">${en ? "✓ En el viaje — quitar" : "+ Agregar al viaje"}</button>
      </div>`;
    }
    function bindPopActions() {
      map && map.on("popupopen", e => {
        const btn = e.popup.getElement().querySelector("[data-add]");
        if (btn) btn.onclick = () => {
          const it = itemPorId(btn.dataset.add);
          toggle(it);
          it && it.geo && e.popup.setContent(popupHTML(it));
          btn.textContent = esta(it.id) ? "✓ En el viaje — quitar" : "+ Agregar al viaje";
          btn.style.background = esta(it.id) ? "#e2e8f0" : CLS[it.cat].color;
        };
      });
    }
    function construirCapas() {
      items.forEach(item => {
        if (!item.geo) return;
        const c = CLS[item.cat];
        const m = L.marker(item.geo, { icon: iconoDiv(c.color, c.icon, item.cat === "alojamiento" ? 38 : 32), title: item.nombre });
        m.bindPopup(popupHTML(item), { maxWidth: 300 });
        if (!layers[item.cat]) layers[item.cat] = L.layerGroup();
        layers[item.cat].addLayer(m);
      });
    }
    async function dibujarRutas() {
      rutasLayer = rutasLayer || L.layerGroup().addTo(map);
      const all = [];
      for (const t of TRAMOS) {
        const pts = t.wp.map(w => [w[0], w[1]]);
        all.push(...pts);
        let line = null;
        try {
          const url = "https://router.project-osrm.org/route/v1/driving/" +
            pts.map(p => p[1] + "," + p[0]).join(";") + "?overview=full&geometries=geojson";
          const r = await fetch(url);
          const j = await r.json();
          if (j.routes && j.routes[0]) {
            line = L.geoJSON(j.routes[0].geometry, { style: { color: "#0f766e", weight: 5, opacity: 0.85 } });
            cat.rutasOk = true;
          }
        } catch (e) { /* fallback abajo */ }
        if (!line) line = L.polyline(pts, { color: "#0f766e", weight: 5, opacity: 0.8, dashArray: "8 8" });
        rutasLayer.addLayer(line);
        const mid = pts[Math.floor(pts.length / 2)];
        L.marker(mid, {
          icon: L.divIcon({ className: "mk", html: `<div class="tramo-chip">${t.icono} ${t.de} → ${t.a} · ${t.km} km · ${t.h}</div>`, iconSize: [10, 10], iconAnchor: [0, 12] }),
          interactive: false
        }).addTo(rutasLayer);
      }
      const basesPos = [
        { p: [-33.4489, -70.6693], n: "1", txt: "Santiago — salida 04:00" },
        { p: [-40.5745, -73.1339], n: "2", txt: "Osorno — 2-3 noches" },
        { p: [-41.1335, -71.3103], n: "3", txt: "Bariloche — 4 noches" },
        { p: [-39.2837, -72.3259], n: "4", txt: "Pucón — 3 noches" }
      ];
      basesPos.forEach(b => {
        L.marker(b.p, {
          icon: L.divIcon({ className: "mk", html: `<div class="base-pin"><span>${b.n}</span></div>`, iconSize: [30, 30], iconAnchor: [15, 15] })
        }).addTo(rutasLayer).bindPopup(`<b>${b.txt}</b>`);
      });
      map.fitBounds(L.latLngBounds(all), { padding: [40, 40] });
    }
    function initMap() {
      map = L.map("mapa", { scrollWheelZoom: true }).setView([-39.5, -71.7], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap", maxZoom: 18
      }).addTo(map);
      Object.keys(CLS).forEach(k => { layers[k] = L.layerGroup(); });
      construirCapas();
      Object.entries(layers).forEach(([k, lg]) => lg.addTo(map));
      bindPopActions();
      dibujarRutas();
    }
    function toggleCapa(k) {
      if (!map) return;
      if (cat.capaActiva[k]) { map.removeLayer(layers[k]); cat.capaActiva[k] = false; }
      else { layers[k].addTo(map); cat.capaActiva[k] = true; }
    }
    function irEnMapa(id) {
      const it = itemPorId(id);
      if (!it || !it.geo || !map) return;
      document.getElementById("mapa-section").scrollIntoView({ behavior: "smooth" });
      setTimeout(() => { map.setView(it.geo, 12); }, 350);
    }

    /* ---------- plan de estanques (Rush + CX-5) ----------
       1) Cada auto parte con el estanque LLENO en Santiago (carga virtual).
       2) Se proyecta dónde se quedaría sin bencina el de MENOR autonomía
          (estanque × consumo). Ahí: el chico LLENA completo, el grande
          paga solo el top-up para llenar.
       3) Se repite hasta Santiago. +15% manejo local.
       Precio del litro según país del punto de carga (CLP/ARS + FX). */
    const KM_RUTA = TRAMOS.reduce((a, t) => a + t.km, 0);
    function paisEnKm(km) { return km <= 1020 ? "CL" : (km < 1455 ? "AR" : "CL"); }
    function marcaCercana(km) {
      return MARKS_BENC.reduce((b, m) => Math.abs(m.km - km) < Math.abs(b.km - km) ? m : b);
    }
    function planBencina() {
      const autos = [
        { id: "rush", nombre: "Toyota Rush", tanque: +cat.cfg.tanques.rush || 45, cons: +cat.cfg.consumos.rush || 11 },
        { id: "cx5",  nombre: "Mazda CX-5",  tanque: +cat.cfg.tanques.cx5  || 58, cons: +cat.cfg.consumos.cx5  || 11 }
      ].sort((a, b) => a.tanque * a.cons - b.tanque * b.cons);
      const kmEf = KM_RUTA * 1.15;
      const st = autos.map(a => ({ ...a, rest: a.tanque }));
      const cargas = [{
        n: 1, lugar: "Carga virtual inicial — Santiago (04:00)", km: 0, pais: "CL",
        porAuto: st.map(e => ({ nombre: e.nombre, litros: e.tanque, nota: "estanque lleno" }))
      }];
      let km = 0, guard = 0;
      while (km < kmEf - 0.5 && guard++ < 24) {
        const prox = Math.min(...st.map(e => km + e.rest * e.cons));
        if (prox >= kmEf) break;
        const av = prox - km;
        st.forEach(e => { e.rest -= av / e.cons; });
        km = prox;
        const kmRuta = Math.round(km / 1.15);
        const m = marcaCercana(kmRuta);
        const pais = paisEnKm(kmRuta);
        const porAuto = st.map(e => {
          const litros = Math.round((e.tanque - e.rest) * 10) / 10;
          e.rest = e.tanque;
          return { nombre: e.nombre, litros, nota: litros >= e.tanque - 1 ? "llena completo" : "top-up para llenar" };
        });
        cargas.push({ n: cargas.length + 1, lugar: m.lugar, km: kmRuta, pais, porAuto });
      }
      const det = cargas.map(c => {
        const litrosTotal = Math.round(c.porAuto.reduce((a, p) => a + p.litros, 0) * 10) / 10;
        const pL = c.pais === "AR" ? cat.cfg.bencina_ar : cat.cfg.bencina_cl;
        const mon = c.pais === "AR" ? "ARS" : "CLP";
        const total = Math.round(litrosTotal * pL);
        return { ...c, litrosTotal, mon, total, clp: aCLP(total, mon) };
      });
      const kmRestante = Math.max(0, kmEf - km);
      st.forEach(e => { e.rest -= kmRestante / e.cons; });
      return {
        autos, kmEf, cargas: det,
        litrosTotal: Math.round(det.reduce((a, c) => a + c.litrosTotal, 0) * 10) / 10,
        totalCLP: Math.round(det.reduce((a, c) => a + c.clp, 0)),
        sobrante: st.map(e => ({ nombre: e.nombre, litros: Math.round(e.rest * 10) / 10 })),
        autonomias: autos.map(a => ({ nombre: a.nombre, km: Math.round(a.tanque * a.cons) })),
        chico: autos[0], grande: autos[1]
      };
    }
    const benc = computed(planBencina);
    const kmTotales = computed(() => KM_RUTA);

    /* ---------- reactividad + persistencia ---------- */
    watch(() => cat.cfg.noches, () => {
      validarNoches(); guardar();
      const max = diasVisibles.value.length;
      if (cat.diaActiva > max) cat.diaActiva = max;
    });
    watch(() => cat.cfg.tanques, guardar, { deep: true });
    watch(() => cat.cfg.consumos, guardar, { deep: true });
    watch(() => cat.cfg.bloque, () => {
      const b = bloqueAct.value;
      if (cat.cfg.salidaFecha < b.inicio || cat.cfg.salidaFecha > b.fin) cat.cfg.salidaFecha = b.inicio;
      validarNoches();
      guardar();
    });
    watch(() => cat.cfg.salidaFecha, () => { validarNoches(); guardar(); });
    watch(checklist, guardar, { deep: true });

    onMounted(() => {
      cargarUrl();
      initMap();
    });

    return {
      cat, items, checklist, CLS, BLOQUES,
      bases, categorias, niveles, catalogo,
      elegidos, totalCLP, porPersona, porDia, enUSD, porCategoria, porFamilia,
      esta, toggle, noches, setNoches, fmtCLP, aCLP,
      precioEditOriginal, editarPrecio, equivCLP, fmtMonOrig, precioTxt, nivelKey,
      toggleCapa, irEnMapa,
      diasVisibles, diaActual, irDia, tramoDe, itemsDe, bloquesDe, slotsDe, dormirDe, tieneComidas, diaElegidos,
      nochesBase, totalNoches, totalDias, kmTotales, benc, costoCLP,
      bloqueAct, nochesMax, finViaje, fechaDia, fmtFDia, addDias, validarNoches,
      planRecomendado, planVacio, compartir
    };
  }
}).mount("#app");

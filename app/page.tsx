"use client";

import { useMemo, useState } from "react";

type Territory = "Sonora" | "CDMX";
type Regime = "Publica" | "Privada";
type LawStatus = "Si" | "No" | "Por verificar";

type Institution = {
  id: string;
  name: string;
  campus: string;
  acronym: string;
  territory: Territory;
  municipality: string;
  regime: Regime;
  lawStatus: LawStatus;
  modality: string;
  schedule: string;
  legalBasis: string;
  enrollment: number;
  opportunity: number;
  source: string;
  updated: string;
  lat: number;
  lng: number;
  themes: string[];
  nextMove: string;
};

type MexicoState = {
  code: string;
  name: Territory | string;
  x: number;
  y: number;
  status: "piloto" | "pendiente";
};

const mexicoStates: MexicoState[] = [
  { code: "BC", name: "Baja California", x: 9, y: 12, status: "pendiente" },
  { code: "SON", name: "Sonora", x: 20, y: 20, status: "piloto" },
  { code: "CHH", name: "Chihuahua", x: 35, y: 22, status: "pendiente" },
  { code: "BCS", name: "Baja California Sur", x: 15, y: 39, status: "pendiente" },
  { code: "SIN", name: "Sinaloa", x: 28, y: 43, status: "pendiente" },
  { code: "DGO", name: "Durango", x: 42, y: 43, status: "pendiente" },
  { code: "COA", name: "Coahuila", x: 53, y: 30, status: "pendiente" },
  { code: "NL", name: "Nuevo Leon", x: 62, y: 39, status: "pendiente" },
  { code: "TAM", name: "Tamaulipas", x: 70, y: 49, status: "pendiente" },
  { code: "NAY", name: "Nayarit", x: 37, y: 58, status: "pendiente" },
  { code: "ZAC", name: "Zacatecas", x: 50, y: 53, status: "pendiente" },
  { code: "SLP", name: "San Luis Potosi", x: 61, y: 58, status: "pendiente" },
  { code: "AGS", name: "Aguascalientes", x: 51, y: 63, status: "pendiente" },
  { code: "JAL", name: "Jalisco", x: 44, y: 70, status: "pendiente" },
  { code: "GTO", name: "Guanajuato", x: 57, y: 69, status: "pendiente" },
  { code: "QRO", name: "Queretaro", x: 64, y: 69, status: "pendiente" },
  { code: "HGO", name: "Hidalgo", x: 70, y: 68, status: "pendiente" },
  { code: "COL", name: "Colima", x: 44, y: 80, status: "pendiente" },
  { code: "MICH", name: "Michoacan", x: 55, y: 78, status: "pendiente" },
  { code: "MEX", name: "Estado de Mexico", x: 67, y: 76, status: "pendiente" },
  { code: "CDMX", name: "CDMX", x: 70, y: 78, status: "piloto" },
  { code: "MOR", name: "Morelos", x: 70, y: 83, status: "pendiente" },
  { code: "PUE", name: "Puebla", x: 76, y: 78, status: "pendiente" },
  { code: "TLX", name: "Tlaxcala", x: 77, y: 73, status: "pendiente" },
  { code: "VER", name: "Veracruz", x: 82, y: 67, status: "pendiente" },
  { code: "GRO", name: "Guerrero", x: 66, y: 91, status: "pendiente" },
  { code: "OAX", name: "Oaxaca", x: 80, y: 91, status: "pendiente" },
  { code: "TAB", name: "Tabasco", x: 91, y: 82, status: "pendiente" },
  { code: "CHP", name: "Chiapas", x: 91, y: 93, status: "pendiente" },
  { code: "CAM", name: "Campeche", x: 94, y: 72, status: "pendiente" },
  { code: "YUC", name: "Yucatan", x: 97, y: 61, status: "pendiente" },
  { code: "QROO", name: "Quintana Roo", x: 99, y: 70, status: "pendiente" },
];

const institutions: Institution[] = [
  {
    id: "unison-hermosillo",
    name: "Universidad de Sonora",
    campus: "Campus Hermosillo",
    acronym: "UNISON HMO",
    territory: "Sonora",
    municipality: "Hermosillo",
    regime: "Publica",
    lawStatus: "Si",
    modality: "Presencial",
    schedule: "L-V, matutino y vespertino",
    legalBasis: "Fundamento publico; RVOE no aplica como particular",
    enrollment: 8200,
    opportunity: 93,
    source: "Oferta educativa institucional",
    updated: "2026-07-25",
    lat: 29.083,
    lng: -110.961,
    themes: ["Administrativo", "Constitucional", "Fiscal"],
    nextMove: "Validar calendario de Facultad y definir conferencia base en Hermosillo.",
  },
  {
    id: "unison-caborca",
    name: "Universidad de Sonora",
    campus: "Campus Caborca",
    acronym: "UNISON CAB",
    territory: "Sonora",
    municipality: "Caborca",
    regime: "Publica",
    lawStatus: "Si",
    modality: "Presencial",
    schedule: "L-V por confirmar",
    legalBasis: "Fundamento publico; RVOE no aplica como particular",
    enrollment: 2100,
    opportunity: 74,
    source: "Oferta educativa institucional",
    updated: "2026-07-25",
    lat: 30.712,
    lng: -112.164,
    themes: ["Ruta norte", "Derecho publico"],
    nextMove: "Confirmar capacidad de sede y si conviene ruta Hermosillo-Caborca-Nogales.",
  },
  {
    id: "unison-nogales",
    name: "Universidad de Sonora",
    campus: "Campus Nogales",
    acronym: "UNISON NOG",
    territory: "Sonora",
    municipality: "Nogales",
    regime: "Publica",
    lawStatus: "Si",
    modality: "Presencial",
    schedule: "L-V por confirmar",
    legalBasis: "Fundamento publico; RVOE no aplica como particular",
    enrollment: 1900,
    opportunity: 72,
    source: "Oferta educativa institucional",
    updated: "2026-07-25",
    lat: 31.301,
    lng: -110.938,
    themes: ["Frontera", "Vinculacion regional"],
    nextMove: "Confirmar calendario y aliados locales antes de integrarla a gira.",
  },
  {
    id: "itson-obregon",
    name: "Instituto Tecnologico de Sonora",
    campus: "Campus Ciudad Obregon",
    acronym: "ITSON OBR",
    territory: "Sonora",
    municipality: "Cajeme",
    regime: "Publica",
    lawStatus: "Si",
    modality: "Mixta / tetramestral por confirmar",
    schedule: "L-V y ventanas ejecutivas por confirmar",
    legalBasis: "Fundamento publico; programa citado en comunicacion institucional",
    enrollment: 5300,
    opportunity: 84,
    source: "Sitio institucional",
    updated: "2026-07-25",
    lat: 27.486,
    lng: -109.94,
    themes: ["Fiscal", "Responsabilidades", "Justicia administrativa"],
    nextMove: "Confirmar oferta vigente de Derecho por campus y disponibilidad sabatina.",
  },
  {
    id: "ues-hermosillo",
    name: "Universidad Estatal de Sonora",
    campus: "Unidad Hermosillo",
    acronym: "UES HMO",
    territory: "Sonora",
    municipality: "Hermosillo",
    regime: "Publica",
    lawStatus: "Por verificar",
    modality: "Por levantar",
    schedule: "Pendiente",
    legalBasis: "Fundamento publico; oferta de Derecho pendiente de verificacion",
    enrollment: 3600,
    opportunity: 61,
    source: "Convocatoria/oferta institucional pendiente de cruce",
    updated: "2026-07-25",
    lat: 29.096,
    lng: -110.955,
    themes: ["Aliado regional", "Educacion continua"],
    nextMove: "Confirmar si imparte Derecho; si no, clasificar como aliado no juridico.",
  },
  {
    id: "udeh-hermosillo",
    name: "Universidad de Hermosillo",
    campus: "Campus Hermosillo",
    acronym: "UdeH",
    territory: "Sonora",
    municipality: "Hermosillo",
    regime: "Privada",
    lawStatus: "Si",
    modality: "Presencial",
    schedule: "Por confirmar",
    legalBasis: "RVOE por programa pendiente de captura",
    enrollment: 1600,
    opportunity: 73,
    source: "Sitio institucional",
    updated: "2026-07-25",
    lat: 29.09,
    lng: -110.977,
    themes: ["Derecho", "Ciencias politicas", "Evento juridico"],
    nextMove: "Capturar RVOE especifico y contacto de coordinacion de Derecho.",
  },
  {
    id: "ctum-hermosillo",
    name: "Colegio Tecnologico Universitario de Mexico",
    campus: "Campus Hermosillo",
    acronym: "CTUM",
    territory: "Sonora",
    municipality: "Hermosillo",
    regime: "Privada",
    lawStatus: "Si",
    modality: "Por confirmar",
    schedule: "Por confirmar",
    legalBasis: "RVOE 20190075 citado por la institucion",
    enrollment: 900,
    opportunity: 66,
    source: "Sitio institucional",
    updated: "2026-07-25",
    lat: 29.075,
    lng: -110.955,
    themes: ["Derecho", "RVOE capturable"],
    nextMove: "Validar RVOE en fuente oficial y geocodificar sede exacta.",
  },
  {
    id: "unam-derecho",
    name: "Universidad Nacional Autonoma de Mexico",
    campus: "Facultad de Derecho, Ciudad Universitaria",
    acronym: "UNAM",
    territory: "CDMX",
    municipality: "Coyoacan",
    regime: "Publica",
    lawStatus: "Si",
    modality: "Presencial / abierta / distancia",
    schedule: "L-V y opciones flexibles",
    legalBasis: "Autonomia universitaria",
    enrollment: 14500,
    opportunity: 97,
    source: "Sitio institucional",
    updated: "2026-07-25",
    lat: 19.332,
    lng: -99.188,
    themes: ["Constitucional", "Electoral", "Datos juridicos"],
    nextMove: "Segmentar Facultad, SUAyED, posgrado y entidades juridicas relacionadas.",
  },
  {
    id: "uam-azcapotzalco",
    name: "Universidad Autonoma Metropolitana",
    campus: "Unidad Azcapotzalco",
    acronym: "UAM AZC",
    territory: "CDMX",
    municipality: "Azcapotzalco",
    regime: "Publica",
    lawStatus: "Si",
    modality: "Presencial",
    schedule: "Matutino; medio tiempo y tiempo completo",
    legalBasis: "Fundamento publico",
    enrollment: 4300,
    opportunity: 86,
    source: "Oferta de licenciaturas UAM",
    updated: "2026-07-25",
    lat: 19.503,
    lng: -99.187,
    themes: ["Administrativo", "Investigacion", "Politicas publicas"],
    nextMove: "Confirmar auditorio y calendario trimestral.",
  },
  {
    id: "uam-cuajimalpa",
    name: "Universidad Autonoma Metropolitana",
    campus: "Unidad Cuajimalpa",
    acronym: "UAM CUA",
    territory: "CDMX",
    municipality: "Cuajimalpa",
    regime: "Publica",
    lawStatus: "Si",
    modality: "Presencial",
    schedule: "Unico; tiempo completo",
    legalBasis: "Fundamento publico",
    enrollment: 1800,
    opportunity: 80,
    source: "Oferta de licenciaturas UAM",
    updated: "2026-07-25",
    lat: 19.365,
    lng: -99.282,
    themes: ["Derecho", "Sustentabilidad", "Administracion publica"],
    nextMove: "Agrupar con universidades del poniente por cercania territorial.",
  },
  {
    id: "uacm-cuautepec",
    name: "Universidad Autonoma de la Ciudad de Mexico",
    campus: "Plantel Cuautepec",
    acronym: "UACM",
    territory: "CDMX",
    municipality: "Gustavo A. Madero",
    regime: "Publica",
    lawStatus: "Si",
    modality: "Escolarizado",
    schedule: "Vespertino",
    legalBasis: "Fundamento publico local",
    enrollment: 2200,
    opportunity: 78,
    source: "Oferta academica UACM",
    updated: "2026-07-25",
    lat: 19.541,
    lng: -99.139,
    themes: ["Derechos humanos", "Constitucional", "Derecho administrativo"],
    nextMove: "Confirmar disponibilidad de plantel y contacto de programa.",
  },
  {
    id: "itam-cdmx",
    name: "Instituto Tecnologico Autonomo de Mexico",
    campus: "Rio Hondo",
    acronym: "ITAM",
    territory: "CDMX",
    municipality: "Alvaro Obregon",
    regime: "Privada",
    lawStatus: "Si",
    modality: "Presencial",
    schedule: "Por confirmar",
    legalBasis: "RVOE/fundamento particular pendiente de captura",
    enrollment: 2500,
    opportunity: 88,
    source: "Sitio institucional por verificar",
    updated: "2026-07-25",
    lat: 19.344,
    lng: -99.2,
    themes: ["Fiscal", "Constitucional", "Economia publica"],
    nextMove: "Validar RVOE y ubicar contacto de licenciatura en Derecho.",
  },
  {
    id: "up-cdmx",
    name: "Universidad Panamericana",
    campus: "Campus Mexico",
    acronym: "UP",
    territory: "CDMX",
    municipality: "Benito Juarez",
    regime: "Privada",
    lawStatus: "Si",
    modality: "Presencial",
    schedule: "Por confirmar",
    legalBasis: "RVOE por programa pendiente de captura",
    enrollment: 2700,
    opportunity: 85,
    source: "Sitio institucional por verificar",
    updated: "2026-07-25",
    lat: 19.372,
    lng: -99.181,
    themes: ["Empresa", "Fiscal", "Posgrado"],
    nextMove: "Verificar plan de estudios y opciones de educacion continua.",
  },
  {
    id: "ibero-cdmx",
    name: "Universidad Iberoamericana",
    campus: "Campus Ciudad de Mexico",
    acronym: "IBERO",
    territory: "CDMX",
    municipality: "Alvaro Obregon",
    regime: "Privada",
    lawStatus: "Si",
    modality: "Presencial",
    schedule: "Por confirmar",
    legalBasis: "RVOE por programa pendiente de captura",
    enrollment: 3100,
    opportunity: 82,
    source: "Sitio institucional por verificar",
    updated: "2026-07-25",
    lat: 19.371,
    lng: -99.263,
    themes: ["Derechos humanos", "Publico", "Clinicas juridicas"],
    nextMove: "Confirmar coordinacion de Derecho y calendario academico.",
  },
  {
    id: "lasalle-cdmx",
    name: "Universidad La Salle",
    campus: "Campus Condesa",
    acronym: "La Salle",
    territory: "CDMX",
    municipality: "Cuauhtemoc",
    regime: "Privada",
    lawStatus: "Si",
    modality: "Presencial",
    schedule: "Por confirmar",
    legalBasis: "RVOE por programa pendiente de captura",
    enrollment: 2800,
    opportunity: 79,
    source: "Sitio institucional por verificar",
    updated: "2026-07-25",
    lat: 19.408,
    lng: -99.18,
    themes: ["Derecho", "Vinculacion", "Educacion continua"],
    nextMove: "Validar RVOE y oportunidades para conferencia vespertina.",
  },
  {
    id: "uvm-coyoacan",
    name: "Universidad del Valle de Mexico",
    campus: "Campus Coyoacan",
    acronym: "UVM COY",
    territory: "CDMX",
    municipality: "Coyoacan",
    regime: "Privada",
    lawStatus: "Si",
    modality: "Presencial / ejecutiva por verificar",
    schedule: "Por confirmar",
    legalBasis: "RVOE por programa pendiente de captura",
    enrollment: 3600,
    opportunity: 77,
    source: "Sitio institucional por verificar",
    updated: "2026-07-25",
    lat: 19.33,
    lng: -99.146,
    themes: ["Ejecutivo", "Derecho", "Sabatino"],
    nextMove: "Confirmar modalidad exacta de Derecho y horarios sabatinos.",
  },
];

const weights = [
  ["Demanda", 25],
  ["Afinidad juridica", 20],
  ["Capacidad", 15],
  ["Accesibilidad", 10],
  ["Red de aliados", 10],
  ["Historial", 10],
  ["Contacto", 5],
  ["Saturacion", 5],
] as const;

export default function Home() {
  const [territory, setTerritory] = useState<Territory | "Todos">("Todos");
  const [regime, setRegime] = useState<Regime | "Todos">("Todos");
  const [lawOnly, setLawOnly] = useState(false);
  const [selectedState, setSelectedState] = useState<Territory | string>("Sonora");
  const [selected, setSelected] = useState("unison-hermosillo");
  const [note, setNote] = useState("");

  const selectedStateInventory = useMemo(
    () => institutions.filter((item) => item.territory === selectedState),
    [selectedState],
  );

  const visibleInstitutions = useMemo(
    () =>
      institutions
        .filter((item) => territory === "Todos" || item.territory === territory)
        .filter((item) => regime === "Todos" || item.regime === regime)
        .filter((item) => !lawOnly || item.lawStatus === "Si")
        .sort((a, b) => b.opportunity - a.opportunity),
    [territory, regime, lawOnly],
  );

  const stateInstitutions = useMemo(
    () =>
      institutions
        .filter((item) => item.territory === selectedState)
        .filter((item) => regime === "Todos" || item.regime === regime)
        .filter((item) => !lawOnly || item.lawStatus === "Si")
        .sort((a, b) => b.opportunity - a.opportunity),
    [selectedState, regime, lawOnly],
  );

  const active = institutions.find((item) => item.id === selected) ?? stateInstitutions[0] ?? visibleInstitutions[0] ?? institutions[0];
  const comparable = stateInstitutions.length > 0 ? stateInstitutions : visibleInstitutions;
  const lawCount = selectedStateInventory.filter((item) => item.lawStatus === "Si").length;
  const noLawCount = selectedStateInventory.filter((item) => item.lawStatus === "No").length;
  const pendingLawCount = selectedStateInventory.filter((item) => item.lawStatus === "Por verificar").length;
  const publicCount = selectedStateInventory.filter((item) => item.regime === "Publica").length;
  const privateCount = selectedStateInventory.filter((item) => item.regime === "Privada").length;

  const distances = useMemo(
    () =>
      stateInstitutions
        .filter((item) => item.id !== active.id)
        .map((item) => ({ ...item, distance: distanceKm(active, item) }))
        .sort((a, b) => a.distance - b.distance),
    [active, stateInstitutions],
  );

  const route = useMemo(() => buildRoute(stateInstitutions), [stateInstitutions]);

  function selectMapState(stateName: string) {
    setSelectedState(stateName);
    if (stateName === "Sonora" || stateName === "CDMX") {
      setTerritory(stateName);
      const first = institutions
        .filter((item) => item.territory === stateName)
        .filter((item) => regime === "Todos" || item.regime === regime)
        .filter((item) => !lawOnly || item.lawStatus === "Si")
        .sort((a, b) => b.opportunity - a.opportunity)[0];
      if (first) setSelected(first.id);
    }
  }

  function selectTerritory(option: Territory | "Todos") {
    setTerritory(option);
    if (option === "Sonora" || option === "CDMX") {
      setSelectedState(option);
      const first = institutions
        .filter((item) => item.territory === option)
        .filter((item) => regime === "Todos" || item.regime === regime)
        .filter((item) => !lawOnly || item.lawStatus === "Si")
        .sort((a, b) => b.opportunity - a.opportunity)[0];
      if (first) setSelected(first.id);
    }
  }

  function exportCsv() {
    const rows = [
      ["universidad", "campus", "estado", "municipio", "regimen", "licenciatura_derecho", "modalidad", "horario", "lat", "lng", "indice"],
      ...comparable.map((item) => [
        item.name,
        item.campus,
        item.territory,
        item.municipality,
        item.regime,
        item.lawStatus,
        item.modality,
        item.schedule,
        String(item.lat),
        String(item.lng),
        String(item.opportunity),
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sniaj-${selectedState.toString().toLowerCase().replaceAll(" ", "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="shell">
      <section className="hero" aria-labelledby="titulo">
        <div>
          <p className="eyebrow">SNIAJ / inventario individual</p>
          <h1 id="titulo">Universidades una por una: conteo, Derecho, distancia y ruta.</h1>
          <p className="lede">
            Cada fila representa una universidad/campus individual. La pantalla distingue si imparte Licenciatura en
            Derecho, si es publica o privada, donde esta ubicada y como se conecta con una ruta academica.
          </p>
        </div>
        <aside className="access-panel" aria-label="Estado del inventario">
          <span className="status-dot" />
          <strong>Inventario piloto verificable</strong>
          <small>Los conteos son exactos para los registros cargados. El censo oficial requiere importar fuentes completas.</small>
        </aside>
      </section>

      <section className="toolbar" aria-label="Filtros del inventario">
        <div className="segmented" aria-label="Territorio">
          {(["Todos", "Sonora", "CDMX"] as const).map((option) => (
            <button key={option} className={territory === option ? "active" : ""} onClick={() => selectTerritory(option)}>
              {option}
            </button>
          ))}
        </div>
        <div className="segmented" aria-label="Regimen">
          {(["Todos", "Publica", "Privada"] as const).map((option) => (
            <button key={option} className={regime === option ? "active" : ""} onClick={() => setRegime(option)}>
              {option}
            </button>
          ))}
        </div>
        <label className="toggle">
          <input type="checkbox" checked={lawOnly} onChange={(event) => setLawOnly(event.target.checked)} />
          Solo con Derecho
        </label>
        <button className="export" onClick={exportCsv} aria-label="Exportar resultados filtrados en CSV">
          Exportar CSV
        </button>
      </section>

      <section className="metrics" aria-label="Conteos principales">
        <Metric label={`Total cargado en ${selectedState}`} value={selectedStateInventory.length.toString()} />
        <Metric label="Imparten Derecho" value={lawCount.toString()} />
        <Metric label="No / por verificar" value={`${noLawCount}/${pendingLawCount}`} />
        <Metric label="Publicas / privadas" value={`${publicCount}/${privateCount}`} />
      </section>

      <section className="workspace">
        <div className="panel mexico-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Mapa de Mexico</p>
              <h2>{selectedState}</h2>
            </div>
            <span>{selectedStateInventory.length ? `${selectedStateInventory.length} registros` : "pendiente de captura"}</span>
          </div>
          <div className="mexico-map" role="application" aria-label="Mapa de Mexico con estados clicables">
            <div className="mexico-shape" />
            {mexicoStates.map((state) => (
              <button
                key={state.code}
                className={`state-dot ${state.status} ${state.code.toLowerCase()} ${selectedState === state.name ? "selected" : ""}`}
                style={{ left: `${state.x}%`, top: `${state.y}%` }}
                onClick={() => selectMapState(state.name)}
                aria-label={`Seleccionar ${state.name}`}
                title={state.name}
              >
                {state.code}
              </button>
            ))}
          </div>
          <div className="legend">
            <span><i className="pilot" /> Entidad con inventario piloto</span>
            <span><i /> Entidad pendiente de carga oficial</span>
          </div>
        </div>

        <div className="panel ranking-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Listado individual</p>
              <h2>{stateInstitutions.length} universidades filtradas</h2>
            </div>
          </div>
          <div className="list">
            {stateInstitutions.length === 0 && (
              <div className="empty-state">
                Este estado aun no tiene universidades cargadas. El siguiente paso es importar SEP, ANUIES, DENUE, RENOES y captura manual verificada.
              </div>
            )}
            {stateInstitutions.map((item) => (
              <button key={item.id} className={`row ${active.id === item.id ? "selected" : ""}`} onClick={() => setSelected(item.id)}>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.campus} / {item.municipality} / {item.regime}</small>
                </span>
                <em className={`law-badge ${item.lawStatus === "Si" ? "yes" : item.lawStatus === "No" ? "no" : "pending"}`}>
                  Derecho: {item.lawStatus}
                </em>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="inventory-table panel" aria-label="Tabla de universidades">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Censo cargado</p>
            <h2>Universidades y Licenciatura en Derecho</h2>
          </div>
          <span>{stateInstitutions.length} filas</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Universidad</th>
                <th>Campus</th>
                <th>Municipio</th>
                <th>Regimen</th>
                <th>Derecho</th>
                <th>Ruta desde seleccion</th>
              </tr>
            </thead>
            <tbody>
              {stateInstitutions.map((item) => (
                <tr key={item.id} className={active.id === item.id ? "active-row" : ""} onClick={() => setSelected(item.id)}>
                  <td>{item.name}</td>
                  <td>{item.campus}</td>
                  <td>{item.municipality}</td>
                  <td>{item.regime}</td>
                  <td>{item.lawStatus}</td>
                  <td>{active.id === item.id ? "Seleccion" : `${Math.round(distanceKm(active, item))} km`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="route-grid">
        <article className="panel route-card">
          <p className="eyebrow">Ruta sugerida</p>
          <h2>{route.title}</h2>
          <div className="route-steps">
            {route.steps.map((step, index) => (
              <div key={`${step.id}-${index}`}>
                <span>{index + 1}</span>
                <strong>{step.acronym}</strong>
                <small>{step.municipality} / {step.regime} / Derecho: {step.lawStatus}</small>
              </div>
            ))}
          </div>
          <p className="route-note">{route.note}</p>
        </article>

        <article className="panel">
          <p className="eyebrow">Distancias desde seleccion</p>
          <h2>{active.acronym}</h2>
          <div className="distance-list">
            {distances.map((item) => (
              <button key={item.id} onClick={() => setSelected(item.id)}>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.campus} / {item.regime} / Derecho: {item.lawStatus}</small>
                </span>
                <b>{Math.round(item.distance)} km</b>
              </button>
            ))}
            {distances.length === 0 && <div className="empty-state">Selecciona Sonora o CDMX para ver distancias entre sedes.</div>}
          </div>
        </article>
      </section>

      <section className="detail-grid">
        <article className="panel profile">
          <p className="eyebrow">Ficha institucional</p>
          <h2>{active.name}</h2>
          <div className="tags">
            <span>{active.campus}</span>
            <span>{active.territory}</span>
            <span>{active.municipality}</span>
            <span>{active.regime}</span>
            <span>Derecho: {active.lawStatus}</span>
          </div>
          <dl className="facts">
            <div><dt>Modalidad</dt><dd>{active.modality}</dd></div>
            <div><dt>Horario</dt><dd>{active.schedule}</dd></div>
            <div><dt>Validez</dt><dd>{active.legalBasis}</dd></div>
            <div><dt>Fuente</dt><dd>{active.source}</dd></div>
          </dl>
        </article>

        <article className="panel">
          <p className="eyebrow">Metodo de puntuacion</p>
          <h2>Indice 0-100</h2>
          <div className="weights">
            {weights.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <meter min="0" max="25" value={value}>{value}</meter>
                <b>{value}</b>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Siguiente accion</p>
          <h2>{active.nextMove}</h2>
          <div className="themes">
            {active.themes.map((theme) => <span key={theme}>{theme}</span>)}
          </div>
          <label className="note-label" htmlFor="note">Nota privada local</label>
          <textarea
            id="note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ej. validar RVOE, llamar a coordinacion, revisar calendario..."
          />
        </article>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function distanceKm(a: Institution, b: Institution) {
  const radius = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const value =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * radius * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function buildRoute(items: Institution[]) {
  if (!items.length) {
    return {
      title: "Ruta pendiente de captura",
      note: "Selecciona Sonora o CDMX, o importa universidades de otro estado para calcular una ruta.",
      steps: [],
    };
  }
  const steps = [...items].sort((a, b) => {
    if (a.lawStatus !== b.lawStatus) return a.lawStatus === "Si" ? -1 : 1;
    return b.opportunity - a.opportunity;
  });
  const title =
    items[0].territory === "Sonora"
      ? "Ruta Sonora: sedes con Derecho confirmado primero"
      : "Ruta CDMX: circuito urbano por alcaldia y oportunidad";
  const note =
    items[0].territory === "Sonora"
      ? "La ruta privilegia sedes con Derecho confirmado y marca registros pendientes para verificacion previa."
      : "La ruta CDMX ordena sedes por cercania y oportunidad para adaptar invitaciones una por una.";
  return { title, note, steps };
}

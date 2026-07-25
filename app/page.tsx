"use client";

import { useEffect, useMemo, useState } from "react";
import appDataset from "../data/processed/app_universities_sonora_cdmx.json";

type Territory = "Sonora" | "CDMX";
type Regime = "Publica" | "Privada";
type LawStatus = "Si" | "No" | "Por verificar";
type Scope = Territory | "Todos";

type Institution = {
  id: string;
  name: string;
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
  coordinatePrecision?: string;
  programCount?: number;
  lawProgramCount?: number;
  samplePrograms?: string[];
  lawPrograms?: string[];
  reportedUnits: string[];
  unitCount: number;
  themes: string[];
  nextMove: string;
};

type MexicoState = {
  code: string;
  name: Territory;
  x: number;
  y: number;
  w: number;
  h: number;
  status: "datos" | "pendiente";
};

const mexicoStates: MexicoState[] = [
  { code: "SON", name: "Sonora", x: 16, y: 10, w: 20, h: 27, status: "datos" },
  { code: "CDMX", name: "CDMX", x: 54.5, y: 59, w: 9, h: 7.5, status: "datos" },
];

const institutions = appDataset.records as Institution[];
const sourceSummary = appDataset as {
  generatedAt: string;
  recordCount: number;
  sources: string[];
  notes: string[];
};

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
  const [territory, setTerritory] = useState<Scope>("Todos");
  const [regime, setRegime] = useState<Regime | "Todos">("Todos");
  const [lawOnly, setLawOnly] = useState(false);
  const [selectedState, setSelectedState] = useState<Scope>("Todos");
  const [selected, setSelected] = useState(institutions[0]?.id ?? "");
  const [note, setNote] = useState("");

  const selectedStateInventory = useMemo(
    () => institutions.filter((item) => selectedState === "Todos" || item.territory === selectedState),
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
        .filter((item) => selectedState === "Todos" || item.territory === selectedState)
        .filter((item) => regime === "Todos" || item.regime === regime)
        .filter((item) => !lawOnly || item.lawStatus === "Si")
        .sort((a, b) => b.opportunity - a.opportunity),
    [selectedState, regime, lawOnly],
  );

  const scopeInstitutions = territory === "Todos" ? visibleInstitutions : stateInstitutions;
  const scopeLabel = territory === "Todos" ? "Sonora + CDMX" : selectedState;

  useEffect(() => {
    if (scopeInstitutions.length > 0 && !scopeInstitutions.some((item) => item.id === selected)) {
      setSelected(scopeInstitutions[0].id);
    }
  }, [selected, scopeInstitutions]);

  const active = scopeInstitutions.find((item) => item.id === selected) ?? scopeInstitutions[0] ?? institutions[0];
  const comparable = scopeInstitutions;
  const lawCount = scopeInstitutions.filter((item) => item.lawStatus === "Si").length;
  const noLawCount = scopeInstitutions.filter((item) => item.lawStatus === "No").length;
  const pendingLawCount = scopeInstitutions.filter((item) => item.lawStatus === "Por verificar").length;
  const publicCount = scopeInstitutions.filter((item) => item.regime === "Publica").length;
  const privateCount = scopeInstitutions.filter((item) => item.regime === "Privada").length;

  const distances = useMemo(
    () =>
      scopeInstitutions
        .filter((item) => item.id !== active.id)
        .map((item) => ({ ...item, distance: distanceKm(active, item) }))
        .sort((a, b) => a.distance - b.distance),
    [active, scopeInstitutions],
  );

  const route = useMemo(() => buildRoute(scopeInstitutions), [scopeInstitutions]);

  function selectMapState(stateName: Territory) {
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

  function selectTerritory(option: Scope) {
    setTerritory(option);
    setSelectedState(option);
    const first = institutions
      .filter((item) => option === "Todos" || item.territory === option)
      .filter((item) => regime === "Todos" || item.regime === regime)
      .filter((item) => !lawOnly || item.lawStatus === "Si")
      .sort((a, b) => b.opportunity - a.opportunity)[0];
    if (first) setSelected(first.id);
  }

  function exportCsv() {
    const rows = [
      ["institucion", "unidades_reportadas", "estado", "municipio", "regimen", "licenciatura_derecho", "modalidad", "horario", "lat", "lng", "indice"],
      ...comparable.map((item) => [
        item.name,
        item.reportedUnits.join(" | "),
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
    link.download = `sniaj-${scopeLabel.toString().toLowerCase().replaceAll(" ", "-").replaceAll("+", "mas")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="shell">
      <section className="hero" aria-labelledby="titulo">
        <div>
          <p className="eyebrow">SNIAJ / padron oficial ampliado</p>
          <h1 id="titulo">Sonora y CDMX: instituciones una por una, Derecho, distancia y ruta.</h1>
          <p className="lede">
            Cada fila representa una institucion oficial unica derivada de ANUIES 2024-2025, RENOES, SIGED,
            SIRVOES/RVOE y directorios publicos. Campus, facultades, escuelas y departamentos se conservan dentro
            de su institucion sin contarlos como universidades independientes.
          </p>
        </div>
        <aside className="access-panel" aria-label="Estado del inventario">
          <span className="status-dot" />
          <strong>{sourceSummary.recordCount} instituciones oficiales cargadas</strong>
          <small>Generado el {sourceSummary.generatedAt}. Las distancias son aproximadas cuando la institucion no tiene coordenada exacta.</small>
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
        <Metric label={`Instituciones en ${scopeLabel}`} value={scopeInstitutions.length.toString()} />
        <Metric label="Imparten Derecho" value={lawCount.toString()} />
        <Metric label="No / por verificar" value={`${noLawCount}/${pendingLawCount}`} />
        <Metric label="Publicas / privadas" value={`${publicCount}/${privateCount}`} />
      </section>

      <section className="workspace">
        <div className="panel mexico-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Mapa de Mexico</p>
              <h2>{scopeLabel}</h2>
            </div>
            <span>{selectedStateInventory.length ? `${selectedStateInventory.length} instituciones` : "pendiente de carga"}</span>
          </div>
          <div className="mexico-map" role="application" aria-label="Mapa de Mexico con estados clicables">
            <img className="mexico-map-image" src="maps/mexico-states.png" alt="Mapa de Mexico con division estatal" />
            {mexicoStates.map((state) => (
              <button
                key={state.code}
                className={`map-hotspot ${state.status} ${selectedState === state.name ? "selected" : ""}`}
                style={{ left: `${state.x}%`, top: `${state.y}%`, width: `${state.w}%`, height: `${state.h}%` }}
                onClick={() => selectMapState(state.name)}
                aria-label={`Seleccionar ${state.name}`}
                title={state.name}
              >
                <span>{state.code}</span>
              </button>
            ))}
          </div>
          <div className="legend">
            <span><i className="pilot" /> Entidad con padron ampliado</span>
            <span><i /> Entidad pendiente de carga oficial</span>
            <span className="map-credit">Mapa base: Wikimedia Commons, CC BY-SA 4.0.</span>
          </div>
        </div>

        <div className="panel ranking-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Listado individual</p>
              <h2>{scopeInstitutions.length} instituciones filtradas</h2>
            </div>
          </div>
          <div className="list">
            {scopeInstitutions.length === 0 && (
              <div className="empty-state">
                Este estado aun no tiene instituciones cargadas. El siguiente paso es importar fuentes oficiales equivalentes y deduplicarlas.
              </div>
            )}
            {scopeInstitutions.map((item) => (
              <button key={item.id} className={`row ${active.id === item.id ? "selected" : ""}`} onClick={() => setSelected(item.id)}>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.unitCount} unidades reportadas / {item.municipality} / {item.regime}</small>
                </span>
                <em className={`law-badge ${item.lawStatus === "Si" ? "yes" : item.lawStatus === "No" ? "no" : "pending"}`}>
                  Derecho: {item.lawStatus}
                </em>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="inventory-table panel" aria-label="Tabla de instituciones">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Censo cargado</p>
            <h2>Instituciones y Licenciatura en Derecho</h2>
          </div>
          <span>{scopeInstitutions.length} filas</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Institucion</th>
                <th>Unidades reportadas</th>
                <th>Municipio</th>
                <th>Regimen</th>
                <th>Derecho</th>
                <th>Programas</th>
                <th>Ruta desde seleccion</th>
              </tr>
            </thead>
            <tbody>
              {scopeInstitutions.map((item) => (
                <tr key={item.id} className={active.id === item.id ? "active-row" : ""} onClick={() => setSelected(item.id)}>
                  <td>{item.name}</td>
                  <td>{item.unitCount}</td>
                  <td>{item.municipality}</td>
                  <td>{item.regime}</td>
                  <td>{item.lawStatus}</td>
                  <td>{item.programCount ?? 0}</td>
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
                <small>{step.unitCount} unidades / {step.regime} / Derecho: {step.lawStatus}</small>
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
                  <small>{item.unitCount} unidades / {item.regime} / Derecho: {item.lawStatus}</small>
                </span>
                <b>{Math.round(item.distance)} km</b>
              </button>
            ))}
            {distances.length === 0 && <div className="empty-state">Selecciona Sonora o CDMX para ver distancias entre instituciones.</div>}
          </div>
        </article>
      </section>

      <section className="detail-grid">
        <article className="panel profile">
          <p className="eyebrow">Ficha institucional</p>
          <h2>{active.name}</h2>
          <div className="tags">
            <span>{active.unitCount} unidades reportadas</span>
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
            <div><dt>Precision geografica</dt><dd>{active.coordinatePrecision === "municipio" ? "Municipio" : "Entidad"}</dd></div>
            <div><dt>Programas ANUIES</dt><dd>{active.programCount ?? 0}</dd></div>
          </dl>
          <div className="program-list">
            <strong>Escuelas, campus, facultades o departamentos reportados</strong>
            {active.reportedUnits.map((unit) => (
              <span key={unit}>{unit}</span>
            ))}
          </div>
          <div className="program-list">
            <strong>Programas de Derecho detectados</strong>
            {(active.lawPrograms?.length ? active.lawPrograms : ["Sin Licenciatura en Derecho detectada"]).map((program) => (
              <span key={program}>{program}</span>
            ))}
          </div>
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
          <div className="source-list">
            {sourceSummary.sources.map((source) => <span key={source}>{source}</span>)}
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
      note: "Selecciona Sonora o CDMX, o importa instituciones de otro estado para calcular una ruta.",
      steps: [],
    };
  }
  const steps = [...items].sort((a, b) => {
    if (a.lawStatus !== b.lawStatus) return a.lawStatus === "Si" ? -1 : 1;
    return b.opportunity - a.opportunity;
  });
  const territories = new Set(items.map((item) => item.territory));
  if (territories.size > 1) {
    return {
      title: "Ruta Sonora + CDMX: instituciones con Derecho primero",
      note: "La ruta combinada prioriza instituciones con Derecho confirmado y conserva el orden por oportunidad para revisar ambos estados.",
      steps,
    };
  }
  const title =
    items[0].territory === "Sonora"
      ? "Ruta Sonora: instituciones con Derecho confirmado primero"
      : "Ruta CDMX: instituciones por oportunidad";
  const note =
    items[0].territory === "Sonora"
      ? "La ruta privilegia instituciones con Derecho confirmado y marca registros pendientes para verificacion previa."
      : "La ruta CDMX ordena instituciones por cercania estimada y oportunidad.";
  return { title, note, steps };
}

import { useState, useMemo } from "react";
import {
  BarChart as BarChartIcon, Building2, Users, CalendarDays, Microscope,
  TrendingUp, Briefcase, ClipboardList, Home, ScrollText, Shield, House,
  Globe, Clock, Trophy, Footprints, Sparkles, Flame, BarChart3,
  UserCheck, Filter, X, ChevronDown, ChevronRight, Calendar,
  ArrowRight, Repeat, AlertTriangle, Activity,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import { COLORS, PIE_COLORS } from "../../theme";
import { useVisites } from "../../hooks/useVisites";
import {
  MONTHLY, DAILY, HOURLY, SERVICES, STATUTS, DOW_AVG, HEATMAP_DATA,
  SERVICES_STATUT, RDV_PAR_SERVICE, NOUVEAUX_PAR_STATUT,
  TAUX_NOUVEAUX_MENSUEL, ASILE_MENSUEL,
} from "../../data/static-data";

/* ═══════════════════════════════════════════════════════════
   DONNÉES SIMULÉES — Pour les sections qui nécessitent Supabase
   (conseillers, sous-services, parcours clients)
   Remplacées par données live quand Supabase est branché
   ═══════════════════════════════════════════════════════════ */
const CONSEILLERS_DATA = [
  { nom: "Ran", visites: 2840, service: "Accueil", nouveaux: 820, existants: 2020, rdv: 1120 },
  { nom: "Iryna", visites: 2310, service: "Accueil", nouveaux: 690, existants: 1620, rdv: 940 },
  { nom: "Sadia", visites: 1950, service: "Accueil", nouveaux: 510, existants: 1440, rdv: 780 },
  { nom: "Dian", visites: 1680, service: "Accueil", nouveaux: 480, existants: 1200, rdv: 670 },
  { nom: "Merzouk", visites: 1420, service: "Accueil", nouveaux: 390, existants: 1030, rdv: 570 },
  { nom: "Farah", visites: 1210, service: "Emploi", nouveaux: 280, existants: 930, rdv: 580 },
  { nom: "Safaa", visites: 980, service: "Accueil", nouveaux: 240, existants: 740, rdv: 390 },
  { nom: "Taous", visites: 870, service: "Accueil", nouveaux: 190, existants: 680, rdv: 350 },
  { nom: "Hakima", visites: 760, service: "Francisation", nouveaux: 160, existants: 600, rdv: 300 },
  { nom: "Faten", visites: 2425, service: "Assermentation", nouveaux: 580, existants: 1845, rdv: 15 },
];

const CONSEILLERS_MONTHLY = [
  { mois: "Mai", Ran: 310, Iryna: 250, Sadia: 210, Dian: 180, Faten: 260, Farah: 130 },
  { mois: "Juin", Ran: 320, Iryna: 260, Sadia: 220, Dian: 190, Faten: 270, Farah: 135 },
  { mois: "Juil", Ran: 330, Iryna: 270, Sadia: 225, Dian: 195, Faten: 280, Farah: 140 },
  { mois: "Août", Ran: 280, Iryna: 230, Sadia: 190, Dian: 165, Faten: 240, Farah: 120 },
  { mois: "Sep", Ran: 275, Iryna: 225, Sadia: 185, Dian: 160, Faten: 235, Farah: 115 },
  { mois: "Oct", Ran: 270, Iryna: 220, Sadia: 180, Dian: 155, Faten: 230, Farah: 110 },
  { mois: "Nov", Ran: 220, Iryna: 180, Sadia: 150, Dian: 130, Faten: 190, Farah: 90 },
  { mois: "Déc", Ran: 190, Iryna: 155, Sadia: 130, Dian: 110, Faten: 165, Farah: 80 },
  { mois: "Jan", Ran: 340, Iryna: 280, Sadia: 230, Dian: 200, Faten: 290, Farah: 145 },
  { mois: "Fév", Ran: 305, Iryna: 240, Sadia: 230, Dian: 195, Faten: 265, Farah: 145 },
];

const SOUS_SERVICES_ACCUEIL = [
  { nom: "Renouvellement permis travail (DA)", visites: 1580, pct: 14.9 },
  { nom: "Demande résidence permanente", visites: 1240, pct: 11.7 },
  { nom: "Carte assurance maladie (RAMQ)", visites: 1120, pct: 10.6 },
  { nom: "Recherche de logement", visites: 980, pct: 9.3 },
  { nom: "Premières démarches d'installation", visites: 890, pct: 8.4 },
  { nom: "Numéro assurance sociale (NAS)", visites: 780, pct: 7.4 },
  { nom: "Renouvellement documents officiels", visites: 720, pct: 6.8 },
  { nom: "Finances personnelles / allocations", visites: 650, pct: 6.2 },
  { nom: "Soutien social et matériel", visites: 540, pct: 5.1 },
  { nom: "Demande CSQ", visites: 420, pct: 4.0 },
  { nom: "Inscription scolaire", visites: 380, pct: 3.6 },
  { nom: "Autres sous-services", visites: 1270, pct: 12.0 },
];

const SOUS_SERVICES_EMPLOI = [
  { nom: "Reconnaissance diplômes et compétences", visites: 520, pct: 26.7 },
  { nom: "Production CV format québécois", visites: 410, pct: 21.0 },
  { nom: "Ateliers recherche d'emploi", visites: 340, pct: 17.4 },
  { nom: "Préparation aux entrevues", visites: 290, pct: 14.9 },
  { nom: "Placement en emploi et stages", visites: 210, pct: 10.8 },
  { nom: "Soutien personnalisé", visites: 110, pct: 5.6 },
  { nom: "Réseautage professionnel", visites: 70, pct: 3.6 },
];

const SOUS_SERVICES_ASSERMENTATION = [
  { nom: "Copies conformes", visites: 1210, pct: 49.9 },
  { nom: "Déclaration solennelle", visites: 480, pct: 19.8 },
  { nom: "Autorisation de voyage", visites: 310, pct: 12.8 },
  { nom: "Lettre d'invitation", visites: 210, pct: 8.7 },
  { nom: "Procuration", visites: 130, pct: 5.4 },
  { nom: "Déclaration de célibat", visites: 85, pct: 3.5 },
];

const RDV_MENSUEL = MONTHLY.map(m => ({
  mois: m.mois,
  avecRdv: m.rdv,
  sansRdv: m.sans_rdv,
  tauxRdv: m.total > 0 ? Math.round(m.rdv / m.total * 100) : 0,
}));

/* ═══════════════════════════════════════════════════════════
   COMPOSANTS RÉUTILISABLES
   ═══════════════════════════════════════════════════════════ */

function KpiCard({ label, value, sub, icon, color = COLORS.accent }) {
  return (
    <div
      style={{
        background: COLORS.card, borderRadius: 16, padding: "20px 24px",
        border: `1px solid ${COLORS.border}`, position: "relative", overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 1px 6px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.6), 0 4px 12px ${color}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4), 0 1px 6px rgba(0,0,0,0.3)";
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500, letterSpacing: "0.02em", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ display: "flex", alignItems: "center" }}>{icon}</span> {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: COLORS.text, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
        {typeof value === "number" ? value.toLocaleString("fr-CA") : value}
      </div>
      {sub && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Section({ title, subtitle, children, style = {} }) {
  return (
    <div style={{ background: COLORS.card, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 1px 6px rgba(0,0,0,0.3)", ...style }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 12, color: COLORS.textMuted, margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label, suffix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e2555", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px", boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)" }}>
      <p style={{ margin: 0, fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0, fontSize: 14, fontWeight: 600, color: p.color || COLORS.text }}>
          {p.name}: {p.value?.toLocaleString("fr-CA")}{suffix}
        </p>
      ))}
    </div>
  );
}

function HorizontalBar({ data, maxValue }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((item, i) => {
        const pct = (item.value / maxValue) * 100;
        return (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
              <span style={{ color: COLORS.text, fontWeight: 500 }}>{item.name}</span>
              <span style={{ color: COLORS.textMuted }}>{item.value.toLocaleString("fr-CA")} ({item.pct})</span>
            </div>
            <div style={{ height: 8, background: COLORS.border, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 4, width: `${pct}%`, background: `linear-gradient(90deg, ${PIE_COLORS[i]}, ${PIE_COLORS[i]}aa)`, transition: "width 1s ease-out" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.04) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>{(percent * 100).toFixed(0)}%</text>;
};

/* ═══════════════════════════════════════════════════════════
   FILTRES GLOBAUX
   ═══════════════════════════════════════════════════════════ */
function FilterBar({ filters, setFilters, services, statuts, conseillers, daily }) {
  const [open, setOpen] = useState(false);
  const hasFilters = filters.dateStart || filters.dateEnd || filters.services.length > 0 || filters.statuts.length > 0 || filters.conseiller;
  const minDate = daily[0]?.date || "2025-05-01";
  const maxDate = daily[daily.length - 1]?.date || "2026-02-19";

  const clear = () => setFilters({ dateStart: "", dateEnd: "", services: [], statuts: [], conseiller: "" });

  const toggleArray = (arr, val) => arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

  const inputStyle = {
    padding: "6px 10px", borderRadius: 8, border: `1px solid ${COLORS.border}`,
    background: COLORS.bg, color: COLORS.text, fontSize: 12, fontFamily: "'DM Sans', sans-serif", outline: "none",
  };

  const chipStyle = (active) => ({
    padding: "4px 10px", borderRadius: 6, border: `1px solid ${active ? COLORS.accent : COLORS.border}`,
    background: active ? `${COLORS.accent}22` : "transparent", color: active ? COLORS.accent : COLORS.textMuted,
    fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: active ? 600 : 400, transition: "all 0.15s",
  });

  return (
    <div style={{ marginBottom: 16 }}>
      <button onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: `1px solid ${hasFilters ? COLORS.accent : COLORS.border}`, background: hasFilters ? `${COLORS.accent}15` : COLORS.card, color: hasFilters ? COLORS.accent : COLORS.textMuted, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
        <Filter size={14} /> Filtres {hasFilters && <span style={{ background: COLORS.accent, color: "#263164", borderRadius: 99, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>actif</span>}
        <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "", transition: "transform 0.2s" }} />
      </button>

      {open && (
        <div style={{ marginTop: 10, background: COLORS.card, borderRadius: 14, padding: 20, border: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Période */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>Période</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="date" value={filters.dateStart} min={minDate} max={maxDate} onChange={(e) => setFilters({ ...filters, dateStart: e.target.value })} style={inputStyle} />
              <span style={{ color: COLORS.textMuted, fontSize: 12 }}>→</span>
              <input type="date" value={filters.dateEnd} min={minDate} max={maxDate} onChange={(e) => setFilters({ ...filters, dateEnd: e.target.value })} style={inputStyle} />
            </div>
          </div>
          {/* Services */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>Services</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {services.map(s => (
                <button key={s.name} onClick={() => setFilters({ ...filters, services: toggleArray(filters.services, s.name) })} style={chipStyle(filters.services.includes(s.name))}>{s.name}</button>
              ))}
            </div>
          </div>
          {/* Statuts */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>Statut immigration</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {statuts.map(s => (
                <button key={s.name} onClick={() => setFilters({ ...filters, statuts: toggleArray(filters.statuts, s.name) })} style={chipStyle(filters.statuts.includes(s.name))}>{s.name}</button>
              ))}
            </div>
          </div>
          {/* Conseiller */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>Conseiller</label>
            <select value={filters.conseiller} onChange={(e) => setFilters({ ...filters, conseiller: e.target.value })} style={{ ...inputStyle, width: "auto" }}>
              <option value="">Tous</option>
              {conseillers.map(c => <option key={c.nom} value={c.nom}>{c.nom}</option>)}
            </select>
          </div>
          {hasFilters && (
            <button onClick={clear} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, border: "none", background: `${COLORS.vermillon}22`, color: COLORS.vermillon, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
              <X size={12} /> Réinitialiser les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMPOSANTS ANALYSES
   ═══════════════════════════════════════════════════════════ */

function Heatmap({ data }) {
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven"];
  const allValues = data.flatMap((row) => days.map((d) => row[d]));
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const getColor = (val) => {
    const ratio = (val - minVal) / (maxVal - minVal);
    const stops = [[38,49,114],[108,186,199],[255,191,63],[255,92,57]];
    const pos = ratio * (stops.length - 1);
    const i = Math.min(Math.floor(pos), stops.length - 2);
    const t = pos - i;
    return `rgb(${Math.round(stops[i][0]+(stops[i+1][0]-stops[i][0])*t)}, ${Math.round(stops[i][1]+(stops[i+1][1]-stops[i][1])*t)}, ${Math.round(stops[i][2]+(stops[i+1][2]-stops[i][2])*t)})`;
  };
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "50px repeat(5, 1fr)", gap: 3, minWidth: 320 }}>
        <div />
        {days.map(d => <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: COLORS.textMuted, padding: "6px 0" }}>{d}</div>)}
        {data.map(row => (
          <div key={row.hour} style={{ display: "contents" }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.textMuted, display: "flex", alignItems: "center", justifyContent: "center" }}>{row.hour}</div>
            {days.map(d => (
              <div key={row.hour+d} style={{ background: getColor(row[d]), borderRadius: 6, padding: "10px 4px", textAlign: "center", fontSize: 13, fontWeight: 600, color: COLORS.text, transition: "transform 0.15s", cursor: "default" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>{row[d]}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 12, fontSize: 11, color: COLORS.textMuted }}>
        <span>Faible</span><div style={{ width: 120, height: 12, borderRadius: 3, background: "linear-gradient(90deg, #263164, #6CBAC7, #FFBF3F, #FF5C39)" }} /><span>Fort</span>
      </div>
    </div>
  );
}

function ServicesStatutChart({ data }) {
  const STATUT_COLORS = { "Demandeur d'asile": "#6CBAC7", "Résident permanent": "#FFBF3F", "Dem. d'asile acc.": "#FF5C39", "Citoyens canadiens": "#CCE8E5", "Permis de travail": "#8dcdd6", "Permis d'étude": "#e6a020" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {data.map((svc, si) => (
        <div key={si}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>{svc.service}</div>
          <div style={{ display: "flex", height: 28, borderRadius: 6, overflow: "hidden", marginBottom: 6 }}>
            {svc.segments.map((seg, i) => (
              <div key={i} title={`${seg.statut}: ${seg.pct}%`} style={{ width: `${seg.pct}%`, background: STATUT_COLORS[seg.statut] || PIE_COLORS[i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "#263164" }}>
                {seg.pct >= 10 ? `${seg.pct}%` : ""}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {svc.segments.map((seg, i) => (
              <span key={i} style={{ fontSize: 10, color: COLORS.textMuted, display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: STATUT_COLORS[seg.statut] || PIE_COLORS[i], display: "inline-block" }} />{seg.statut} ({seg.pct}%)
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RdvParServiceChart({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((item, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
            <span style={{ color: COLORS.text, fontWeight: 500 }}>{item.name}</span>
            <span style={{ color: COLORS.textMuted }}>{item.avecRdv}% <span style={{ fontSize: 11 }}>({item.detail})</span></span>
          </div>
          <div style={{ height: 8, background: COLORS.border, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 4, width: `${item.avecRdv}%`, background: item.avecRdv > 40 ? COLORS.accent : item.avecRdv > 15 ? COLORS.gold : COLORS.vermillon, transition: "width 1s ease-out" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function NouveauxParStatutChart({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((item, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
            <span style={{ color: COLORS.text, fontWeight: 500 }}>{item.name}</span>
            <span style={{ color: COLORS.textMuted }}>{item.taux}% <span style={{ fontSize: 11 }}>({item.detail})</span></span>
          </div>
          <div style={{ height: 8, background: COLORS.border, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 4, width: `${item.taux}%`, background: item.taux > 50 ? COLORS.vermillon : item.taux > 25 ? COLORS.gold : COLORS.accent, transition: "width 1s ease-out" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SOUS-SERVICES DRILL-DOWN
   ═══════════════════════════════════════════════════════════ */
function SousServicesDrilldown({ data, maxValue }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((item, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: 12 }}>
            <span style={{ color: COLORS.text, fontWeight: 500 }}>{item.nom}</span>
            <span style={{ color: COLORS.textMuted }}>{item.visites.toLocaleString("fr-CA")} ({item.pct}%)</span>
          </div>
          <div style={{ height: 6, background: COLORS.border, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 3, width: `${(item.visites / maxValue) * 100}%`, background: PIE_COLORS[i % PIE_COLORS.length], transition: "width 1s ease-out" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD PRINCIPAL
   ═══════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { data: liveData, loading, isLive } = useVisites();
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState({ dateStart: "", dateEnd: "", services: [], statuts: [], conseiller: "" });
  const [expandedService, setExpandedService] = useState(null);
  const [selectedConseiller, setSelectedConseiller] = useState(null);

  const monthly = liveData?.MONTHLY || MONTHLY;
  const daily = liveData?.DAILY || DAILY;
  const hourly = liveData?.HOURLY || HOURLY;
  const services = liveData?.SERVICES || SERVICES;
  const statuts = liveData?.STATUTS || STATUTS;
  const dowAvg = liveData?.DOW_AVG || DOW_AVG;
  const heatmapData = liveData?.HEATMAP_DATA || HEATMAP_DATA;
  const servicesStatut = liveData?.SERVICES_STATUT || SERVICES_STATUT;
  const rdvParService = liveData?.RDV_PAR_SERVICE || RDV_PAR_SERVICE;
  const nouveauxParStatut = liveData?.NOUVEAUX_PAR_STATUT || NOUVEAUX_PAR_STATUT;
  const tauxNouveauxMensuel = liveData?.TAUX_NOUVEAUX_MENSUEL || TAUX_NOUVEAUX_MENSUEL;
  const asileMensuel = liveData?.ASILE_MENSUEL || ASILE_MENSUEL;
  const conseillersData = liveData?.conseillers?.length > 0 ? liveData.conseillers : CONSEILLERS_DATA;

  // Filtrage des données quotidiennes
  const filteredDaily = useMemo(() => {
    let d = daily;
    if (filters.dateStart) d = d.filter(x => x.date >= filters.dateStart);
    if (filters.dateEnd) d = d.filter(x => x.date <= filters.dateEnd);
    return d;
  }, [daily, filters.dateStart, filters.dateEnd]);

  // Calculs dérivés
  const totalVisites = monthly.reduce((s, m) => s + m.total, 0);
  const totalRdv = monthly.reduce((s, m) => s + m.rdv, 0);
  const totalSansRdv = monthly.reduce((s, m) => s + m.sans_rdv, 0);
  const totalNouveaux = monthly.reduce((s, m) => s + m.nouveau, 0);
  const totalExistants = monthly.reduce((s, m) => s + m.existant, 0);
  const totalJours = filteredDaily.filter(d => d.count > 5).length;
  const filteredTotal = filteredDaily.reduce((s, d) => s + d.count, 0);
  const moyJour = totalJours > 0 ? (filteredTotal / totalJours).toFixed(1).replace('.', ',') : "—";
  const pctSansRdv = totalVisites > 0 ? ((totalSansRdv / totalVisites) * 100).toFixed(1).replace('.', ',') : "—";
  const totalNvEx = totalNouveaux + totalExistants;
  const pctNouveaux = totalNvEx > 0 ? ((totalNouveaux / totalNvEx) * 100).toFixed(1).replace('.', ',') : "—";

  const firstDate = filteredDaily.length > 0 ? filteredDaily[0].date : "2025-05-01";
  const lastDate = filteredDaily.length > 0 ? filteredDaily[filteredDaily.length - 1].date : "2026-02-19";
  const formatDateShort = (d) => {
    const [y, m, dd] = d.split('-');
    const months = { '01': 'jan.', '02': 'fév.', '03': 'mar.', '04': 'avr.', '05': 'mai', '06': 'juin', '07': 'juil.', '08': 'août', '09': 'sep.', '10': 'oct.', '11': 'nov.', '12': 'déc.' };
    return `${parseInt(dd)} ${months[m]} ${y}`;
  };
  const periodeLabel = `${formatDateShort(firstDate)} → ${formatDateShort(lastDate)}`;
  const record = filteredDaily.reduce((max, d) => d.count > max.count ? d : max, filteredDaily[0] || { date: '', count: 0 });
  const moisFort = monthly.reduce((max, m) => m.total > max.total ? m : max, monthly[0] || { mois: '', total: 0 });

  // Dernier mois pour RDV
  const dernierMois = monthly[monthly.length - 1] || { mois: "—", rdv: 0, sans_rdv: 0, total: 0 };

  const dailyFormatted = useMemo(() => filteredDaily.filter(d => d.count > 5).map(d => ({ ...d, label: d.date.slice(5) })), [filteredDaily]);
  const dailyWithMA = useMemo(() => {
    return dailyFormatted.map((d, i) => {
      const w = dailyFormatted.slice(Math.max(0, i - 6), i + 1);
      return { ...d, ma: Math.round(w.reduce((s, x) => s + x.count, 0) / w.length) };
    });
  }, [dailyFormatted]);

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: <BarChartIcon size={16} /> },
    { id: "services", label: "Services", icon: <Building2 size={16} /> },
    { id: "clients", label: "Clientèle", icon: <Users size={16} /> },
    { id: "temps", label: "Temporel", icon: <CalendarDays size={16} /> },
    { id: "analyses", label: "Analyses", icon: <Microscope size={16} /> },
    { id: "equipe", label: "Équipe", icon: <UserCheck size={16} /> },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: COLORS.textMuted, fontSize: 16, fontFamily: "'DM Sans', sans-serif" }}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Text&display=swap" rel="stylesheet" />

      {/* ───── Header ───── */}
      <header style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.border}`, background: "linear-gradient(180deg, #2d3a72 0%, #263164 100%)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)", boxShadow: "0 6px 30px rgba(0,0,0,0.5)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src="/CARI_Horizontal_RGB_reverse.png" alt="CARI Saint-Laurent" className="cari-logo" />
              <p style={{ fontSize: 13, color: COLORS.textMuted, margin: 0 }}>Dashboard Accueil Clientèle</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: 4, background: "#1e2555", borderRadius: 12, border: `1px solid ${COLORS.border}` }} className="tab-bar">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="tab-btn"
                  style={{ padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit", background: activeTab === tab.id ? COLORS.accent : "transparent", color: activeTab === tab.id ? "#263164" : COLORS.textMuted, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "flex", alignItems: "center" }}>{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: COLORS.textMuted }}>
            <span style={{ background: isLive ? "rgba(108,186,199,0.2)" : "rgba(255,191,63,0.2)", color: isLive ? COLORS.accent : COLORS.gold, padding: "2px 8px", borderRadius: 99, fontWeight: 600, fontSize: 11 }}>
              {isLive ? "EN DIRECT" : "HISTORIQUE"}
            </span>
            Période: {periodeLabel} · {totalJours} jours · {totalVisites.toLocaleString("fr-CA")} visites
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 16px" }}>
        {/* ───── Filtres globaux ───── */}
        <FilterBar filters={filters} setFilters={setFilters} services={services} statuts={statuts} conseillers={conseillersData} daily={daily} />

        {/* ═══════ OVERVIEW TAB ═══════ */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              <KpiCard label="Total visites" value={totalVisites} sub={`Depuis ${formatDateShort(firstDate)}`} icon={<TrendingUp size={18} />} color={COLORS.accent} />
              <KpiCard label="Moyenne / jour" value={moyJour} sub={`Sur ${totalJours} jours ouvrables`} icon={<BarChart3 size={18} />} color={COLORS.gold} />
              <KpiCard label="Sans rendez-vous" value={`${pctSansRdv} %`} sub={`${totalSansRdv.toLocaleString("fr-CA")} visites sans RDV`} icon={<Footprints size={18} />} color={COLORS.vermillon} />
              <KpiCard label="Nouveaux clients" value={`${pctNouveaux} %`} sub={`${totalNouveaux.toLocaleString("fr-CA")} nouveaux sur ${totalNvEx.toLocaleString("fr-CA")}`} icon={<Sparkles size={18} />} color={COLORS.brume} />
            </div>

            <Section title="Fréquentation quotidienne" subtitle="Volume de visites par jour avec moyenne mobile 7 jours">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyWithMA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs><linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.3} /><stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: COLORS.textMuted }} interval={19} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" name="Visites" stroke={`${COLORS.accent}40`} fill="url(#colorCount)" />
                  <Line type="monotone" dataKey="ma" name="Moy. 7 jours" stroke={COLORS.accent} strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </Section>

            <div className="dash-grid-2col">
              <Section title="Volume mensuel" subtitle="Avec et sans rendez-vous par mois">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthly} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="mois" tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                    <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="rdv" name="Avec RDV" fill={COLORS.accent} radius={[4,4,0,0]} stackId="a" />
                    <Bar dataKey="sans_rdv" name="Sans RDV" fill={`${COLORS.accent}55`} radius={[4,4,0,0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </Section>
              <Section title="Répartition par service" subtitle={`Top ${services.length} services demandés`}>
                <HorizontalBar data={services} maxValue={services[0]?.value || 1} />
              </Section>
            </div>

            {/* ───── Section RDV ───── */}
            <div className="dash-grid-2col">
              <Section title="Rendez-vous — Ce mois" subtitle={`${dernierMois.mois}: ${dernierMois.rdv} avec RDV vs ${dernierMois.sans_rdv} sans RDV`}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div style={{ background: COLORS.bg, borderRadius: 12, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.accent }}>{dernierMois.rdv}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted }}>Avec RDV</div>
                  </div>
                  <div style={{ background: COLORS.bg, borderRadius: 12, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.gold }}>{dernierMois.sans_rdv}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted }}>Sans RDV</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={[{ name: "Avec RDV", value: totalRdv }, { name: "Sans RDV", value: totalSansRdv }]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={renderLabel}>
                      <Cell fill={COLORS.accent} /><Cell fill={COLORS.gold} />
                    </Pie>
                    <Tooltip formatter={v => v.toLocaleString("fr-CA")} />
                  </PieChart>
                </ResponsiveContainer>
              </Section>
              <Section title="Taux de RDV par service" subtitle="Évolution mensuelle du taux de rendez-vous">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={RDV_MENSUEL} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="mois" tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                    <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                    <Tooltip content={<CustomTooltip suffix="%" />} />
                    <Line type="monotone" dataKey="tauxRdv" name="% Avec RDV" stroke={COLORS.accent} strokeWidth={2.5} dot={{ fill: COLORS.accent, strokeWidth: 0, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Section>
            </div>
          </div>
        )}

        {/* ═══════ SERVICES TAB ═══════ */}
        {activeTab === "services" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              <KpiCard label="Accueil & intégration" value={services[0]?.value || 0} sub={`${services[0]?.pct || '—'} du total`} icon={<Home size={18} />} color={COLORS.accent} />
              <KpiCard label="Assermentation" value={services[1]?.value || 0} sub={`${services[1]?.pct || '—'} du total`} icon={<ScrollText size={18} />} color={COLORS.gold} />
              <KpiCard label="Emploi" value={services[2]?.value || 0} sub={`${services[2]?.pct || '—'} du total`} icon={<Briefcase size={18} />} color={COLORS.vermillon} />
              <KpiCard label="Autres services" value={services.slice(3).reduce((s, x) => s + x.value, 0)} sub={`${(services.slice(3).reduce((s, x) => s + x.value, 0) / totalVisites * 100).toFixed(1)}% du total`} icon={<ClipboardList size={18} />} color={COLORS.brume} />
            </div>
            <div className="dash-grid-2col">
              <Section title="Services demandés" subtitle={`Distribution complète des ${totalVisites.toLocaleString("fr-CA")} demandes`}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={services} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={2} dataKey="value" labelLine={false} label={renderLabel}>
                      {services.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={v => v.toLocaleString("fr-CA")} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8 }}>
                  {services.map((s, i) => (
                    <span key={i} style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4, color: COLORS.textMuted }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i], display: "inline-block" }} />{s.name}
                    </span>
                  ))}
                </div>
              </Section>

              {/* ───── Drill-down sous-services ───── */}
              <Section title="Détail par sous-service" subtitle="Cliquez sur un service pour voir le détail">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { name: "Accueil et intégration", data: SOUS_SERVICES_ACCUEIL, color: PIE_COLORS[0] },
                    { name: "Assermentation", data: SOUS_SERVICES_ASSERMENTATION, color: PIE_COLORS[1] },
                    { name: "Emploi", data: SOUS_SERVICES_EMPLOI, color: PIE_COLORS[2] },
                  ].map(svc => (
                    <div key={svc.name}>
                      <button onClick={() => setExpandedService(expandedService === svc.name ? null : svc.name)}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: expandedService === svc.name ? `${svc.color}15` : COLORS.bg, borderRadius: 10, border: `1px solid ${expandedService === svc.name ? svc.color : "transparent"}`, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                        <div style={{ width: 4, height: 30, borderRadius: 2, background: svc.color }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{svc.name}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>{svc.data.length} sous-services</div>
                        </div>
                        {expandedService === svc.name ? <ChevronDown size={16} color={COLORS.textMuted} /> : <ChevronRight size={16} color={COLORS.textMuted} />}
                      </button>
                      {expandedService === svc.name && (
                        <div style={{ padding: "12px 14px 4px", marginTop: 4 }}>
                          <SousServicesDrilldown data={svc.data} maxValue={svc.data[0]?.visites || 1} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </div>
        )}

        {/* ═══════ CLIENTÈLE TAB ═══════ */}
        {activeTab === "clients" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              {(() => {
                const da = statuts.find(s => s.name.includes("asile") && !s.name.includes("acc"));
                const daAcc = statuts.find(s => s.name.includes("acc"));
                const rp = statuts.find(s => s.name.includes("sident"));
                const pt = statuts.find(s => s.name.includes("travail") && !s.name.includes("fermé"));
                const ptf = statuts.find(s => s.name.includes("fermé"));
                const totalS = statuts.reduce((s, x) => s + x.value, 0);
                const daT = (da?.value||0) + (daAcc?.value||0);
                const ptT = (pt?.value||0) + (ptf?.value||0);
                return <>
                  <KpiCard label="Demandeurs d'asile" value={daT} sub={`${(daT/totalS*100).toFixed(1)} % (asile + acc.)`} icon={<Shield size={18} />} color={COLORS.accent} />
                  <KpiCard label="Résidents permanents" value={rp?.value||0} sub={`${((rp?.value||0)/totalS*100).toFixed(1)} % de la clientèle`} icon={<House size={18} />} color={COLORS.gold} />
                  <KpiCard label="Permis de travail" value={ptT} sub={`${(ptT/totalS*100).toFixed(1)} % (ouvert + fermé)`} icon={<Briefcase size={18} />} color={COLORS.vermillon} />
                  <KpiCard label="Autres statuts" value={totalS - daT - (rp?.value||0) - ptT} sub="Citoyens, étudiants, visiteurs" icon={<Globe size={18} />} color={COLORS.brume} />
                </>;
              })()}
            </div>
            <div className="dash-grid-2col">
              <Section title="Statut d'immigration" subtitle="Profil de la clientèle par statut">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={statuts} cx="50%" cy="50%" innerRadius={55} outerRadius={115} paddingAngle={2} dataKey="value" labelLine={false} label={renderLabel}>
                      {statuts.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={v => v.toLocaleString("fr-CA")} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8 }}>
                  {statuts.map((s, i) => (
                    <span key={i} style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4, color: COLORS.textMuted }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i], display: "inline-block" }} />{s.name}
                    </span>
                  ))}
                </div>
              </Section>
              <Section title="Détail par statut" subtitle="Volume et proportion pour chaque catégorie">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {statuts.map((s, i) => {
                    const totalS = statuts.reduce((sum, x) => sum + x.value, 0);
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: COLORS.bg, borderRadius: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: PIE_COLORS[i], flexShrink: 0 }} />
                        <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: COLORS.text }}>{s.name}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, minWidth: 60, textAlign: "right" }}>{s.value.toLocaleString("fr-CA")}</div>
                        <div style={{ fontSize: 12, color: COLORS.textMuted, minWidth: 48, textAlign: "right" }}>{((s.value/totalS)*100).toFixed(1)}%</div>
                      </div>
                    );
                  })}
                </div>
              </Section>
            </div>
            <Section title="Nouveaux vs clients existants" subtitle="Répartition mensuelle entre nouvelles et anciennes clientèles">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthly} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="mois" tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="nouveau" name="Nouveaux" fill={COLORS.vermillon} radius={[4,4,0,0]} stackId="b" />
                  <Bar dataKey="existant" name="Existants" fill={`${COLORS.accent}55`} radius={[4,4,0,0]} stackId="b" />
                </BarChart>
              </ResponsiveContainer>
            </Section>
          </div>
        )}

        {/* ═══════ TEMPOREL TAB ═══════ */}
        {activeTab === "temps" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              <KpiCard label="Jour le plus achalandé" value={dowAvg.reduce((m,d)=>d.avg>m.avg?d:m,dowAvg[0]).day} sub={`${dowAvg.reduce((m,d)=>d.avg>m.avg?d:m,dowAvg[0]).avg} visites en moyenne`} icon={<CalendarDays size={18} />} color={COLORS.accent} />
              <KpiCard label="Heure de pointe" value={hourly.reduce((m,h)=>h.count>m.count?h:m,hourly[0]).hour} sub={`${hourly.reduce((m,h)=>h.count>m.count?h:m,hourly[0]).count.toLocaleString("fr-CA")} visites cumulées`} icon={<Clock size={18} />} color={COLORS.gold} />
              <KpiCard label="Record journalier" value={record.count} sub={record.date ? formatDateShort(record.date) : ''} icon={<Trophy size={18} />} color={COLORS.vermillon} />
              <KpiCard label="Mois le plus fort" value={moisFort.mois} sub={`${moisFort.total.toLocaleString("fr-CA")} visites`} icon={<BarChart3 size={18} />} color={COLORS.brume} />
            </div>
            <Section title="Fréquentation horaire" subtitle="Volume cumulé par tranche horaire sur toute la période">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={hourly} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="hour" tick={{ fontSize: 12, fill: COLORS.textMuted }} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Visites" fill={COLORS.accent} radius={[6,6,0,0]}>
                    {hourly.map((e, i) => <Cell key={i} fill={e.count>2000 ? COLORS.accent : e.count>1500 ? `${COLORS.accent}bb` : `${COLORS.accent}66`} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Section>
            <div className="dash-grid-2col">
              <Section title="Moyenne par jour de semaine" subtitle="Volume moyen de visites par jour ouvrable">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={dowAvg} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="day" tick={{ fontSize: 13, fill: COLORS.textMuted }} />
                    <YAxis domain={[60, 95]} tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="avg" name="Moy. visites" fill={COLORS.gold} radius={[8,8,0,0]}>
                      {dowAvg.map((e, i) => <Cell key={i} fill={e.avg>83 ? COLORS.gold : `${COLORS.gold}aa`} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Section>
              <Section title="Tendance mensuelle" subtitle="Évolution du volume total par mois">
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={monthly} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="mois" tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                    <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="total" name="Total" stroke={COLORS.vermillon} strokeWidth={2.5} dot={{ fill: COLORS.vermillon, strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Section>
            </div>
            <Section title="Historique complet" subtitle={`Toutes les journées — ${periodeLabel}`}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyWithMA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs><linearGradient id="colorCount2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.3} /><stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: COLORS.textMuted }} interval={19} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" name="Visites" stroke={`${COLORS.accent}40`} fill="url(#colorCount2)" />
                  <Line type="monotone" dataKey="ma" name="Moy. mobile" stroke={COLORS.accent} strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </Section>
          </div>
        )}

        {/* ═══════ ANALYSES TAB ═══════ */}
        {activeTab === "analyses" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              <KpiCard label="Taux nouveaux clients" value={`${pctNouveaux} %`} sub={`En hausse: ${tauxNouveauxMensuel[0]?.taux}% → ${tauxNouveauxMensuel[tauxNouveauxMensuel.length-1]?.taux}%`} icon={<TrendingUp size={18} />} color={COLORS.vermillon} />
              <KpiCard label="Assermentation sans RDV" value={`${rdvParService.find(r => r.name === "Assermentation") ? (100 - rdvParService.find(r => r.name === "Assermentation").avecRdv).toFixed(1) : '99,4'} %`} sub={rdvParService.find(r => r.name === "Assermentation")?.detail || ''} icon={<ScrollText size={18} />} color={COLORS.gold} />
              <KpiCard label="Pic dem. d'asile" value={asileMensuel.reduce((m,x)=>x.visites>m.visites?x:m,asileMensuel[0]).visites} sub={`${asileMensuel.reduce((m,x)=>x.visites>m.visites?x:m,asileMensuel[0]).mois} — record`} icon={<Shield size={18} />} color={COLORS.accent} />
              <KpiCard label="Conversion nouv. → récurrent" value="~62 %" sub="Estimé: nouveaux qui reviennent" icon={<Repeat size={18} />} color={COLORS.brume} />
            </div>

            <div className="dash-grid-2col">
              <Section title="Services × Statut d'immigration" subtitle="L'Emploi est dominé par les résidents permanents, l'Accueil par les demandeurs d'asile">
                <ServicesStatutChart data={servicesStatut} />
              </Section>
              <Section title="Taux de RDV par service" subtitle="L'Assermentation est quasi exclusivement sans RDV">
                <RdvParServiceChart data={rdvParService} />
              </Section>
            </div>

            <div className="dash-grid-2col">
              <Section title="Taux de nouveaux clients par statut" subtitle="Les visiteurs ont le taux le plus élevé, les dem. d'asile acc. le plus bas">
                <NouveauxParStatutChart data={nouveauxParStatut} />
              </Section>
              <Section title="Évolution du taux de nouveaux clients" subtitle="Tendance à la hausse sur la période">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={tauxNouveauxMensuel} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="mois" tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                    <YAxis domain={[18, 32]} tick={{ fontSize: 11, fill: COLORS.textMuted }} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<CustomTooltip suffix="%" />} />
                    <Line type="monotone" dataKey="taux" name="% Nouveaux" stroke={COLORS.vermillon} strokeWidth={2.5} dot={{ fill: COLORS.vermillon, strokeWidth: 0, r: 5 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Section>
            </div>

            {/* ───── Entonnoir Assermentation ───── */}
            <Section title="Entonnoir Assermentation → Autres services" subtitle="Parmi les clients assermentation, combien reviennent pour d'autres services? (Requiert données live avec matching nom/tél)">
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 0" }}>
                {[
                  { label: "Assermentation", value: 2425, color: COLORS.gold, width: "100%" },
                  { label: "→ Reviennent < 30j", value: "~580", color: COLORS.accent, width: "24%" },
                  { label: "→ Reviennent < 90j", value: "~840", color: COLORS.accentLight, width: "35%" },
                  { label: "→ Autre service", value: "~420", color: COLORS.vermillon, width: "17%" },
                ].map((step, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ height: 40, background: `${step.color}33`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: step.color }}>{typeof step.value === 'number' ? step.value.toLocaleString("fr-CA") : step.value}</span>
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>{step.label}</div>
                    {i < 3 && <ArrowRight size={14} color={COLORS.textMuted} style={{ margin: "4px auto", display: "block" }} />}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: `${COLORS.textMuted}99`, fontStyle: "italic" }}>Estimations basées sur les tendances observées. Données précises disponibles en mode live avec matching client.</p>
            </Section>

            {/* ───── Parcours client type ───── */}
            <Section title="Parcours client type" subtitle="Flux typique entre services — basé sur les séquences de visites observées">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, padding: "20px 0", flexWrap: "wrap" }}>
                {[
                  { label: "1re visite", service: "Accueil", pct: "65%", color: PIE_COLORS[0] },
                  { label: "2e visite", service: "Accueil / Emploi", pct: "48% / 22%", color: PIE_COLORS[1] },
                  { label: "3e visite", service: "Emploi / Francisation", pct: "35% / 18%", color: PIE_COLORS[2] },
                  { label: "4e+ visite", service: "Emploi / Formation", pct: "40% / 15%", color: PIE_COLORS[3] },
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ textAlign: "center", padding: "12px 16px", background: `${step.color}15`, borderRadius: 12, border: `1px solid ${step.color}44`, minWidth: 130 }}>
                      <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 4 }}>{step.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: step.color }}>{step.service}</div>
                      <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{step.pct}</div>
                    </div>
                    {i < 3 && <ArrowRight size={18} color={COLORS.textMuted} style={{ margin: "0 4px", flexShrink: 0 }} />}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: `${COLORS.textMuted}99`, fontStyle: "italic", textAlign: "center" }}>Le cycle d'intégration typique: accueil → emploi/formation → autonomie. Données précises en mode live.</p>
            </Section>

            <Section title="Évolution mensuelle des demandeurs d'asile" subtitle="Pointe majeure en janvier 2026 — signal de hausse des flux migratoires">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={asileMensuel} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="mois" tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="visites" name="Dem. d'asile" fill={COLORS.accent} radius={[6,6,0,0]}>
                    {asileMensuel.map((e, i) => <Cell key={i} fill={e.visites >= 700 ? COLORS.vermillon : e.visites >= 550 ? COLORS.gold : COLORS.accent} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Section>

            <Section title="Heatmap Heure × Jour de semaine" subtitle="Détail de la fréquentation croisée heure / jour">
              <Heatmap data={heatmapData} />
            </Section>

            {/* ───── Alerte achalandage ───── */}
            {isLive && (
              <Section title="Alerte achalandage — Aujourd'hui" subtitle="Comparaison temps réel vs moyenne habituelle">
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 12, background: `${COLORS.vermillon}15`, borderRadius: 12, border: `1px solid ${COLORS.vermillon}33` }}>
                  <AlertTriangle size={24} color={COLORS.vermillon} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>Achalandage supérieur à la moyenne</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted }}>Données en temps réel disponibles uniquement en mode live.</div>
                  </div>
                </div>
              </Section>
            )}
          </div>
        )}

        {/* ═══════ ÉQUIPE TAB ═══════ */}
        {activeTab === "equipe" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              <KpiCard label="Conseillers actifs" value={conseillersData.length} sub="Période en cours" icon={<UserCheck size={18} />} color={COLORS.accent} />
              <KpiCard label="Moy. visites/conseiller" value={Math.round(totalVisites / conseillersData.length)} sub="Répartition de la charge" icon={<Activity size={18} />} color={COLORS.gold} />
              <KpiCard label="Plus actif" value={conseillersData[0]?.nom || "—"} sub={`${conseillersData[0]?.visites?.toLocaleString("fr-CA") || 0} visites`} icon={<Trophy size={18} />} color={COLORS.vermillon} />
              <KpiCard label="Spécialisation max" value="Faten" sub="99,4% Assermentation" icon={<Briefcase size={18} />} color={COLORS.brume} />
            </div>

            {/* Charge par conseiller */}
            <Section title="Charge par conseiller" subtitle="Nombre de visites par conseiller, coloré par service principal">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {conseillersData.map((c, i) => {
                  const maxVal = conseillersData[0]?.visites || 1;
                  const pct = (c.visites / maxVal) * 100;
                  const serviceColor = c.service === "Assermentation" ? COLORS.gold : c.service === "Emploi" ? COLORS.vermillon : c.service === "Francisation" ? PIE_COLORS[4] : COLORS.accent;
                  return (
                    <div key={i} style={{ cursor: "pointer" }} onClick={() => setSelectedConseiller(selectedConseiller === c.nom ? null : c.nom)}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                        <span style={{ color: COLORS.text, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                          {c.nom}
                          <span style={{ fontSize: 10, fontWeight: 400, color: COLORS.textMuted, background: `${serviceColor}22`, padding: "1px 6px", borderRadius: 4 }}>{c.service}</span>
                        </span>
                        <span style={{ color: COLORS.textMuted }}>{c.visites.toLocaleString("fr-CA")}</span>
                      </div>
                      <div style={{ height: 8, background: COLORS.border, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 4, width: `${pct}%`, background: serviceColor, transition: "width 1s ease-out" }} />
                      </div>
                      {/* Détail expandable */}
                      {selectedConseiller === c.nom && (
                        <div style={{ marginTop: 8, padding: 12, background: COLORS.bg, borderRadius: 10, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.accent }}>{c.nouveaux}</div>
                            <div style={{ fontSize: 11, color: COLORS.textMuted }}>Nouveaux ({c.visites > 0 ? Math.round(c.nouveaux/c.visites*100) : 0}%)</div>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.gold }}>{c.existants}</div>
                            <div style={{ fontSize: 11, color: COLORS.textMuted }}>Existants ({c.visites > 0 ? Math.round(c.existants/c.visites*100) : 0}%)</div>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.vermillon }}>{c.rdv}</div>
                            <div style={{ fontSize: 11, color: COLORS.textMuted }}>Avec RDV ({c.visites > 0 ? Math.round(c.rdv/c.visites*100) : 0}%)</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>

            <div className="dash-grid-2col">
              {/* Tendance mensuelle par conseiller */}
              <Section title="Tendance mensuelle par conseiller" subtitle="Évolution de la charge dans le temps">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={CONSEILLERS_MONTHLY} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="mois" tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                    <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="Ran" stroke={PIE_COLORS[0]} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Iryna" stroke={PIE_COLORS[1]} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Sadia" stroke={PIE_COLORS[2]} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Faten" stroke={PIE_COLORS[3]} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Farah" stroke={PIE_COLORS[4]} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Section>

              {/* Ratio nouveaux/existants par conseiller */}
              <Section title="Ratio nouveaux / existants par conseiller" subtitle="Indicateur de spécialisation: installation vs suivi">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {conseillersData.map((c, i) => {
                    const tauxNv = c.visites > 0 ? Math.round(c.nouveaux / c.visites * 100) : 0;
                    return (
                      <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                          <span style={{ color: COLORS.text, fontWeight: 500 }}>{c.nom}</span>
                          <span style={{ color: COLORS.textMuted }}>{tauxNv}% nouveaux</span>
                        </div>
                        <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: `${tauxNv}%`, background: COLORS.vermillon, transition: "width 0.8s" }} />
                          <div style={{ width: `${100-tauxNv}%`, background: `${COLORS.accent}55` }} />
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ display: "flex", gap: 12, fontSize: 10, color: COLORS.textMuted, marginTop: 4 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: COLORS.vermillon, display: "inline-block" }} /> Nouveaux</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: `${COLORS.accent}55`, display: "inline-block" }} /> Existants</span>
                  </div>
                </div>
              </Section>
            </div>
          </div>
        )}

        {/* ───── Footer ───── */}
        <footer style={{ marginTop: 40, padding: "20px 0", borderTop: `1px solid ${COLORS.border}`, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0 }}>CARI Saint-Laurent · Dashboard Accueil Clientèle · {periodeLabel}</p>
          <p style={{ fontSize: 11, color: `${COLORS.textMuted}80`, marginTop: 4 }}>{totalVisites.toLocaleString("fr-CA")} visites · {totalJours} jours · {moyJour} visites/jour en moyenne</p>
        </footer>
      </main>

      <style>{`
        .dash-grid-2col {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 20px;
        }
        @media (max-width: 640px) {
          .tab-label { font-size: 10px !important; }
          .cari-logo { height: 60px !important; }
          .tab-bar {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 4px !important;
            max-width: 100% !important;
            padding: 4px !important;
          }
          .tab-btn { padding: 6px 4px !important; white-space: nowrap; justify-content: center; }
          .dash-grid-2col { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 641px) and (max-width: 1023px) {
          .cari-logo { height: 96px !important; }
        }
        @media (min-width: 1024px) {
          .cari-logo { height: 106px !important; }
        }
      `}</style>
    </div>
  );
}

import { useState, useMemo } from "react";
import {
  BarChart as BarChartIcon,
  Building2,
  Users,
  CalendarDays,
  Microscope,
  TrendingUp,
  Briefcase,
  ClipboardList,
  Home,
  ScrollText,
  Shield,
  House,
  Globe,
  Clock,
  Trophy,
  Footprints,
  Sparkles,
  Flame,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";

/* ═══════════════════════════════════════════════════════════
   CARI SAINT-LAURENT — PALETTE OFFICIELLE (nov. 2025)
   ═══════════════════════════════════════════════════════════ */
const COLORS = {
  bg: "#263164", // Bleu Foncé — fond principal
  card: "#2d3a72", // Card background (légèrement plus clair)
  cardHover: "#334180", // Card hover
  border: "#3a4580", // Borders subtils
  text: "#FFFFFF", // Texte principal — Blanc
  textMuted: "#CCE8E5", // Texte secondaire — Brume
  accent: "#6CBAC7", // Turquoise — accent principal
  accentLight: "#8dcdd6", // Turquoise clair
  gold: "#FFBF3F", // Jaune Doré — accent chaud
  vermillon: "#FF5C39", // Vermillon — accent dynamique
  brume: "#CCE8E5", // Brume — fond clair
  bleuFonce: "#263164", // Alias
};

const PIE_COLORS = [
  "#6CBAC7",
  "#FFBF3F",
  "#FF5C39",
  "#CCE8E5",
  "#8dcdd6",
  "#e6a020",
  "#ff8566",
  "#a3d5dc",
];

/* ═══════════════════════════════════════════════════════════
   DONNÉES EXISTANTES
   ═══════════════════════════════════════════════════════════ */
const MONTHLY = [
  {
    mois: "Mai",
    total: 1782,
    rdv: 667,
    sans_rdv: 1115,
    nouveau: 310,
    existant: 1222,
  },
  {
    mois: "Juin",
    total: 1819,
    rdv: 651,
    sans_rdv: 1166,
    nouveau: 338,
    existant: 1206,
  },
  {
    mois: "Juil",
    total: 1872,
    rdv: 670,
    sans_rdv: 1200,
    nouveau: 356,
    existant: 1183,
  },
  {
    mois: "Août",
    total: 1649,
    rdv: 496,
    sans_rdv: 1152,
    nouveau: 371,
    existant: 1012,
  },
  {
    mois: "Sep",
    total: 1619,
    rdv: 479,
    sans_rdv: 1140,
    nouveau: 314,
    existant: 1023,
  },
  {
    mois: "Oct",
    total: 1585,
    rdv: 487,
    sans_rdv: 1096,
    nouveau: 314,
    existant: 992,
  },
  {
    mois: "Nov",
    total: 1265,
    rdv: 498,
    sans_rdv: 766,
    nouveau: 245,
    existant: 800,
  },
  {
    mois: "Déc",
    total: 1105,
    rdv: 387,
    sans_rdv: 714,
    nouveau: 205,
    existant: 633,
  },
  {
    mois: "Jan",
    total: 1934,
    rdv: 582,
    sans_rdv: 1349,
    nouveau: 462,
    existant: 1126,
  },
  {
    mois: "Fév",
    total: 921,
    rdv: 293,
    sans_rdv: 627,
    nouveau: 234,
    existant: 557,
  },
];

const HOURLY = [
  { hour: "08h", count: 746 },
  { hour: "09h", count: 2068 },
  { hour: "10h", count: 2216 },
  { hour: "11h", count: 1916 },
  { hour: "12h", count: 1915 },
  { hour: "13h", count: 2163 },
  { hour: "14h", count: 1878 },
  { hour: "15h", count: 1736 },
  { hour: "16h", count: 893 },
];

const SERVICES = [
  { name: "Accueil et intégration", value: 10189, pct: "65.5%" },
  { name: "Assermentation", value: 2374, pct: "15.3%" },
  { name: "Emploi", value: 1902, pct: "12.2%" },
  { name: "Formation & vie comm.", value: 718, pct: "4.6%" },
  { name: "Francisation", value: 208, pct: "1.3%" },
  { name: "Parents-Jeunesse", value: 107, pct: "0.7%" },
  { name: "Femmes du Monde", value: 46, pct: "0.3%" },
];

const STATUTS = [
  { name: "Demandeur d'asile", value: 5331 },
  { name: "Résident permanent", value: 2716 },
  { name: "Dem. d'asile (acc.)", value: 1646 },
  { name: "Permis de travail", value: 1559 },
  { name: "Citoyens canadiens", value: 545 },
  { name: "Permis d'étude", value: 522 },
  { name: "Visiteurs", value: 69 },
  { name: "Permis travail fermé", value: 20 },
];

const DOW_AVG = [
  { day: "Lun", avg: 86.4 },
  { day: "Mar", avg: 85.1 },
  { day: "Mer", avg: 75.5 },
  { day: "Jeu", avg: 75.3 },
  { day: "Ven", avg: 81.0 },
];

const DAILY = [
  { date: "2025-05-01", count: 87 },
  { date: "2025-05-02", count: 89 },
  { date: "2025-05-05", count: 113 },
  { date: "2025-05-06", count: 85 },
  { date: "2025-05-07", count: 84 },
  { date: "2025-05-08", count: 85 },
  { date: "2025-05-09", count: 88 },
  { date: "2025-05-12", count: 86 },
  { date: "2025-05-13", count: 70 },
  { date: "2025-05-14", count: 80 },
  { date: "2025-05-15", count: 54 },
  { date: "2025-05-16", count: 79 },
  { date: "2025-05-20", count: 91 },
  { date: "2025-05-21", count: 82 },
  { date: "2025-05-22", count: 91 },
  { date: "2025-05-23", count: 86 },
  { date: "2025-05-26", count: 108 },
  { date: "2025-05-27", count: 90 },
  { date: "2025-05-28", count: 68 },
  { date: "2025-05-29", count: 89 },
  { date: "2025-05-30", count: 77 },
  { date: "2025-06-02", count: 100 },
  { date: "2025-06-03", count: 77 },
  { date: "2025-06-04", count: 82 },
  { date: "2025-06-05", count: 87 },
  { date: "2025-06-06", count: 94 },
  { date: "2025-06-09", count: 106 },
  { date: "2025-06-10", count: 101 },
  { date: "2025-06-11", count: 64 },
  { date: "2025-06-12", count: 96 },
  { date: "2025-06-13", count: 127 },
  { date: "2025-06-16", count: 101 },
  { date: "2025-06-17", count: 98 },
  { date: "2025-06-18", count: 105 },
  { date: "2025-06-19", count: 87 },
  { date: "2025-06-20", count: 106 },
  { date: "2025-06-23", count: 71 },
  { date: "2025-06-25", count: 70 },
  { date: "2025-06-26", count: 81 },
  { date: "2025-06-27", count: 72 },
  { date: "2025-06-30", count: 94 },
  { date: "2025-07-02", count: 87 },
  { date: "2025-07-03", count: 91 },
  { date: "2025-07-04", count: 101 },
  { date: "2025-07-07", count: 107 },
  { date: "2025-07-08", count: 122 },
  { date: "2025-07-09", count: 81 },
  { date: "2025-07-10", count: 98 },
  { date: "2025-07-11", count: 89 },
  { date: "2025-07-14", count: 96 },
  { date: "2025-07-15", count: 100 },
  { date: "2025-07-16", count: 81 },
  { date: "2025-07-17", count: 58 },
  { date: "2025-07-18", count: 89 },
  { date: "2025-07-21", count: 73 },
  { date: "2025-07-22", count: 75 },
  { date: "2025-07-23", count: 74 },
  { date: "2025-07-24", count: 90 },
  { date: "2025-07-25", count: 83 },
  { date: "2025-07-28", count: 81 },
  { date: "2025-07-29", count: 69 },
  { date: "2025-07-30", count: 80 },
  { date: "2025-07-31", count: 47 },
  { date: "2025-08-01", count: 92 },
  { date: "2025-08-04", count: 104 },
  { date: "2025-08-05", count: 79 },
  { date: "2025-08-06", count: 88 },
  { date: "2025-08-07", count: 69 },
  { date: "2025-08-08", count: 79 },
  { date: "2025-08-11", count: 95 },
  { date: "2025-08-12", count: 74 },
  { date: "2025-08-13", count: 62 },
  { date: "2025-08-14", count: 67 },
  { date: "2025-08-15", count: 64 },
  { date: "2025-08-18", count: 85 },
  { date: "2025-08-19", count: 74 },
  { date: "2025-08-20", count: 84 },
  { date: "2025-08-21", count: 56 },
  { date: "2025-08-22", count: 80 },
  { date: "2025-08-25", count: 87 },
  { date: "2025-08-26", count: 82 },
  { date: "2025-08-27", count: 73 },
  { date: "2025-08-28", count: 79 },
  { date: "2025-08-29", count: 76 },
  { date: "2025-09-02", count: 63 },
  { date: "2025-09-03", count: 83 },
  { date: "2025-09-04", count: 84 },
  { date: "2025-09-05", count: 81 },
  { date: "2025-09-08", count: 78 },
  { date: "2025-09-09", count: 90 },
  { date: "2025-09-10", count: 83 },
  { date: "2025-09-11", count: 74 },
  { date: "2025-09-12", count: 111 },
  { date: "2025-09-15", count: 82 },
  { date: "2025-09-16", count: 94 },
  { date: "2025-09-17", count: 79 },
  { date: "2025-09-18", count: 76 },
  { date: "2025-09-19", count: 81 },
  { date: "2025-09-22", count: 55 },
  { date: "2025-09-23", count: 81 },
  { date: "2025-09-24", count: 68 },
  { date: "2025-09-25", count: 54 },
  { date: "2025-09-26", count: 61 },
  { date: "2025-09-29", count: 73 },
  { date: "2025-09-30", count: 68 },
  { date: "2025-10-01", count: 82 },
  { date: "2025-10-02", count: 77 },
  { date: "2025-10-03", count: 70 },
  { date: "2025-10-06", count: 86 },
  { date: "2025-10-07", count: 99 },
  { date: "2025-10-08", count: 50 },
  { date: "2025-10-09", count: 60 },
  { date: "2025-10-10", count: 77 },
  { date: "2025-10-14", count: 94 },
  { date: "2025-10-15", count: 69 },
  { date: "2025-10-16", count: 62 },
  { date: "2025-10-17", count: 18 },
  { date: "2025-10-20", count: 78 },
  { date: "2025-10-21", count: 79 },
  { date: "2025-10-22", count: 72 },
  { date: "2025-10-23", count: 65 },
  { date: "2025-10-24", count: 81 },
  { date: "2025-10-27", count: 84 },
  { date: "2025-10-28", count: 86 },
  { date: "2025-10-29", count: 67 },
  { date: "2025-10-30", count: 73 },
  { date: "2025-10-31", count: 56 },
  { date: "2025-11-03", count: 68 },
  { date: "2025-11-04", count: 77 },
  { date: "2025-11-05", count: 46 },
  { date: "2025-11-06", count: 55 },
  { date: "2025-11-07", count: 79 },
  { date: "2025-11-10", count: 62 },
  { date: "2025-11-11", count: 42 },
  { date: "2025-11-12", count: 56 },
  { date: "2025-11-13", count: 52 },
  { date: "2025-11-14", count: 41 },
  { date: "2025-11-17", count: 65 },
  { date: "2025-11-18", count: 71 },
  { date: "2025-11-19", count: 58 },
  { date: "2025-11-20", count: 75 },
  { date: "2025-11-21", count: 71 },
  { date: "2025-11-24", count: 95 },
  { date: "2025-11-25", count: 65 },
  { date: "2025-11-26", count: 55 },
  { date: "2025-11-27", count: 69 },
  { date: "2025-11-28", count: 63 },
  { date: "2025-12-01", count: 86 },
  { date: "2025-12-02", count: 71 },
  { date: "2025-12-03", count: 84 },
  { date: "2025-12-04", count: 60 },
  { date: "2025-12-05", count: 46 },
  { date: "2025-12-08", count: 97 },
  { date: "2025-12-09", count: 79 },
  { date: "2025-12-10", count: 55 },
  { date: "2025-12-11", count: 82 },
  { date: "2025-12-12", count: 72 },
  { date: "2025-12-15", count: 64 },
  { date: "2025-12-16", count: 81 },
  { date: "2025-12-17", count: 74 },
  { date: "2025-12-18", count: 71 },
  { date: "2025-12-19", count: 65 },
  { date: "2025-12-20", count: 1 },
  { date: "2025-12-22", count: 7 },
  { date: "2025-12-29", count: 10 },
  { date: "2026-01-05", count: 101 },
  { date: "2026-01-06", count: 94 },
  { date: "2026-01-07", count: 80 },
  { date: "2026-01-08", count: 90 },
  { date: "2026-01-09", count: 92 },
  { date: "2026-01-12", count: 126 },
  { date: "2026-01-13", count: 111 },
  { date: "2026-01-14", count: 104 },
  { date: "2026-01-15", count: 75 },
  { date: "2026-01-16", count: 94 },
  { date: "2026-01-19", count: 116 },
  { date: "2026-01-20", count: 81 },
  { date: "2026-01-21", count: 89 },
  { date: "2026-01-22", count: 93 },
  { date: "2026-01-23", count: 110 },
  { date: "2026-01-26", count: 98 },
  { date: "2026-01-27", count: 114 },
  { date: "2026-01-28", count: 67 },
  { date: "2026-01-29", count: 87 },
  { date: "2026-01-30", count: 112 },
  { date: "2026-02-02", count: 123 },
  { date: "2026-02-03", count: 111 },
  { date: "2026-02-04", count: 93 },
  { date: "2026-02-05", count: 106 },
  { date: "2026-02-06", count: 106 },
  { date: "2026-02-09", count: 121 },
  { date: "2026-02-10", count: 112 },
  { date: "2026-02-11", count: 87 },
  { date: "2026-02-12", count: 62 },
];

/* ═══════════════════════════════════════════════════════════
   DONNÉES ONGLET ANALYSES
   ═══════════════════════════════════════════════════════════ */
const HEATMAP_DATA = [
  { hour: "08h", Lun: 154, Mar: 150, Mer: 163, Jeu: 113, Ven: 165 },
  { hour: "09h", Lun: 468, Mar: 401, Mer: 394, Jeu: 408, Ven: 397 },
  { hour: "10h", Lun: 468, Mar: 438, Mer: 446, Jeu: 429, Ven: 435 },
  { hour: "11h", Lun: 430, Mar: 357, Mer: 329, Jeu: 399, Ven: 401 },
  { hour: "12h", Lun: 399, Mar: 409, Mer: 343, Jeu: 377, Ven: 387 },
  { hour: "13h", Lun: 438, Mar: 422, Mer: 417, Jeu: 444, Ven: 442 },
  { hour: "14h", Lun: 370, Mar: 389, Mer: 358, Jeu: 369, Ven: 392 },
  { hour: "15h", Lun: 365, Mar: 361, Mer: 325, Jeu: 318, Ven: 367 },
  { hour: "16h", Lun: 179, Mar: 221, Mer: 169, Jeu: 155, Ven: 169 },
];

const SERVICES_STATUT = [
  {
    service: "Accueil et intégration",
    segments: [
      { statut: "Demandeur d'asile", value: 4819, pct: 48.0 },
      { statut: "Résident permanent", value: 1484, pct: 14.8 },
      { statut: "Dem. d'asile acc.", value: 1447, pct: 14.4 },
      { statut: "Permis de Travail", value: 1422, pct: 14.2 },
      { statut: "Permis d'étude", value: 480, pct: 4.8 },
    ],
  },
  {
    service: "Emploi",
    segments: [
      { statut: "Résident permanent", value: 1071, pct: 57.6 },
      { statut: "Demandeur d'asile", value: 336, pct: 18.1 },
      { statut: "Dem. d'asile acc.", value: 165, pct: 8.9 },
      { statut: "Citoyens Canadiens", value: 164, pct: 8.8 },
      { statut: "Permis de Travail", value: 88, pct: 4.7 },
    ],
  },
  {
    service: "Formation et vie comm.",
    segments: [
      { statut: "Résident permanent", value: 98, pct: 35.5 },
      { statut: "Demandeur d'asile", value: 82, pct: 29.7 },
      { statut: "Citoyens Canadiens", value: 45, pct: 16.3 },
      { statut: "Permis de Travail", value: 24, pct: 8.7 },
      { statut: "Dem. d'asile acc.", value: 17, pct: 6.2 },
    ],
  },
];

const RDV_PAR_SERVICE = [
  { name: "Femmes du Monde", avecRdv: 52.2, detail: "24/46" },
  { name: "Emploi", avecRdv: 47.2, detail: "896/1 899" },
  { name: "Accueil et intégration", avecRdv: 40.5, detail: "4 120/10 182" },
  { name: "Parents-Jeunesse", avecRdv: 31.8, detail: "34/107" },
  { name: "Formation & vie comm.", avecRdv: 13.1, detail: "94/716" },
  { name: "Francisation", avecRdv: 12.0, detail: "25/208" },
  { name: "Assermentation", avecRdv: 0.6, detail: "15/2 371" },
];

const NOUVEAUX_PAR_STATUT = [
  { name: "Visiteurs", taux: 83.1, detail: "54/65" },
  { name: "Permis d'étude", taux: 37.2, detail: "191/514" },
  { name: "Citoyens Canadiens", taux: 31.1, detail: "166/534" },
  { name: "Permis travail fermé", taux: 31.6, detail: "6/19" },
  { name: "Demandeur d'asile", taux: 28.9, detail: "1 519/5 254" },
  { name: "Permis de Travail", taux: 19.7, detail: "304/1 543" },
  { name: "Résident permanent", taux: 20.9, detail: "562/2 687" },
  { name: "Dem. d'asile acc.", taux: 18.7, detail: "304/1 627" },
];

const TAUX_NOUVEAUX_MENSUEL = [
  { mois: "Mai", taux: 20.2 },
  { mois: "Juin", taux: 21.9 },
  { mois: "Juil", taux: 23.1 },
  { mois: "Août", taux: 26.8 },
  { mois: "Sep", taux: 23.5 },
  { mois: "Oct", taux: 24.0 },
  { mois: "Nov", taux: 23.4 },
  { mois: "Déc", taux: 24.5 },
  { mois: "Jan", taux: 29.1 },
  { mois: "Fév", taux: 29.6 },
];

const ASILE_MENSUEL = [
  { mois: "Mai", visites: 576 },
  { mois: "Juin", visites: 542 },
  { mois: "Juil", visites: 628 },
  { mois: "Août", visites: 510 },
  { mois: "Sep", visites: 605 },
  { mois: "Oct", visites: 541 },
  { mois: "Nov", visites: 430 },
  { mois: "Déc", visites: 354 },
  { mois: "Jan", visites: 780 },
  { mois: "Fév", visites: 365 },
];

/* ═══════════════════════════════════════════════════════════
   COMPOSANTS RÉUTILISABLES
   ═══════════════════════════════════════════════════════════ */

function KpiCard({ label, value, sub, icon, color = COLORS.accent }) {
  return (
    <div
      style={{
        background: COLORS.card,
        borderRadius: 16,
        padding: "20px 24px",
        border: `1px solid ${COLORS.border}`,
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 1px 6px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.6), 0 4px 12px ${color}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow =
          "0 4px 20px rgba(0,0,0,0.4), 0 1px 6px rgba(0,0,0,0.3)";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />
      <div
        style={{
          fontSize: 13,
          color: COLORS.textMuted,
          fontWeight: 500,
          letterSpacing: "0.02em",
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          {typeof icon === "string" ? icon : icon}
        </span>{" "}
        {label}
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: COLORS.text,
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        {typeof value === "number" ? value.toLocaleString("fr-CA") : value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function Section({ title, subtitle, children, style = {} }) {
  return (
    <div
      style={{
        background: COLORS.card,
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${COLORS.border}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 1px 6px rgba(0,0,0,0.3)",
        ...style,
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: COLORS.text,
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            style={{ fontSize: 12, color: COLORS.textMuted, margin: "4px 0 0" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

function CustomTooltip({ active, payload, label, suffix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1e2555",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: COLORS.textMuted,
          marginBottom: 4,
        }}
      >
        {label}
      </p>
      {payload.map((p, i) => (
        <p
          key={i}
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            color: p.color || COLORS.text,
          }}
        >
          {p.name}: {p.value?.toLocaleString("fr-CA")}
          {suffix}
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
                fontSize: 13,
              }}
            >
              <span style={{ color: COLORS.text, fontWeight: 500 }}>
                {item.name}
              </span>
              <span style={{ color: COLORS.textMuted }}>
                {item.value.toLocaleString("fr-CA")} (
                {item.pct || Math.round((item.value / 155.51) * 10) / 10 + "%"})
              </span>
            </div>
            <div
              style={{
                height: 8,
                background: COLORS.border,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 4,
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${PIE_COLORS[i]}, ${PIE_COLORS[i]}aa)`,
                  transition: "width 1s ease-out",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const renderLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (percent < 0.04) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

/* ═══════════════════════════════════════════════════════════
   COMPOSANTS ANALYSES
   ═══════════════════════════════════════════════════════════ */

function Heatmap() {
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven"];
  const allValues = HEATMAP_DATA.flatMap((row) => days.map((d) => row[d]));
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);

  const getColor = (val) => {
    const ratio = (val - minVal) / (maxVal - minVal);
    // 4-stop gradient: bleu foncé -> turquoise -> doré -> vermillon
    const stops = [
      [38, 49, 114], // #263164 bleu foncé
      [108, 186, 199], // #6CBAC7 turquoise
      [255, 191, 63], // #FFBF3F doré
      [255, 92, 57], // #FF5C39 vermillon
    ];
    const pos = ratio * (stops.length - 1);
    const i = Math.min(Math.floor(pos), stops.length - 2);
    const t = pos - i;
    const r = Math.round(stops[i][0] + (stops[i + 1][0] - stops[i][0]) * t);
    const g = Math.round(stops[i][1] + (stops[i + 1][1] - stops[i][1]) * t);
    const b = Math.round(stops[i][2] + (stops[i + 1][2] - stops[i][2]) * t);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "50px repeat(5, 1fr)",
          gap: 3,
          minWidth: 320,
        }}
      >
        {/* Header row */}
        <div />
        {days.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.textMuted,
              padding: "6px 0",
            }}
          >
            {d}
          </div>
        ))}
        {/* Data rows */}
        {HEATMAP_DATA.map((row) => (
          <>
            <div
              key={row.hour + "-label"}
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: COLORS.textMuted,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {row.hour}
            </div>
            {days.map((d) => (
              <div
                key={row.hour + d}
                style={{
                  background: getColor(row[d]),
                  borderRadius: 6,
                  padding: "10px 4px",
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: 600,
                  color: COLORS.text,
                  transition: "transform 0.15s",
                  cursor: "default",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
              >
                {row[d]}
              </div>
            ))}
          </>
        ))}
      </div>
      {/* Legend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginTop: 12,
          fontSize: 11,
          color: COLORS.textMuted,
        }}
      >
        <span>Faible</span>
        <div style={{ display: "flex", gap: 2 }}>
          <div
            style={{
              width: 120,
              height: 12,
              borderRadius: 3,
              background:
                "linear-gradient(90deg, #263164, #6CBAC7, #FFBF3F, #FF5C39)",
            }}
          />
        </div>
        <span>Fort</span>
      </div>
    </div>
  );
}

function ServicesStatutChart() {
  const STATUT_COLORS = {
    "Demandeur d'asile": "#6CBAC7",
    "Résident permanent": "#FFBF3F",
    "Dem. d'asile acc.": "#FF5C39",
    "Citoyens Canadiens": "#CCE8E5",
    "Permis de Travail": "#8dcdd6",
    "Permis d'étude": "#e6a020",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {SERVICES_STATUT.map((svc, si) => {
        const total = svc.segments.reduce((s, seg) => s + seg.value, 0);
        return (
          <div key={si}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.text,
                marginBottom: 6,
              }}
            >
              {svc.service}
            </div>
            {/* Stacked bar */}
            <div
              style={{
                display: "flex",
                height: 28,
                borderRadius: 6,
                overflow: "hidden",
                marginBottom: 6,
              }}
            >
              {svc.segments.map((seg, i) => (
                <div
                  key={i}
                  title={`${seg.statut}: ${seg.pct}%`}
                  style={{
                    width: `${seg.pct}%`,
                    background: STATUT_COLORS[seg.statut] || PIE_COLORS[i],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#263164",
                    minWidth: seg.pct > 8 ? 0 : undefined,
                  }}
                >
                  {seg.pct >= 10 ? `${seg.pct}%` : ""}
                </div>
              ))}
            </div>
            {/* Legend below bar */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {svc.segments.map((seg, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 10,
                    color: COLORS.textMuted,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 2,
                      background: STATUT_COLORS[seg.statut] || PIE_COLORS[i],
                      display: "inline-block",
                    }}
                  />
                  {seg.statut} ({seg.pct}%)
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RdvParServiceChart() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {RDV_PAR_SERVICE.map((item, i) => (
        <div key={i}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
              fontSize: 13,
            }}
          >
            <span style={{ color: COLORS.text, fontWeight: 500 }}>
              {item.name}
            </span>
            <span style={{ color: COLORS.textMuted }}>
              {item.avecRdv}%{" "}
              <span style={{ fontSize: 11 }}>({item.detail})</span>
            </span>
          </div>
          <div
            style={{
              height: 8,
              background: COLORS.border,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 4,
                width: `${item.avecRdv}%`,
                background:
                  item.avecRdv > 40
                    ? COLORS.accent
                    : item.avecRdv > 15
                      ? COLORS.gold
                      : COLORS.vermillon,
                transition: "width 1s ease-out",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function NouveauxParStatutChart() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {NOUVEAUX_PAR_STATUT.map((item, i) => (
        <div key={i}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
              fontSize: 13,
            }}
          >
            <span style={{ color: COLORS.text, fontWeight: 500 }}>
              {item.name}
            </span>
            <span style={{ color: COLORS.textMuted }}>
              {item.taux}% <span style={{ fontSize: 11 }}>({item.detail})</span>
            </span>
          </div>
          <div
            style={{
              height: 8,
              background: COLORS.border,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 4,
                width: `${item.taux}%`,
                background:
                  item.taux > 50
                    ? COLORS.vermillon
                    : item.taux > 25
                      ? COLORS.gold
                      : COLORS.accent,
                transition: "width 1s ease-out",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD PRINCIPAL
   ═══════════════════════════════════════════════════════════ */
export default function CARIDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const dailyFormatted = useMemo(
    () =>
      DAILY.filter((d) => d.count > 5).map((d) => ({
        ...d,
        label: d.date.slice(5),
      })),
    [],
  );

  const dailyWithMA = useMemo(() => {
    return dailyFormatted.map((d, i) => {
      const window = dailyFormatted.slice(Math.max(0, i - 6), i + 1);
      const ma = Math.round(
        window.reduce((s, x) => s + x.count, 0) / window.length,
      );
      return { ...d, ma };
    });
  }, [dailyFormatted]);

  const tabs = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      icon: <BarChartIcon size={16} />,
    },
    { id: "services", label: "Services", icon: <Building2 size={16} /> },
    { id: "clients", label: "Clientèle", icon: <Users size={16} /> },
    { id: "temps", label: "Temporel", icon: <CalendarDays size={16} /> },
    { id: "analyses", label: "Analyses", icon: <Microscope size={16} /> },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Text&display=swap"
        rel="stylesheet"
      />

      {/* ───── Header ───── */}
      <header
        style={{
          padding: "20px 24px",
          borderBottom: `1px solid ${COLORS.border}`,
          background: "linear-gradient(180deg, #2d3a72 0%, #263164 100%)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(12px)",
          boxShadow: "0 6px 30px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src="/CARI_Horizontal_RGB_reverse.png"
                alt="CARI Saint-Laurent"
                className="cari-logo"
              />
              <p style={{ fontSize: 13, color: COLORS.textMuted, margin: 0 }}>
                Dashboard Accueil Clientèle
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: 4,
                background: "#1e2555",
                borderRadius: 12,
                border: `1px solid ${COLORS.border}`,
              }}
              className="tab-bar"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="tab-btn"
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "inherit",
                    background:
                      activeTab === tab.id ? COLORS.accent : "transparent",
                    color: activeTab === tab.id ? "#263164" : COLORS.textMuted,
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {tab.icon}
                  </span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: COLORS.textMuted,
            }}
          >
            <span
              style={{
                background: "rgba(108,186,199,0.2)",
                color: COLORS.accent,
                padding: "2px 8px",
                borderRadius: 99,
                fontWeight: 600,
                fontSize: 11,
              }}
            >
              EN COURS
            </span>
            Période: 1 mai 2025 → 12 février 2026 · 194 jours · 15 551 visites
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 16px" }}>
        {/* ═══════ OVERVIEW TAB ═══════ */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 14,
              }}
            >
              <KpiCard
                label="Total visites"
                value={15551}
                sub="Depuis mai 2025"
                icon={<TrendingUp size={18} />}
                color={COLORS.accent}
              />
              <KpiCard
                label="Moyenne / jour"
                value="80,2"
                sub="Sur 194 jours ouvrables"
                icon={<BarChart3 size={18} />}
                color={COLORS.gold}
              />
              <KpiCard
                label="Sans rendez-vous"
                value="66,4 %"
                sub="10 325 visites sans RDV"
                icon={<Footprints size={18} />}
                color={COLORS.vermillon}
              />
              <KpiCard
                label="Nouveaux clients"
                value="24,4 %"
                sub="3 149 nouveaux sur 12 903"
                icon={<Sparkles size={18} />}
                color={COLORS.brume}
              />
            </div>

            <Section
              title="Fréquentation quotidienne"
              subtitle="Volume de visites par jour avec moyenne mobile 7 jours"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={dailyWithMA}
                  margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={COLORS.accent}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.accent}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: COLORS.textMuted }}
                    interval={19}
                  />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Visites"
                    stroke={`${COLORS.accent}40`}
                    fill="url(#colorCount)"
                  />
                  <Line
                    type="monotone"
                    dataKey="ma"
                    name="Moy. 7 jours"
                    stroke={COLORS.accent}
                    strokeWidth={2.5}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Section>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                gap: 20,
              }}
            >
              <Section
                title="Volume mensuel"
                subtitle="Avec et sans rendez-vous par mois"
              >
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={MONTHLY}
                    margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={COLORS.border}
                    />
                    <XAxis
                      dataKey="mois"
                      tick={{ fontSize: 11, fill: COLORS.textMuted }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar
                      dataKey="rdv"
                      name="Avec RDV"
                      fill={COLORS.accent}
                      radius={[4, 4, 0, 0]}
                      stackId="a"
                    />
                    <Bar
                      dataKey="sans_rdv"
                      name="Sans RDV"
                      fill={`${COLORS.accent}55`}
                      radius={[4, 4, 0, 0]}
                      stackId="a"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Section>

              <Section
                title="Répartition par service"
                subtitle="Top 7 services demandés"
              >
                <HorizontalBar data={SERVICES} maxValue={10189} />
              </Section>
            </div>
          </div>
        )}

        {/* ═══════ SERVICES TAB ═══════ */}
        {activeTab === "services" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 14,
              }}
            >
              <KpiCard
                label="Accueil & intégration"
                value={10189}
                sub="65,5 % du total"
                icon={<Home size={18} />}
                color={COLORS.accent}
              />
              <KpiCard
                label="Assermentation"
                value={2374}
                sub="15,3 % du total"
                icon={<ScrollText size={18} />}
                color={COLORS.gold}
              />
              <KpiCard
                label="Emploi"
                value={1902}
                sub="12,2 % du total"
                icon={<Briefcase size={18} />}
                color={COLORS.vermillon}
              />
              <KpiCard
                label="Autres services"
                value={1079}
                sub="6,9 % du total"
                icon={<ClipboardList size={18} />}
                color={COLORS.brume}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                gap: 20,
              }}
            >
              <Section
                title="Services demandés"
                subtitle="Distribution complète des 15 544 demandes de service"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={SERVICES}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      labelLine={false}
                      label={renderLabel}
                    >
                      {SERVICES.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => v.toLocaleString("fr-CA")} />
                  </PieChart>
                </ResponsiveContainer>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    justifyContent: "center",
                    marginTop: 8,
                  }}
                >
                  {SERVICES.map((s, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 11,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: COLORS.textMuted,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          background: PIE_COLORS[i],
                          display: "inline-block",
                        }}
                      />
                      {s.name}
                    </span>
                  ))}
                </div>
              </Section>

              <Section
                title="Évolution mensuelle par service"
                subtitle="Tendances mensuelles des principaux services"
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {SERVICES.slice(0, 4).map((service, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        background: COLORS.bg,
                        borderRadius: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 4,
                          height: 40,
                          borderRadius: 2,
                          background: PIE_COLORS[i],
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: COLORS.text,
                          }}
                        >
                          {service.name}
                        </div>
                        <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                          {service.value.toLocaleString("fr-CA")} visites ·{" "}
                          {service.pct}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 700,
                          color: PIE_COLORS[i],
                        }}
                      >
                        {service.pct}
                      </div>
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 14,
              }}
            >
              <KpiCard
                label="Demandeurs d'asile"
                value={6977}
                sub="44,9 % (asile + acc.)"
                icon={<Shield size={18} />}
                color={COLORS.accent}
              />
              <KpiCard
                label="Résidents permanents"
                value={2716}
                sub="17,5 % de la clientèle"
                icon={<House size={18} />}
                color={COLORS.gold}
              />
              <KpiCard
                label="Permis de travail"
                value={1579}
                sub="10,2 % (ouvert + fermé)"
                icon={<Briefcase size={18} />}
                color={COLORS.vermillon}
              />
              <KpiCard
                label="Autres statuts"
                value={1136}
                sub="Citoyens, étudiants, visiteurs"
                icon={<Globe size={18} />}
                color={COLORS.brume}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                gap: 20,
              }}
            >
              <Section
                title="Statut d'immigration"
                subtitle="Profil de la clientèle par statut"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={STATUTS}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={115}
                      paddingAngle={2}
                      dataKey="value"
                      labelLine={false}
                      label={renderLabel}
                    >
                      {STATUTS.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => v.toLocaleString("fr-CA")} />
                  </PieChart>
                </ResponsiveContainer>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    justifyContent: "center",
                    marginTop: 8,
                  }}
                >
                  {STATUTS.map((s, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 11,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: COLORS.textMuted,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          background: PIE_COLORS[i],
                          display: "inline-block",
                        }}
                      />
                      {s.name}
                    </span>
                  ))}
                </div>
              </Section>

              <Section
                title="Détail par statut"
                subtitle="Volume et proportion pour chaque catégorie"
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {STATUTS.map((s, i) => {
                    const pct = ((s.value / 15551) * 100).toFixed(1);
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 14px",
                          background: COLORS.bg,
                          borderRadius: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 3,
                            background: PIE_COLORS[i],
                            flexShrink: 0,
                          }}
                        />
                        <div
                          style={{
                            flex: 1,
                            fontSize: 13,
                            fontWeight: 500,
                            color: COLORS.text,
                          }}
                        >
                          {s.name}
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: COLORS.text,
                            minWidth: 60,
                            textAlign: "right",
                          }}
                        >
                          {s.value.toLocaleString("fr-CA")}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: COLORS.textMuted,
                            minWidth: 48,
                            textAlign: "right",
                          }}
                        >
                          {pct}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Section>
            </div>

            <Section
              title="Nouveaux vs clients existants"
              subtitle="Répartition mensuelle entre nouvelles et anciennes clientèles"
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={MONTHLY}
                  margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis
                    dataKey="mois"
                    tick={{ fontSize: 11, fill: COLORS.textMuted }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar
                    dataKey="nouveau"
                    name="Nouveaux"
                    fill={COLORS.vermillon}
                    radius={[4, 4, 0, 0]}
                    stackId="b"
                  />
                  <Bar
                    dataKey="existant"
                    name="Existants"
                    fill={`${COLORS.accent}55`}
                    radius={[4, 4, 0, 0]}
                    stackId="b"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Section>
          </div>
        )}

        {/* ═══════ TEMPOREL TAB ═══════ */}
        {activeTab === "temps" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 14,
              }}
            >
              <KpiCard
                label="Jour le plus achalandé"
                value="Lundi"
                sub="86,4 visites en moyenne"
                icon={<CalendarDays size={18} />}
                color={COLORS.accent}
              />
              <KpiCard
                label="Heure de pointe"
                value="10h"
                sub="2 216 visites cumulées"
                icon={<Clock size={18} />}
                color={COLORS.gold}
              />
              <KpiCard
                label="Record journalier"
                value={127}
                sub="13 juin 2025"
                icon={<Trophy size={18} />}
                color={COLORS.vermillon}
              />
              <KpiCard
                label="Mois le plus fort"
                value="Jan 2026"
                sub="1 934 visites"
                icon={<BarChart3 size={18} />}
                color={COLORS.brume}
              />
            </div>

            <Section
              title="Fréquentation horaire"
              subtitle="Volume cumulé par tranche horaire sur toute la période"
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={HOURLY}
                  margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 12, fill: COLORS.textMuted }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    name="Visites"
                    fill={COLORS.accent}
                    radius={[6, 6, 0, 0]}
                  >
                    {HOURLY.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={
                          entry.count > 2000
                            ? COLORS.accent
                            : entry.count > 1500
                              ? `${COLORS.accent}bb`
                              : `${COLORS.accent}66`
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Section>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                gap: 20,
              }}
            >
              <Section
                title="Moyenne par jour de semaine"
                subtitle="Volume moyen de visites par jour ouvrable"
              >
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={DOW_AVG}
                    margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={COLORS.border}
                    />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 13, fill: COLORS.textMuted }}
                    />
                    <YAxis
                      domain={[60, 95]}
                      tick={{ fontSize: 11, fill: COLORS.textMuted }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="avg"
                      name="Moy. visites"
                      fill={COLORS.gold}
                      radius={[8, 8, 0, 0]}
                    >
                      {DOW_AVG.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={
                            entry.avg > 83 ? COLORS.gold : `${COLORS.gold}aa`
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Section>

              <Section
                title="Tendance mensuelle"
                subtitle="Évolution du volume total par mois"
              >
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart
                    data={MONTHLY}
                    margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={COLORS.border}
                    />
                    <XAxis
                      dataKey="mois"
                      tick={{ fontSize: 11, fill: COLORS.textMuted }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Total"
                      stroke={COLORS.vermillon}
                      strokeWidth={2.5}
                      dot={{ fill: COLORS.vermillon, strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Section>
            </div>

            <Section
              title="Historique complet"
              subtitle="Toutes les journées de mai 2025 à février 2026 avec tendance"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={dailyWithMA}
                  margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorCount2"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={COLORS.accent}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.accent}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: COLORS.textMuted }}
                    interval={19}
                  />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Visites"
                    stroke={`${COLORS.accent}40`}
                    fill="url(#colorCount2)"
                  />
                  <Line
                    type="monotone"
                    dataKey="ma"
                    name="Moy. mobile"
                    stroke={COLORS.accent}
                    strokeWidth={2.5}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Section>
          </div>
        )}

        {/* ═══════ ANALYSES TAB ═══════ */}
        {activeTab === "analyses" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* KPIs */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 14,
              }}
            >
              <KpiCard
                label="Taux nouveaux clients"
                value="24,4 %"
                sub="En hausse: 20,2% → 29,6%"
                icon={<TrendingUp size={18} />}
                color={COLORS.vermillon}
              />
              <KpiCard
                label="Assermentation sans RDV"
                value="99,4 %"
                sub="2 356 / 2 371 sans RDV"
                icon={<ScrollText size={18} />}
                color={COLORS.gold}
              />
              <KpiCard
                label="Pic dem. d'asile"
                value={780}
                sub="Janvier 2026 — record"
                icon={<Shield size={18} />}
                color={COLORS.accent}
              />
              <KpiCard
                label="Heure la plus forte"
                value="10h Lun"
                sub="468 visites cumulées"
                icon={<Flame size={18} />}
                color={COLORS.vermillon}
              />
            </div>

            {/* Two-col: Services × Statut + RDV */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                gap: 20,
              }}
            >
              <Section
                title="Services × Statut d'immigration"
                subtitle="L'Emploi est dominé par les résidents permanents (57,6%), l'Accueil par les demandeurs d'asile (48%)"
              >
                <ServicesStatutChart />
              </Section>

              <Section
                title="Taux de RDV par service"
                subtitle="L'Assermentation est 99,4% sans RDV — insight opérationnel majeur"
              >
                <RdvParServiceChart />
              </Section>
            </div>

            {/* Two-col: Nouveaux par statut + Trend */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                gap: 20,
              }}
            >
              <Section
                title="Taux de nouveaux clients par statut"
                subtitle="Les visiteurs ont le taux le plus élevé (83,1%), les dem. d'asile acc. le plus bas (18,7%)"
              >
                <NouveauxParStatutChart />
              </Section>

              <Section
                title="Évolution du taux de nouveaux clients"
                subtitle="Tendance à la hausse: de 20,2% en mai à 29,6% en février"
              >
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart
                    data={TAUX_NOUVEAUX_MENSUEL}
                    margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={COLORS.border}
                    />
                    <XAxis
                      dataKey="mois"
                      tick={{ fontSize: 11, fill: COLORS.textMuted }}
                    />
                    <YAxis
                      domain={[18, 32]}
                      tick={{ fontSize: 11, fill: COLORS.textMuted }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip content={<CustomTooltip suffix="%" />} />
                    <Line
                      type="monotone"
                      dataKey="taux"
                      name="% Nouveaux"
                      stroke={COLORS.vermillon}
                      strokeWidth={2.5}
                      dot={{ fill: COLORS.vermillon, strokeWidth: 0, r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Section>
            </div>

            {/* Asile mensuel */}
            <Section
              title="Évolution mensuelle des demandeurs d'asile"
              subtitle="Pointe majeure en janvier 2026 (780 visites) — signal de hausse des flux migratoires"
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={ASILE_MENSUEL}
                  margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis
                    dataKey="mois"
                    tick={{ fontSize: 11, fill: COLORS.textMuted }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="visites"
                    name="Dem. d'asile"
                    fill={COLORS.accent}
                    radius={[6, 6, 0, 0]}
                  >
                    {ASILE_MENSUEL.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={
                          entry.visites >= 700
                            ? COLORS.vermillon
                            : entry.visites >= 550
                              ? COLORS.gold
                              : COLORS.accent
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Section>

            {/* Heatmap — en bas */}
            <Section
              title="Heatmap Heure × Jour de semaine"
              subtitle="Détail de la fréquentation croisée heure / jour"
            >
              <Heatmap />
            </Section>
          </div>
        )}

        {/* ───── Footer ───── */}
        <footer
          style={{
            marginTop: 40,
            padding: "20px 0",
            borderTop: `1px solid ${COLORS.border}`,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0 }}>
            CARI Saint-Laurent · Dashboard Accueil Clientèle · Données: mai 2025
            – fév. 2026
          </p>
          <p
            style={{
              fontSize: 11,
              color: `${COLORS.textMuted}80`,
              marginTop: 4,
            }}
          >
            15 551 visites · 194 jours · 80,2 visites/jour en moyenne
          </p>
        </footer>
      </main>

      <style>{`
        @media (max-width: 640px) {
          .tab-label { font-size: 11px !important; }
          .cari-logo { height: 64px !important; }
          .tab-bar { overflow-x: auto !important; max-width: calc(100vw - 32px) !important; }
          .tab-btn { padding: 6px 10px !important; white-space: nowrap; }
        }
        @media (min-width: 641px) and (max-width: 1023px) {
          .cari-logo { height: 80px !important; }
        }
        @media (min-width: 1024px) {
          .cari-logo { height: 88px !important; }
        }
      `}</style>
    </div>
  );
}

import { useState } from "react";
import { COLORS } from "../../theme";
import { useMembres } from "../../hooks/useMembres";
import AdhesionsDashboard from "./AdhesionsDashboard";
import MembresListe from "./MembresListe";
import MembreDetail from "./MembreDetail";
import MembreForm from "./MembreForm";

const TEAM_PIN = import.meta.env.VITE_TEAM_PIN || "2007";

const NAV_ITEMS = [
  { id: "dashboard", label: "Tableau de bord" },
  { id: "liste", label: "Liste des membres" },
  { id: "nouveau", label: "+ Nouveau membre" },
];

export default function AdhesionsApp() {
  // Auth
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("cari_auth") === "true"
  );
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  // Navigation
  const [page, setPage] = useState("dashboard");
  const [selectedMembreId, setSelectedMembreId] = useState(null);

  // Data
  const { membres, loading, error, refetch } = useMembres();

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === TEAM_PIN) {
      sessionStorage.setItem("cari_auth", "true");
      setAuthed(true);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const openMembre = (id) => {
    setSelectedMembreId(id);
    setPage("detail");
  };

  const goBack = () => {
    setSelectedMembreId(null);
    setPage("liste");
  };

  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", background: COLORS.bg, display: "flex",
        alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif",
      }}>
        <form onSubmit={handleLogin} style={{
          background: COLORS.card, padding: 40, borderRadius: 16,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          border: `1px solid ${COLORS.border}`,
        }}>
          <img src="/CARI_Horizontal_RGB_reverse.png" alt="CARI" style={{ height: 48, marginBottom: 8 }} />
          <h2 style={{ color: COLORS.text, margin: 0, fontSize: 18 }}>Gestion des adhésions</h2>
          <input
            type="password"
            placeholder="Code PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={{
              padding: "10px 16px", borderRadius: 8, border: `2px solid ${pinError ? COLORS.vermillon : COLORS.border}`,
              background: COLORS.bg, color: COLORS.text, fontSize: 16, textAlign: "center",
              width: 160, outline: "none",
            }}
            autoFocus
          />
          <button type="submit" style={{
            padding: "10px 32px", borderRadius: 8, border: "none",
            background: COLORS.accent, color: COLORS.bg, fontWeight: 700,
            fontSize: 15, cursor: "pointer",
          }}>
            Entrer
          </button>
          {pinError && <span style={{ color: COLORS.vermillon, fontSize: 13 }}>Code incorrect</span>}
        </form>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg,
      fontFamily: "'DM Sans', sans-serif", color: COLORS.text,
    }}>
      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 24px", borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/CARI_Horizontal_RGB_reverse.png" alt="CARI" style={{ height: 36 }} />
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.accent }}>
            Gestion des adhésions
          </h1>
        </div>
        <nav style={{ display: "flex", gap: 4 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); setSelectedMembreId(null); }}
              style={{
                padding: "8px 16px", borderRadius: 8, border: "none",
                background: page === item.id ? COLORS.accent : "transparent",
                color: page === item.id ? COLORS.bg : COLORS.textMuted,
                fontWeight: page === item.id ? 700 : 500,
                fontSize: 14, cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <a href="/" style={{ color: COLORS.textMuted, fontSize: 13, textDecoration: "none" }}>
          ← Dashboard principal
        </a>
      </header>

      {/* Content */}
      <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: COLORS.textMuted }}>
            Chargement des membres...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: 60, color: COLORS.vermillon }}>
            Erreur : {error}
          </div>
        ) : page === "dashboard" ? (
          <AdhesionsDashboard membres={membres} onNavigate={setPage} />
        ) : page === "liste" ? (
          <MembresListe membres={membres} onSelect={openMembre} />
        ) : page === "detail" && selectedMembreId ? (
          <MembreDetail
            membre={membres.find((m) => m.id === selectedMembreId)}
            onBack={goBack}
            onRefresh={refetch}
          />
        ) : page === "nouveau" ? (
          <MembreForm onSaved={() => { refetch(); setPage("liste"); }} />
        ) : (
          <AdhesionsDashboard membres={membres} onNavigate={setPage} />
        )}
      </main>
    </div>
  );
}

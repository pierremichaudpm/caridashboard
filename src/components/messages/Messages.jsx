import { useState, useEffect } from "react";
import { COLORS } from "../../theme";
import { supabase } from "../../lib/supabase";

const TEAM_PIN = import.meta.env.VITE_TEAM_PIN || "2007";

const EQUIPES = {
  "Groupe 1": {
    chef: { nom: "Natalia Tonofrei", email: "ntonofrei@cari.qc.ca" },
    conseillers: [
      "Olga Elena Olivares Ramirez", "Diego Jimenez", "Isabel Santamaria",
      "Ikram Houmair", "Trisha Luckheenarain", "Iryna Sola",
      "Iryna Kravchenko", "Li Xin Wang", "Hala Al Husseini",
    ],
  },
  "Groupe 2": {
    chef: { nom: "Priscilla Bheekha-Canakiah", email: "pbheekha-canakiah@cari.qc.ca" },
    conseillers: [
      "Dian Diallo", "Kani Touré", "Sadia Milsaint", "Merzouk Dahmoun",
      "Najla Bourara", "Rania Khaddour", "Yiqiao Ran", "Imane Amriou", "Fatou Kine Ciss",
    ],
  },
  "Autres": {
    chef: null,
    conseillers: [
      "Aminata Christine Niane", "Faten Makhlouf", "Abeer Halabi",
      "Nadine Jabbour", "Laurence Normand", "Tierry Nguiamba",
    ],
  },
};

const TOUS_NOMS = Object.entries(EQUIPES).flatMap(([, { chef, conseillers }]) =>
  [...(chef ? [chef.nom] : []), ...conseillers],
);

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${COLORS.border}`,
  background: COLORS.bg, color: COLORS.text, fontSize: 15, fontFamily: "'DM Sans', sans-serif",
  outline: "none", boxSizing: "border-box",
};

function PinScreen({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === TEAM_PIN) {
      sessionStorage.setItem("cari_auth", "1");
      onUnlock();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <form onSubmit={handleSubmit} style={{ background: COLORS.card, borderRadius: 20, padding: "32px 24px", border: `1px solid ${COLORS.border}`, width: 340, maxWidth: "90vw", textAlign: "center" }}>
        <img src="/CARI_Horizontal_RGB_reverse.png" alt="CARI" style={{ height: 60, marginBottom: 20 }} />
        <h2 style={{ color: COLORS.text, fontSize: 18, marginBottom: 8 }}>Messages</h2>
        <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 24 }}>Entrez le code d'accès</p>
        <input type="password" inputMode="numeric" value={pin} onChange={(e) => { setPin(e.target.value); setError(false); }}
          placeholder="Code PIN" autoFocus maxLength={10}
          style={{ ...inputStyle, textAlign: "center", fontSize: 24, letterSpacing: 8, marginBottom: 16 }} />
        {error && <p style={{ color: COLORS.vermillon, fontSize: 13, marginBottom: 12 }}>Code incorrect</p>}
        <button type="submit" style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: COLORS.accent, color: "#263164", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Accéder
        </button>
      </form>
    </div>
  );
}

export default function Messages() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("cari_auth") === "1");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState("");

  const fetchMessages = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase
      .from("messages_accueil")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) console.error("Erreur fetch messages:", error);
    else setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchMessages();
  }, [authed]);

  const marquerLu = async (id) => {
    if (!supabase) return;
    await supabase.from("messages_accueil").update({ lu: true }).eq("id", id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, lu: true } : m));
  };

  const marquerNonLu = async (id) => {
    if (!supabase) return;
    await supabase.from("messages_accueil").update({ lu: false }).eq("id", id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, lu: false } : m));
  };

  const filtres = filtre ? messages.filter(m => m.conseiller === filtre) : messages;
  const nonLus = filtres.filter(m => !m.lu).length;

  const formatDate = (iso) => {
    const d = new Date(iso);
    const jour = d.toLocaleDateString("fr-CA", { weekday: "short", day: "numeric", month: "short" });
    const heure = d.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" });
    return `${jour} à ${heure}`;
  };

  if (!authed) return <PinScreen onUnlock={() => setAuthed(true)} />;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <header style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.card, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <img src="/CARI_Horizontal_RGB_reverse.png" alt="CARI" style={{ height: 80 }} />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Messages</span>
        </div>
        <a href="/saisie" style={{ color: COLORS.accent, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
          ← Saisie
        </a>
      </header>

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "16px 16px 40px" }}>
        {/* Filtre + compteur */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <select value={filtre} onChange={(e) => setFiltre(e.target.value)} style={{ ...inputStyle, width: "auto", flex: 1, minWidth: 200 }}>
            <option value="">Tous les conseillers</option>
            {Object.entries(EQUIPES).map(([groupe, { chef, conseillers }]) => (
              <optgroup key={groupe} label={groupe}>
                {chef && <option value={chef.nom}>{chef.nom}</option>}
                {conseillers.map(c => <option key={c} value={c}>{c}</option>)}
              </optgroup>
            ))}
          </select>
          <div style={{
            background: nonLus > 0 ? "rgba(255,191,63,0.15)" : "rgba(108,186,199,0.1)",
            border: `1px solid ${nonLus > 0 ? COLORS.gold : COLORS.border}`,
            borderRadius: 10, padding: "10px 16px", fontSize: 14, fontWeight: 600,
            color: nonLus > 0 ? COLORS.gold : COLORS.textMuted, whiteSpace: "nowrap",
          }}>
            {nonLus > 0 ? `${nonLus} non lu${nonLus > 1 ? "s" : ""}` : "Tous lus"}
          </div>
          <button onClick={fetchMessages} style={{
            padding: "10px 16px", borderRadius: 10, border: `1px solid ${COLORS.border}`,
            background: "transparent", color: COLORS.textMuted, fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>
            Rafraîchir
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: 40, color: COLORS.textMuted }}>Chargement...</div>
        )}

        {!loading && filtres.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: COLORS.textMuted, fontSize: 15 }}>
            Aucun message{filtre ? ` pour ${filtre}` : ""}
          </div>
        )}

        {/* Liste des messages */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtres.map(m => (
            <div key={m.id} style={{
              background: COLORS.card, borderRadius: 14, padding: "18px 20px",
              border: `1px solid ${m.lu ? COLORS.border : COLORS.gold}`,
              borderLeft: `4px solid ${m.lu ? COLORS.border : COLORS.gold}`,
              transition: "all 0.15s",
            }}>
              {/* En-tête : date + statut */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 12, color: COLORS.textMuted }}>{formatDate(m.created_at)}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6,
                  background: m.lu ? "rgba(108,186,199,0.1)" : "rgba(255,191,63,0.15)",
                  color: m.lu ? COLORS.textMuted : COLORS.gold,
                }}>
                  {m.lu ? "Lu" : "Non lu"}
                </span>
              </div>

              {/* Visiteur → Conseiller */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 600, color: COLORS.text }}>{m.nom_visiteur}</span>
                {m.numero_reference && <span style={{ fontSize: 12, color: COLORS.textMuted }}>({m.numero_reference})</span>}
                <span style={{ color: COLORS.textMuted }}>→</span>
                <span style={{ fontWeight: 600, color: COLORS.accent }}>{m.conseiller}</span>
              </div>

              {/* Coordonnées visiteur */}
              {(m.telephone || m.email_visiteur) && (
                <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 8, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {m.telephone && <span>Tél: {m.telephone}</span>}
                  {m.email_visiteur && <span>Courriel: {m.email_visiteur}</span>}
                </div>
              )}

              {/* Message */}
              <div style={{
                background: COLORS.bg, borderRadius: 10, padding: "12px 16px",
                fontSize: 14, color: COLORS.text, whiteSpace: "pre-wrap", lineHeight: 1.5,
                marginBottom: 10,
              }}>
                {m.message}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                {!m.lu ? (
                  <button onClick={() => marquerLu(m.id)} style={{
                    padding: "6px 14px", borderRadius: 8, border: `1px solid ${COLORS.accent}`,
                    background: "transparent", color: COLORS.accent, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  }}>
                    Marquer comme lu
                  </button>
                ) : (
                  <button onClick={() => marquerNonLu(m.id)} style={{
                    padding: "6px 14px", borderRadius: 8, border: `1px solid ${COLORS.border}`,
                    background: "transparent", color: COLORS.textMuted, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  }}>
                    Marquer non lu
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <style>{`
        @media (max-width: 480px) {
          header { padding: 14px 16px !important; gap: 10px !important; }
          header img { height: 60px !important; }
        }
      `}</style>
    </div>
  );
}

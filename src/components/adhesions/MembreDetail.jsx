import { useState } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Tag, Edit2, Save, X } from "lucide-react";
import { COLORS } from "../../theme";
import { supabase } from "../../lib/supabase";

function Field({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
      <Icon size={16} color={COLORS.textMuted} style={{ marginTop: 2, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 11, color: COLORS.textMuted }}>{label}</div>
        <div style={{ fontSize: 14 }}>{value}</div>
      </div>
    </div>
  );
}

export default function MembreDetail({ membre, onBack, onRefresh }) {
  const [renewing, setRenewing] = useState(false);

  if (!membre) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: COLORS.textMuted }}>
        Membre non trouvé.
        <button onClick={onBack} style={{ display: "block", margin: "16px auto", padding: "8px 20px", borderRadius: 8, border: "none", background: COLORS.accent, color: COLORS.bg, cursor: "pointer" }}>
          Retour
        </button>
      </div>
    );
  }

  const isExpired = membre.date_fin && new Date(membre.date_fin) < new Date();

  const handleRenew = async () => {
    if (!supabase) return;
    setRenewing(true);
    const today = new Date();
    const newFin = new Date(today);
    newFin.setFullYear(newFin.getFullYear() + 1);

    const { error } = await supabase
      .from("membres")
      .update({
        date_renouvellement: today.toISOString().split("T")[0],
        date_fin: newFin.toISOString().split("T")[0],
        etat: "R",
        updated_at: new Date().toISOString(),
      })
      .eq("id", membre.id);

    if (error) {
      alert("Erreur : " + error.message);
    } else {
      onRefresh();
    }
    setRenewing(false);
  };

  const presences = membre.presences_aga
    ? typeof membre.presences_aga === "string"
      ? JSON.parse(membre.presences_aga)
      : membre.presences_aga
    : {};

  return (
    <div>
      <button onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 6, background: "none",
        border: "none", color: COLORS.textMuted, cursor: "pointer", marginBottom: 16, fontSize: 14,
      }}>
        <ArrowLeft size={16} /> Retour à la liste
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Info card */}
        <div style={{
          background: COLORS.card, borderRadius: 12, padding: 24,
          border: `1px solid ${COLORS.border}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
                {membre.prenom} {membre.nom}
              </h2>
              {membre.titre && <span style={{ color: COLORS.textMuted, fontSize: 13 }}>{membre.titre}</span>}
            </div>
            <span style={{
              fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 10,
              background: isExpired ? `${COLORS.vermillon}22` : `${COLORS.accent}22`,
              color: isExpired ? COLORS.vermillon : COLORS.accent,
            }}>
              {isExpired ? "Expiré" : "Actif"}
            </span>
          </div>

          <Field icon={Mail} label="Courriel" value={membre.email} />
          <Field icon={Phone} label="Téléphone" value={membre.telephone} />
          <Field icon={MapPin} label="Adresse" value={
            [membre.adresse, membre.num_app ? `app. ${membre.num_app}` : null, membre.ville, membre.code_postal].filter(Boolean).join(", ")
          } />
          <Field icon={Tag} label="Type" value={membre.type_membre} />
          {membre.detail_type && <Field icon={Tag} label="Détail" value={membre.detail_type} />}
          <Field icon={Tag} label="Langue" value={membre.langue} />
        </div>

        {/* Membership card */}
        <div style={{
          background: COLORS.card, borderRadius: 12, padding: 24,
          border: `1px solid ${COLORS.border}`,
        }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>Adhésion</h3>

          <Field icon={Calendar} label="Date d'adhésion" value={membre.date_adhesion} />
          <Field icon={Calendar} label="Dernier renouvellement" value={membre.date_renouvellement} />
          <Field icon={Calendar} label="Date de fin" value={membre.date_fin} />
          <Field icon={Tag} label="État" value={membre.etat === "N" ? "Nouveau" : membre.etat === "R" ? "Renouvellement" : membre.etat} />

          {/* Renew button */}
          <button
            onClick={handleRenew}
            disabled={renewing}
            style={{
              width: "100%", marginTop: 16, padding: "12px 20px",
              borderRadius: 8, border: "none", cursor: "pointer",
              background: isExpired ? COLORS.vermillon : COLORS.accent,
              color: "#fff", fontWeight: 700, fontSize: 14,
              opacity: renewing ? 0.6 : 1,
            }}
          >
            {renewing ? "Renouvellement..." : isExpired ? "Renouveler l'adhésion" : "Renouveler (1 an)"}
          </button>

          {/* AGA Presences */}
          {Object.keys(presences).length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 13, color: COLORS.textMuted }}>Présences AGA/AGE</h4>
              {Object.entries(presences).map(([event, present]) => (
                <div key={event} style={{
                  display: "flex", justifyContent: "space-between", padding: "4px 0",
                  fontSize: 13, borderBottom: `1px solid ${COLORS.border}`,
                }}>
                  <span>{event}</span>
                  <span style={{ color: present ? COLORS.accent : COLORS.vermillon }}>
                    {present ? "Présent" : "Absent"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

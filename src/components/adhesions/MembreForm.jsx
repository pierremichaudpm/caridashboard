import { useState } from "react";
import { COLORS } from "../../theme";
import { supabase } from "../../lib/supabase";

const INITIAL = {
  titre: "",
  nom: "",
  prenom: "",
  telephone: "",
  email: "",
  adresse: "",
  num_app: "",
  ville: "",
  code_postal: "",
  langue: "Fr",
  type_membre: "individuel",
  detail_type: "",
};

const inputStyle = {
  padding: "10px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`,
  background: COLORS.bg, color: COLORS.text, fontSize: 14, width: "100%",
  boxSizing: "border-box", outline: "none",
};

const labelStyle = {
  display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4, fontWeight: 600,
};

export default function MembreForm({ onSaved }) {
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.prenom.trim()) {
      setError("Nom et prénom sont obligatoires");
      return;
    }
    if (!supabase) {
      setError("Supabase non configuré");
      return;
    }

    setSaving(true);
    setError(null);

    const today = new Date();
    const finDate = new Date(today);
    finDate.setFullYear(finDate.getFullYear() + 1);

    const record = {
      ...form,
      email: form.email.trim().toLowerCase() || null,
      telephone: form.telephone.trim() || null,
      num_app: form.num_app.trim() || null,
      date_adhesion: today.toISOString().split("T")[0],
      date_fin: finDate.toISOString().split("T")[0],
      etat: "N",
      presences_aga: {},
    };

    const { error: err } = await supabase.from("membres").insert([record]);

    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
      setForm(INITIAL);
      setTimeout(() => {
        setSuccess(false);
        onSaved();
      }, 1500);
    }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700 }}>Nouveau membre</h2>

      <form onSubmit={handleSubmit} style={{
        background: COLORS.card, borderRadius: 12, padding: 24,
        border: `1px solid ${COLORS.border}`,
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        {/* Row: Titre + Nom + Prénom */}
        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Titre</label>
            <select value={form.titre} onChange={set("titre")} style={inputStyle}>
              <option value="">—</option>
              <option value="M.">M.</option>
              <option value="Mme">Mme</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Nom *</label>
            <input value={form.nom} onChange={set("nom")} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Prénom *</label>
            <input value={form.prenom} onChange={set("prenom")} style={inputStyle} required />
          </div>
        </div>

        {/* Email + Tel */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Courriel</label>
            <input type="email" value={form.email} onChange={set("email")} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Téléphone</label>
            <input value={form.telephone} onChange={set("telephone")} placeholder="514-xxx-xxxx" style={inputStyle} />
          </div>
        </div>

        {/* Address */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 12 }}>
          <div>
            <label style={labelStyle}>Adresse</label>
            <input value={form.adresse} onChange={set("adresse")} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>App.</label>
            <input value={form.num_app} onChange={set("num_app")} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Ville</label>
            <input value={form.ville} onChange={set("ville")} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Code postal</label>
            <input value={form.code_postal} onChange={set("code_postal")} placeholder="H4L 1A1" style={inputStyle} />
          </div>
        </div>

        {/* Type + Langue */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Langue</label>
            <select value={form.langue} onChange={set("langue")} style={inputStyle}>
              <option value="Fr">Français</option>
              <option value="Eng">English</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Type de membre</label>
            <select value={form.type_membre} onChange={set("type_membre")} style={inputStyle}>
              <option value="individuel">Individuel</option>
              <option value="corporatif">Corporatif</option>
              <option value="honoraire">Honoraire</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Détail type</label>
            <input value={form.detail_type} onChange={set("detail_type")} style={inputStyle} />
          </div>
        </div>

        {error && <div style={{ color: COLORS.vermillon, fontSize: 13 }}>{error}</div>}
        {success && <div style={{ color: COLORS.accent, fontSize: 13, fontWeight: 600 }}>Membre ajouté avec succès !</div>}

        <button type="submit" disabled={saving} style={{
          padding: "12px 24px", borderRadius: 8, border: "none",
          background: COLORS.accent, color: COLORS.bg, fontWeight: 700,
          fontSize: 15, cursor: "pointer", opacity: saving ? 0.6 : 1,
        }}>
          {saving ? "Enregistrement..." : "Ajouter le membre"}
        </button>
      </form>
    </div>
  );
}

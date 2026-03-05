import { useState, useRef } from "react";
import { COLORS } from "../../theme";
import { supabase } from "../../lib/supabase";

const TEAM_PIN = import.meta.env.VITE_TEAM_PIN || "2007";

const SERVICES_LIST = [
  { id: 1, nom: "Accueil et intégration" },
  { id: 2, nom: "Assermentation" },
  { id: 3, nom: "Emploi" },
  { id: 4, nom: "Francisation" },
  { id: 5, nom: "Formation et vie communautaire" },
  { id: 6, nom: "Parents-Jeunesse" },
  { id: 7, nom: "Femmes du Monde" },
  { id: 8, nom: "Espace Hommes" },
  { id: 9, nom: "ICI Santé" },
];

const SOUS_SERVICES = {
  "Accueil et intégration": {
    "Installation PASI": [
      "Carte d'assurance maladie (RAMQ)", "Numéro d'assurance sociale (NAS)", "Inscription garderie",
      "Inscription scolaire", "Compte bancaire", "Permis de conduire", "Recherche de logement",
      "Assurance maladie privée", "Assurance médicaments", "Médecin de famille",
      "Premières démarches d'installation", "Organisme de régionalisation",
    ],
    "Post-installation PASI": [
      "Renouvellement de documents officiels", "Déménagement et logement",
      "Connaissance société québécoise", "Soutien social et matériel", "Citoyenneté",
      "Finances personnelles / allocations", "Éducation des enfants", "Santé",
      "Réorientation professionnelle / reconnaissance", "Interprétariat et traduction",
      "Séances d'information", "Médiation interculturelle", "Support psychosocial",
    ],
    "Immigration": [
      "Demande résidence permanente", "Demande CSQ (sélection permanente)",
      "Modification permis d'études", "Prolongation séjour étudiant",
      "Prolongation séjour travailleur temporaire", "Permis de travail post-diplôme",
      "Carte résident permanent", "Titre de voyage", "Vérification/remplacement document immigration",
      "Renouvellement carte RP", "Évaluation comparative (diplômes)", "Parrainage familial",
    ],
    "Immigration DA": [
      "Renouvellement permis de travail (DA)", "Renouvellement document DA",
      "Vérification biométriques (DA)", "Aide sociale (DA)",
    ],
    "Divers": [
      "Aide sociale (non-DA)", "Allocation logement", "Certificat de naissance",
      "Problèmes bail/logement", "Divorce/séparation", "Dossier Hydro-Québec",
      "Aide juridique", "Pension vieillesse", "Déclaration de revenus", "Camp de vacances familial",
    ],
  },
  Assermentation: {
    "Types": [
      "Copies conformes", "Déclaration solennelle", "Lettre d'invitation",
      "Autorisation de voyage", "Procuration", "Déclaration de célibat",
    ],
  },
  Emploi: {
    "Services": [
      "Reconnaissance des diplômes et compétences", "Production de CV format québécois",
      "Préparation aux entrevues", "Réseautage professionnel",
      "Ateliers de recherche d'emploi", "Placement en emploi et stages", "Soutien personnalisé",
    ],
  },
  "ICI Santé": {
    "Services": [
      "RDV médical", "Accompagnement/interprétariat médical", "Explication système de santé",
      "RAMQ réfugiés acceptés", "Ateliers thématiques santé",
    ],
  },
};

const STATUTS = [
  "Demandeur d'asile", "Demandeur d'asile (accepté)", "Résident permanent",
  "Permis de travail", "Permis de travail fermé", "Permis d'étude",
  "Citoyen canadien", "Visiteur", "Autre",
];

const EQUIPES = {
  "Groupe 1": {
    chef: { nom: "Natalia Tonofrei", email: "ntonofrei@cari.qc.ca" },
    conseillers: [
      { nom: "Olga Elena Olivares Ramirez", email: "oolivares@cari.qc.ca" },
      { nom: "Diego Jimenez", email: "djimenez@cari.qc.ca" },
      { nom: "Isabel Santamaria", email: "isantamaria@cari.qc.ca" },
      { nom: "Ikram Houmair", email: "ihoumair@cari.qc.ca" },
      { nom: "Trisha Luckheenarain", email: "tluckheenarain@cari.qc.ca" },
      { nom: "Iryna Sola", email: "isola@cari.qc.ca" },
      { nom: "Iryna Kravchenko", email: "ikravchenko@cari.qc.ca" },
      { nom: "Li Xin Wang", email: "lwang@cari.qc.ca" },
      { nom: "Hala Al Husseini", email: "halhusseini@cari.qc.ca" },
    ],
  },
  "Groupe 2": {
    chef: { nom: "Priscilla Bheekha-Canakiah", email: "pbheekha-canakiah@cari.qc.ca" },
    conseillers: [
      { nom: "Dian Diallo", email: "ddiallo@cari.qc.ca" },
      { nom: "Kani Touré", email: "ktoure@cari.qc.ca" },
      { nom: "Sadia Milsaint", email: "smilsaint@cari.qc.ca" },
      { nom: "Merzouk Dahmoun", email: "mdahmoun@cari.qc.ca" },
      { nom: "Najla Bourara", email: "nbourara@cari.qc.ca" },
      { nom: "Rania Khaddour", email: "rkhaddour@cari.qc.ca" },
      { nom: "Yiqiao Ran", email: "yran@cari.qc.ca" },
      { nom: "Imane Amriou", email: "iamriou@cari.qc.ca" },
      { nom: "Fatou Kine Ciss", email: "fkciss@cari.qc.ca" },
    ],
  },
  "Autres": {
    chef: null,
    conseillers: [
      { nom: "Faten Makhlouf", email: "fmakhlouf@cari.qc.ca" },
      { nom: "Abeer Halabi", email: "ahalabi@cari.qc.ca" },
      { nom: "Nadine Jabbour", email: "njabbour@cari.qc.ca" },
    ],
  },
};

// Liste plate pour les dropdowns + lookup email/chef
const TOUS_CONSEILLERS = Object.entries(EQUIPES).flatMap(([groupe, { chef, conseillers }]) =>
  [...(chef ? [{ ...chef, groupe, role: "chef" }] : []), ...conseillers.map(c => ({ ...c, groupe, role: "conseiller" }))],
);

const getChefEmail = (conseillerNom) => {
  for (const { chef, conseillers } of Object.values(EQUIPES)) {
    const found = conseillers.find(c => c.nom === conseillerNom) || (chef && chef.nom === conseillerNom ? chef : null);
    if (found && chef) return chef.email;
  }
  return null;
};

// Ancienne liste simple pour l'onglet Saisie visite (rétrocompatibilité)
const CONSEILLERS = TOUS_CONSEILLERS.map(c => c.nom);

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${COLORS.border}`,
  background: COLORS.bg, color: COLORS.text, fontSize: 15, fontFamily: "'DM Sans', sans-serif",
  outline: "none", boxSizing: "border-box",
};

const labelStyle = { fontSize: 13, fontWeight: 600, color: COLORS.textMuted, marginBottom: 6, display: "block" };

const btnStyle = (active) => ({
  padding: "10px 20px", borderRadius: 10, border: `1px solid ${active ? COLORS.accent : COLORS.border}`,
  background: active ? COLORS.accent : "transparent", color: active ? "#263164" : COLORS.textMuted,
  fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  transition: "all 0.15s",
});

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
        <h2 style={{ color: COLORS.text, fontSize: 18, marginBottom: 8 }}>Saisie des visites</h2>
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

export default function Saisie() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("cari_auth") === "1");
  const [activeTab, setActiveTab] = useState("saisie");

  // — Saisie visite state —
  const [conseiller, setConseiller] = useState("");
  const [conseillerAutre, setConseillerAutre] = useState("");
  const [service, setService] = useState("");
  const [sousService, setSousService] = useState("");
  const [statut, setStatut] = useState("");
  const [nouveau, setNouveau] = useState(null);
  const [avecRdv, setAvecRdv] = useState(null);
  const [nomClient, setNomClient] = useState("");
  const [telephone, setTelephone] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [dernieres, setDernieres] = useState([]);
  const serviceRef = useRef(null);

  // — Message conseiller state —
  const [msgNom, setMsgNom] = useState("");
  const [msgRef, setMsgRef] = useState("");
  const [msgEmail, setMsgEmail] = useState("");
  const [msgTel, setMsgTel] = useState("");
  const [msgConseiller, setMsgConseiller] = useState("");
  const [msgTexte, setMsgTexte] = useState("");
  const [msgSaving, setMsgSaving] = useState(false);
  const [msgConfirmation, setMsgConfirmation] = useState(null);
  const [derniersMessages, setDerniersMessages] = useState([]);

  const isAssermentation = service === "Assermentation";
  const sousServicesGroups = SOUS_SERVICES[service] || null;
  const conseillerFinal = conseiller === "__autre" ? conseillerAutre : conseiller;

  const resetForm = () => {
    setService(""); setSousService(""); setStatut(""); setNouveau(null);
    setAvecRdv(null); setNomClient(""); setTelephone(""); setNotes("");
    // On garde le conseiller sélectionné entre les saisies
    setTimeout(() => serviceRef.current?.focus(), 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service || !statut) return;

    setSaving(true);

    try {
      if (supabase) {
        const serviceObj = SERVICES_LIST.find(s => s.nom === service);
        await supabase.from("visites").insert({
          service_id: serviceObj?.id || 1,
          statut_immigration: statut,
          nouveau_client: nouveau ?? false,
          avec_rdv: avecRdv ?? false,
          nom_client: nomClient || null,
          telephone: telephone || null,
          notes: notes || null,
          conseiller: conseillerFinal || null,
          source: "saisie",
        });
      }
    } catch (err) {
      console.error("Erreur Supabase:", err);
    }

    const now = new Date();
    const heure = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setDernieres(prev => [
      { heure, conseiller: conseillerFinal, service, statut: statut.split(" ")[0], nouveau, id: Date.now() },
      ...prev.slice(0, 9),
    ]);

    setConfirmation("Visite enregistrée !");
    setTimeout(() => setConfirmation(null), 2500);
    resetForm();
    setSaving(false);
  };

  // — Message conseiller handlers —
  const resetMessageForm = () => {
    setMsgNom(""); setMsgRef(""); setMsgEmail(""); setMsgTel(""); setMsgTexte("");
    // On garde le conseiller sélectionné entre les messages
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!msgNom || !msgConseiller || !msgTexte) return;

    setMsgSaving(true);

    try {
      if (supabase) {
        await supabase.from("messages_accueil").insert({
          nom_visiteur: msgNom,
          numero_reference: msgRef || null,
          email_visiteur: msgEmail || null,
          telephone: msgTel || null,
          conseiller: msgConseiller,
          message: msgTexte,
        });
      }
    } catch (err) {
      console.error("Erreur Supabase:", err);
    }

    const now = new Date();
    const heure = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setDerniersMessages(prev => [
      { heure, nom: msgNom, ref: msgRef, conseiller: msgConseiller, message: msgTexte.slice(0, 50), id: Date.now() },
      ...prev.slice(0, 9),
    ]);

    setMsgConfirmation("Message envoyé !");
    setTimeout(() => setMsgConfirmation(null), 2500);
    resetMessageForm();
    setMsgSaving(false);
  };

  if (!authed) return <PinScreen onUnlock={() => setAuthed(true)} />;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="saisie-header" style={{ padding: "20px 24px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.card, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <img src="/CARI_Horizontal_RGB_reverse.png" alt="CARI" className="saisie-logo" style={{ height: 100 }} />
        <span className="saisie-title" style={{ fontSize: 26, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
          {activeTab === "saisie" ? "Saisie des visites" : "Message conseiller"}
        </span>
      </header>

      {/* Onglets */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "16px 16px 0" }}>
        <div style={{ display: "flex", gap: 0, borderRadius: 12, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
          {[
            { key: "saisie", label: "Saisie visite" },
            { key: "message", label: "Message conseiller" },
          ].map(tab => (
            <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: "12px 16px", border: "none",
                background: activeTab === tab.key ? COLORS.accent : COLORS.card,
                color: activeTab === tab.key ? "#263164" : COLORS.textMuted,
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: 600, margin: "0 auto", padding: "16px 16px 20px" }}>
        {/* Confirmation (saisie) */}
        {activeTab === "saisie" && confirmation && (
          <div style={{ background: "rgba(108,186,199,0.15)", border: `1px solid ${COLORS.accent}`, borderRadius: 12, padding: "14px 20px", marginBottom: 16, textAlign: "center", fontSize: 15, fontWeight: 600, color: COLORS.accent }}>
            {confirmation}
          </div>
        )}

        {/* Confirmation (message) */}
        {activeTab === "message" && msgConfirmation && (
          <div style={{ background: "rgba(108,186,199,0.15)", border: `1px solid ${COLORS.accent}`, borderRadius: 12, padding: "14px 20px", marginBottom: 16, textAlign: "center", fontSize: 15, fontWeight: 600, color: COLORS.accent }}>
            {msgConfirmation}
          </div>
        )}

        {/* ═══ ONGLET SAISIE ═══ */}
        {activeTab === "saisie" && (
        <>
        <form onSubmit={handleSubmit} style={{ background: COLORS.card, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Conseiller */}
          <div>
            <label style={labelStyle}>Conseiller rencontré</label>
            <select value={conseiller} onChange={(e) => { setConseiller(e.target.value); if (e.target.value !== "__autre") setConseillerAutre(""); }} style={inputStyle}>
              <option value="">— Aucun / Non précisé —</option>
              {CONSEILLERS.map(c => <option key={c} value={c}>{c}</option>)}
              <option value="__autre">Autre...</option>
            </select>
            {conseiller === "__autre" && (
              <input type="text" value={conseillerAutre} onChange={(e) => setConseillerAutre(e.target.value)}
                placeholder="Nom du conseiller" autoFocus
                style={{ ...inputStyle, marginTop: 8 }} />
            )}
          </div>

          <hr style={{ border: "none", borderTop: `1px solid ${COLORS.border}`, margin: "4px 0" }} />

          {/* Service */}
          <div>
            <label style={labelStyle}>Service demandé *</label>
            <select ref={serviceRef} value={service} onChange={(e) => { setService(e.target.value); setSousService(""); }} required style={inputStyle}>
              <option value="">— Choisir le service —</option>
              {SERVICES_LIST.map(s => <option key={s.id} value={s.nom}>{s.nom}</option>)}
            </select>
          </div>

          {/* Sous-service conditionnel */}
          {sousServicesGroups && (
            <div>
              <label style={labelStyle}>Sous-service</label>
              <select value={sousService} onChange={(e) => setSousService(e.target.value)} style={inputStyle}>
                <option value="">— Optionnel —</option>
                {Object.entries(sousServicesGroups).map(([group, items]) => (
                  <optgroup key={group} label={group}>
                    {items.map(item => <option key={item} value={item}>{item}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
          )}

          <hr style={{ border: "none", borderTop: `1px solid ${COLORS.border}`, margin: "4px 0" }} />

          {/* Statut */}
          <div>
            <label style={labelStyle}>Statut d'immigration *</label>
            <select value={statut} onChange={(e) => setStatut(e.target.value)} required style={inputStyle}>
              <option value="">— Choisir le statut —</option>
              {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Nouveau client */}
          <div>
            <label style={labelStyle}>Nouveau client?</label>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setNouveau(true)} style={btnStyle(nouveau === true)}>Oui</button>
              <button type="button" onClick={() => setNouveau(false)} style={btnStyle(nouveau === false)}>Non</button>
            </div>
          </div>

          {/* Avec RDV */}
          <div>
            <label style={labelStyle}>Avec rendez-vous?</label>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setAvecRdv(true)} style={btnStyle(avecRdv === true)}>Oui</button>
              <button type="button" onClick={() => setAvecRdv(false)} style={btnStyle(avecRdv === false)}>Non</button>
            </div>
          </div>

          {/* Nom + Tél (pas en mode assermentation) */}
          {!isAssermentation && (
            <>
              <hr style={{ border: "none", borderTop: `1px solid ${COLORS.border}`, margin: "4px 0" }} />
              <div>
                <label style={labelStyle}>Nom client</label>
                <input type="text" value={nomClient} onChange={(e) => setNomClient(e.target.value)} placeholder="Optionnel" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Téléphone</label>
                <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Optionnel" style={inputStyle} />
              </div>
            </>
          )}

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optionnel" rows={2} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {/* Submit */}
          <button type="submit" disabled={saving || !service || !statut}
            style={{
              width: "100%", padding: 16, borderRadius: 14, border: "none",
              background: (!service || !statut) ? COLORS.border : COLORS.accent,
              color: (!service || !statut) ? COLORS.textMuted : "#263164",
              fontSize: 17, fontWeight: 700, cursor: (!service || !statut) ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "all 0.2s",
              boxShadow: (service && statut) ? `0 4px 20px ${COLORS.accent}33` : "none",
            }}>
            {saving ? "Enregistrement..." : "ENREGISTRER LA VISITE"}
          </button>
        </form>

        {/* Dernières saisies */}
        {dernieres.length > 0 && (
          <div style={{ marginTop: 24, background: COLORS.card, borderRadius: 16, padding: 20, border: `1px solid ${COLORS.border}` }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: COLORS.textMuted, marginBottom: 12 }}>Dernières saisies</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {dernieres.map(d => (
                <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: COLORS.bg, borderRadius: 8, fontSize: 13, flexWrap: "wrap" }}>
                  <span style={{ color: COLORS.accent, fontWeight: 600 }}>{d.heure}</span>
                  <span style={{ color: COLORS.text, fontWeight: 500 }}>{d.conseiller || "—"}</span>
                  <span style={{ color: COLORS.textMuted }}>·</span>
                  <span style={{ color: COLORS.text }}>{d.service}</span>
                  <span style={{ color: COLORS.textMuted }}>·</span>
                  <span style={{ color: COLORS.textMuted }}>{d.statut}</span>
                  {d.nouveau && <span style={{ background: "rgba(108,186,199,0.2)", color: COLORS.accent, padding: "1px 6px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>nouveau</span>}
                </div>
              ))}
            </div>
          </div>
        )}
        </>
        )}

        {/* ═══ ONGLET MESSAGE ═══ */}
        {activeTab === "message" && (
        <>
        <form onSubmit={handleMessageSubmit} style={{ background: COLORS.card, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Nom visiteur */}
          <div>
            <label style={labelStyle}>Nom du visiteur *</label>
            <input type="text" value={msgNom} onChange={(e) => setMsgNom(e.target.value)} placeholder="Nom complet" required style={inputStyle} />
          </div>

          {/* Numéro de référence */}
          <div>
            <label style={labelStyle}>No référence (Ceriges ou GSI)</label>
            <input type="text" value={msgRef} onChange={(e) => setMsgRef(e.target.value)} placeholder="ex: 47859 ou G26025987413" style={inputStyle} />
          </div>

          {/* Email visiteur */}
          <div>
            <label style={labelStyle}>Courriel du visiteur</label>
            <input type="email" value={msgEmail} onChange={(e) => setMsgEmail(e.target.value)} placeholder="exemple@courriel.com" style={inputStyle} />
          </div>

          {/* Téléphone */}
          <div>
            <label style={labelStyle}>Téléphone</label>
            <input type="tel" value={msgTel} onChange={(e) => setMsgTel(e.target.value)} placeholder="Optionnel" style={inputStyle} />
          </div>

          <hr style={{ border: "none", borderTop: `1px solid ${COLORS.border}`, margin: "4px 0" }} />

          {/* Conseiller destinataire */}
          <div>
            <label style={labelStyle}>Conseiller destinataire *</label>
            <select value={msgConseiller} onChange={(e) => setMsgConseiller(e.target.value)} required style={inputStyle}>
              <option value="">— Choisir le conseiller —</option>
              {Object.entries(EQUIPES).map(([groupe, { chef, conseillers }]) => (
                <optgroup key={groupe} label={groupe}>
                  {chef && <option value={chef.nom}>{chef.nom} (chef d'équipe)</option>}
                  {conseillers.map(c => <option key={c.nom} value={c.nom}>{c.nom}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label style={labelStyle}>Message / Motif de la visite *</label>
            <textarea value={msgTexte} onChange={(e) => setMsgTexte(e.target.value)} placeholder="Décrivez le motif de la visite..." required rows={4} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {/* Submit */}
          <button type="submit" disabled={msgSaving || !msgNom || !msgConseiller || !msgTexte}
            style={{
              width: "100%", padding: 16, borderRadius: 14, border: "none",
              background: (!msgNom || !msgConseiller || !msgTexte) ? COLORS.border : COLORS.accent,
              color: (!msgNom || !msgConseiller || !msgTexte) ? COLORS.textMuted : "#263164",
              fontSize: 17, fontWeight: 700, cursor: (!msgNom || !msgConseiller || !msgTexte) ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "all 0.2s",
              boxShadow: (msgNom && msgConseiller && msgTexte) ? `0 4px 20px ${COLORS.accent}33` : "none",
            }}>
            {msgSaving ? "Envoi en cours..." : "ENVOYER LE MESSAGE"}
          </button>
        </form>

        {/* Derniers messages */}
        {derniersMessages.length > 0 && (
          <div style={{ marginTop: 24, background: COLORS.card, borderRadius: 16, padding: 20, border: `1px solid ${COLORS.border}` }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: COLORS.textMuted, marginBottom: 12 }}>Derniers messages</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {derniersMessages.map(d => (
                <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: COLORS.bg, borderRadius: 8, fontSize: 13, flexWrap: "wrap" }}>
                  <span style={{ color: COLORS.accent, fontWeight: 600 }}>{d.heure}</span>
                  <span style={{ color: COLORS.text, fontWeight: 500 }}>{d.nom}</span>
                  {d.ref && <span style={{ color: COLORS.textMuted, fontSize: 11 }}>({d.ref})</span>}
                  <span style={{ color: COLORS.textMuted }}>→</span>
                  <span style={{ color: COLORS.gold, fontWeight: 600 }}>{d.conseiller}</span>
                  <span style={{ color: COLORS.textMuted }}>·</span>
                  <span style={{ color: COLORS.textMuted }}>{d.message}{d.message.length >= 50 ? "…" : ""}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        </>
        )}
      </main>

      <style>{`
        @media (max-width: 480px) {
          .saisie-header { padding: 14px 16px !important; gap: 10px !important; }
          .saisie-logo { height: 60px !important; }
          .saisie-title { fontSize: 18px !important; font-size: 18px !important; }
        }
        @media (min-width: 481px) and (max-width: 768px) {
          .saisie-logo { height: 80px !important; }
          .saisie-title { font-size: 22px !important; }
        }
      `}</style>
    </div>
  );
}

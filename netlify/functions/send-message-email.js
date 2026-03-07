// Netlify Function — Envoie un email au conseiller quand un message est soumis depuis l'accueil
// Utilise l'API Resend (resend.com) — variable d'env RESEND_API_KEY requise

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY non configurée — email non envoyé");
    return Response.json({ ok: false, error: "API key manquante" }, { status: 500 });
  }

  const {
    conseillerNom,
    conseillerEmail,
    chefEmail,
    nomVisiteur,
    telephone,
    reference,
    emailVisiteur,
    message,
  } = await req.json();

  if (!conseillerEmail || !nomVisiteur || !message) {
    return Response.json({ ok: false, error: "Champs requis manquants" }, { status: 400 });
  }

  // Construire la liste CC (chef d'équipe si applicable)
  const cc = chefEmail ? [chefEmail] : [];

  // Infos visiteur pour le corps du mail
  const infosVisiteur = [
    `<strong>Nom :</strong> ${escapeHtml(nomVisiteur)}`,
    telephone ? `<strong>Téléphone :</strong> ${escapeHtml(telephone)}` : null,
    reference ? `<strong>No référence :</strong> ${escapeHtml(reference)}` : null,
    emailVisiteur ? `<strong>Courriel :</strong> ${escapeHtml(emailVisiteur)}` : null,
  ].filter(Boolean).join("<br>");

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #263164; color: white; padding: 20px 24px; border-radius: 12px 12px 0 0;">
        <h2 style="margin: 0; font-size: 18px;">📬 Message de l'accueil — CARI St-Laurent</h2>
      </div>
      <div style="background: #f8f9fa; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="color: #333; margin-top: 0;">Bonjour <strong>${escapeHtml(conseillerNom)}</strong>,</p>
        <p style="color: #555;">Un visiteur s'est présenté à l'accueil et souhaite vous laisser un message :</p>

        <div style="background: white; border-left: 4px solid #6CBAC7; padding: 16px 20px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0 0 12px; color: #666; font-size: 13px;">${infosVisiteur}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 12px 0;">
          <p style="margin: 0; color: #333; white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>

        <p style="color: #888; font-size: 12px; margin-bottom: 0;">
          — Envoyé automatiquement depuis le Dashboard Accueil CARI
        </p>
      </div>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Accueil CARI <onboarding@resend.dev>",
        to: [conseillerEmail],
        cc,
        subject: `Message de l'accueil — ${nomVisiteur}`,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Erreur Resend:", data);
      return Response.json({ ok: false, error: data }, { status: res.status });
    }

    return Response.json({ ok: true, id: data.id });
  } catch (err) {
    console.error("Erreur envoi email:", err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

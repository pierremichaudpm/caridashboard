import { useMemo } from "react";
import { Users, UserPlus, UserCheck, AlertTriangle, Clock } from "lucide-react";
import { COLORS } from "../../theme";

function KpiCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{
      background: COLORS.card, borderRadius: 12, padding: 20,
      border: `1px solid ${COLORS.border}`, flex: "1 1 180px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <Icon size={20} color={color || COLORS.accent} />
        <span style={{ color: COLORS.textMuted, fontSize: 13 }}>{label}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: color || COLORS.text }}>{value}</div>
      {sub && <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function AdhesionsDashboard({ membres, onNavigate }) {
  const today = new Date();
  const stats = useMemo(() => {
    const actifs = membres.filter((m) => {
      if (!m.date_fin) return false;
      return new Date(m.date_fin) >= today;
    });
    const expires = membres.filter((m) => {
      if (!m.date_fin) return false;
      return new Date(m.date_fin) < today;
    });
    const expirent30j = membres.filter((m) => {
      if (!m.date_fin) return false;
      const fin = new Date(m.date_fin);
      const dans30j = new Date(today);
      dans30j.setDate(dans30j.getDate() + 30);
      return fin >= today && fin <= dans30j;
    });
    const nouveaux = membres.filter((m) => m.etat === "N");
    const renouvellements = membres.filter((m) => m.etat === "R");

    // Types
    const parType = {};
    membres.forEach((m) => {
      const t = m.type_membre || "non spécifié";
      parType[t] = (parType[t] || 0) + 1;
    });

    // Monthly new members (last 6 months)
    const mensuel = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(d.getMonth() - i);
      const mois = d.toLocaleDateString("fr-CA", { month: "short", year: "2-digit" });
      const count = membres.filter((m) => {
        if (!m.date_adhesion) return false;
        const da = new Date(m.date_adhesion);
        return da.getMonth() === d.getMonth() && da.getFullYear() === d.getFullYear();
      }).length;
      mensuel.push({ mois, count });
    }

    return { actifs, expires, expirent30j, nouveaux, renouvellements, parType, mensuel, total: membres.length };
  }, [membres]);

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700 }}>Tableau de bord</h2>

      {/* KPI Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <KpiCard icon={Users} label="Total membres" value={stats.total} />
        <KpiCard icon={UserCheck} label="Actifs" value={stats.actifs.length} color={COLORS.accent} />
        <KpiCard icon={AlertTriangle} label="Expirés" value={stats.expires.length} color={COLORS.vermillon} />
        <KpiCard icon={Clock} label="Expirent dans 30j" value={stats.expirent30j.length} color={COLORS.gold} />
        <KpiCard icon={UserPlus} label="Nouveaux" value={stats.nouveaux.length} sub={`${stats.renouvellements.length} renouvellements`} />
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* By type */}
        <div style={{
          background: COLORS.card, borderRadius: 12, padding: 20,
          border: `1px solid ${COLORS.border}`,
        }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600 }}>Par type de membre</h3>
          {Object.entries(stats.parType).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
            <div key={type} style={{
              display: "flex", justifyContent: "space-between", padding: "6px 0",
              borderBottom: `1px solid ${COLORS.border}`,
            }}>
              <span style={{ fontSize: 14, textTransform: "capitalize" }}>{type}</span>
              <span style={{ fontWeight: 600, color: COLORS.accent }}>{count}</span>
            </div>
          ))}
        </div>

        {/* Monthly bar chart (simple CSS bars) */}
        <div style={{
          background: COLORS.card, borderRadius: 12, padding: 20,
          border: `1px solid ${COLORS.border}`,
        }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600 }}>Adhésions récentes (6 mois)</h3>
          {stats.mensuel.map((m) => {
            const max = Math.max(...stats.mensuel.map((x) => x.count), 1);
            const pct = (m.count / max) * 100;
            return (
              <div key={m.mois} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 60, fontSize: 12, color: COLORS.textMuted }}>{m.mois}</span>
                <div style={{ flex: 1, height: 20, background: COLORS.bg, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: COLORS.accent, borderRadius: 4, transition: "width 0.3s" }} />
                </div>
                <span style={{ width: 30, fontSize: 13, fontWeight: 600, textAlign: "right" }}>{m.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expiring soon list */}
      {stats.expirent30j.length > 0 && (
        <div style={{
          background: COLORS.card, borderRadius: 12, padding: 20, marginTop: 16,
          border: `1px solid ${COLORS.gold}40`,
        }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: COLORS.gold }}>
            ⚠ Adhésions expirant dans 30 jours ({stats.expirent30j.length})
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 8 }}>
            {stats.expirent30j.slice(0, 12).map((m) => (
              <div
                key={m.id}
                onClick={() => onNavigate("liste")}
                style={{
                  padding: "8px 12px", borderRadius: 8, background: COLORS.bg,
                  fontSize: 13, cursor: "pointer",
                  display: "flex", justifyContent: "space-between",
                }}>
                <span>{m.prenom} {m.nom}</span>
                <span style={{ color: COLORS.gold }}>{m.date_fin}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

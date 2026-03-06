import { useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown, Filter } from "lucide-react";
import { COLORS } from "../../theme";

const STATUS_COLORS = {
  actif: COLORS.accent,
  expire: COLORS.vermillon,
  bientot: COLORS.gold,
};

function getStatut(m) {
  if (!m.date_fin) return { label: "—", color: COLORS.textMuted, key: "inconnu" };
  const fin = new Date(m.date_fin);
  const today = new Date();
  const dans30j = new Date();
  dans30j.setDate(dans30j.getDate() + 30);
  if (fin < today) return { label: "Expiré", color: STATUS_COLORS.expire, key: "expire" };
  if (fin <= dans30j) return { label: "Bientôt", color: STATUS_COLORS.bientot, key: "bientot" };
  return { label: "Actif", color: STATUS_COLORS.actif, key: "actif" };
}

export default function MembresListe({ membres, onSelect }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("nom");
  const [sortDir, setSortDir] = useState("asc");
  const [filterStatut, setFilterStatut] = useState("tous");
  const [filterType, setFilterType] = useState("tous");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 50;

  const filtered = useMemo(() => {
    let list = membres.map((m) => ({ ...m, statut: getStatut(m) }));

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.nom?.toLowerCase().includes(q) ||
          m.prenom?.toLowerCase().includes(q) ||
          m.email?.toLowerCase().includes(q) ||
          m.telephone?.includes(q)
      );
    }

    // Filter status
    if (filterStatut !== "tous") {
      list = list.filter((m) => m.statut.key === filterStatut);
    }

    // Filter type
    if (filterType !== "tous") {
      list = list.filter((m) => m.type_membre === filterType);
    }

    // Sort
    list.sort((a, b) => {
      let va = a[sortKey] || "";
      let vb = b[sortKey] || "";
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [membres, search, sortKey, sortDir, filterStatut, filterType]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const headerStyle = {
    padding: "8px 12px", fontSize: 12, fontWeight: 600, color: COLORS.textMuted,
    cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center", gap: 4,
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, background: COLORS.card,
          borderRadius: 8, padding: "8px 12px", border: `1px solid ${COLORS.border}`, flex: "1 1 250px",
        }}>
          <Search size={16} color={COLORS.textMuted} />
          <input
            type="text"
            placeholder="Rechercher (nom, email, tél)..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            style={{
              background: "transparent", border: "none", outline: "none",
              color: COLORS.text, fontSize: 14, width: "100%",
            }}
          />
        </div>
        <select
          value={filterStatut}
          onChange={(e) => { setFilterStatut(e.target.value); setCurrentPage(1); }}
          style={{
            padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`,
            background: COLORS.card, color: COLORS.text, fontSize: 13,
          }}
        >
          <option value="tous">Tous les statuts</option>
          <option value="actif">Actifs</option>
          <option value="bientot">Expirent bientôt</option>
          <option value="expire">Expirés</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
          style={{
            padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`,
            background: COLORS.card, color: COLORS.text, fontSize: 13,
          }}
        >
          <option value="tous">Tous les types</option>
          <option value="individuel">Individuel</option>
          <option value="corporatif">Corporatif</option>
          <option value="honoraire">Honoraire</option>
        </select>
        <span style={{ color: COLORS.textMuted, fontSize: 13 }}>
          {filtered.length} membre{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div style={{
        background: COLORS.card, borderRadius: 12, overflow: "hidden",
        border: `1px solid ${COLORS.border}`,
      }}>
        {/* Header row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr 0.8fr",
          borderBottom: `1px solid ${COLORS.border}`, background: COLORS.bg,
        }}>
          <div style={headerStyle} onClick={() => toggleSort("nom")}>Nom <SortIcon col="nom" /></div>
          <div style={headerStyle} onClick={() => toggleSort("email")}>Email <SortIcon col="email" /></div>
          <div style={headerStyle}>Téléphone</div>
          <div style={headerStyle} onClick={() => toggleSort("type_membre")}>Type <SortIcon col="type_membre" /></div>
          <div style={headerStyle} onClick={() => toggleSort("date_fin")}>Fin adhésion <SortIcon col="date_fin" /></div>
          <div style={headerStyle}>Statut</div>
        </div>

        {/* Rows */}
        {paginated.map((m) => (
          <div
            key={m.id}
            onClick={() => onSelect(m.id)}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr 0.8fr",
              padding: 0,
              borderBottom: `1px solid ${COLORS.border}`,
              cursor: "pointer",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.cardHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ padding: "10px 12px", fontSize: 14 }}>
              <span style={{ fontWeight: 600 }}>{m.nom}</span>
              {m.prenom && <span style={{ color: COLORS.textMuted }}>, {m.prenom}</span>}
            </div>
            <div style={{ padding: "10px 12px", fontSize: 13, color: COLORS.textMuted, overflow: "hidden", textOverflow: "ellipsis" }}>
              {m.email || "—"}
            </div>
            <div style={{ padding: "10px 12px", fontSize: 13, color: COLORS.textMuted }}>{m.telephone || "—"}</div>
            <div style={{ padding: "10px 12px", fontSize: 12, textTransform: "capitalize" }}>{m.type_membre || "—"}</div>
            <div style={{ padding: "10px 12px", fontSize: 13 }}>{m.date_fin || "—"}</div>
            <div style={{ padding: "10px 12px" }}>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 10,
                background: `${m.statut.color}22`, color: m.statut.color,
              }}>
                {m.statut.label}
              </span>
            </div>
          </div>
        ))}

        {paginated.length === 0 && (
          <div style={{ padding: 30, textAlign: "center", color: COLORS.textMuted }}>
            Aucun membre trouvé
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "6px 14px", borderRadius: 8, border: `1px solid ${COLORS.border}`,
              background: COLORS.card, color: COLORS.text, cursor: "pointer", opacity: currentPage === 1 ? 0.4 : 1,
            }}
          >
            ←
          </button>
          <span style={{ padding: "6px 14px", color: COLORS.textMuted, fontSize: 14 }}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: "6px 14px", borderRadius: 8, border: `1px solid ${COLORS.border}`,
              background: COLORS.card, color: COLORS.text, cursor: "pointer", opacity: currentPage === totalPages ? 0.4 : 1,
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

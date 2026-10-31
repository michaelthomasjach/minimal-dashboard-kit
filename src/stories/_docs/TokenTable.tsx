import { useEffect, useRef, useState, type CSSProperties } from "react";
import { MinimalTheme } from "../../theme";

/** Les groupes de variables, dans l'ordre de la page « Thème ». */
export const TOKEN_GROUPS: { title: string; note: string; tokens: string[] }[] = [
  {
    title: "Surfaces et texte",
    note: "Le fond de page, les cartes, les deux textes et les filets.",
    tokens: ["--lq-color-bg", "--lq-color-panel", "--lq-color-text", "--lq-color-text-muted", "--mdk-color-text-strong", "--lq-color-border", "--lq-color-border-subtle", "--lq-color-panel-border", "--lq-color-hover", "--lq-color-overlay"],
  },
  {
    title: "Accent et états",
    note: "Le primaire violet du gabarit, et les couleurs qui disent un état.",
    tokens: ["--lq-color-accent", "--lq-color-accent-contrast", "--lq-color-fill", "--lq-color-fill-track", "--lq-color-focus-ring", "--lq-color-up", "--lq-color-down", "--lq-color-danger", "--lq-color-warning", "--lq-color-info"],
  },
  {
    title: "Couleurs de série",
    note: "Pour les graphiques et les pastilles.",
    tokens: ["--lq-color-violet", "--lq-color-sky", "--lq-color-green", "--lq-color-amber", "--lq-color-rose"],
  },
  {
    title: "Typographie",
    note: "Inter pour le texte, Montserrat en capitales pour les petits titres.",
    tokens: ["--lq-font-family", "--lq-label-font", "--lq-label-size", "--lq-label-weight", "--lq-label-tracking", "--lq-caption-transform", "--lq-text-h1", "--lq-text-h2", "--lq-text-h3", "--lq-text-h4", "--lq-text-h5", "--lq-text-h6", "--lq-text-xl", "--lq-text-lg", "--lq-text-md", "--lq-text-sm", "--lq-text-xs", "--lq-row-font-size", "--lq-font-weight-heading", "--lq-font-weight-bold", "--lq-font-weight-semibold", "--lq-font-weight-medium", "--lq-line-height-body", "--lq-line-height-heading"],
  },
  {
    title: "Espacement, rayons, ombres",
    note: "20 px de marge dans les cartes, angles de 2 et 3 px, une ombre double très légère.",
    tokens: ["--lq-space-1", "--lq-space-2", "--lq-space-3", "--lq-space-4", "--lq-space-5", "--lq-space-6", "--lq-radius-sm", "--lq-radius-md", "--lq-radius-lg", "--lq-radius-pill", "--lq-shadow-panel", "--lq-shadow-modal"],
  },
  {
    title: "Champs et boutons",
    note: "Champs de 32 px à filet d'un pixel, boutons de 35 px.",
    tokens: ["--lq-control-height", "--lq-control-padding-x", "--lq-control-font-size", "--lq-control-color", "--lq-control-border-width", "--lq-field-gap", "--lq-field-helper-offset", "--lq-field-label-size", "--lq-field-label-weight", "--lq-button-padding-y", "--lq-button-padding-x", "--lq-button-font-size"],
  },
];

const isColor = (v: string) => /^(#|rgb|hsl|color-mix)/.test(v);

const cell: CSSProperties = { padding: "8px 12px", borderBottom: "1px solid var(--lq-color-border-subtle)", textAlign: "left", verticalAlign: "middle" };

/** Lit les valeurs **calculées** sur une vraie racine du thème : la table ne peut pas mentir sur ce
 *  que `minimal.css` pose réellement. */
function Values({ tokens, surface }: { tokens: string[]; surface: "light" | "dark" }) {
  const probe = useRef<HTMLSpanElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    const root = probe.current?.closest(".lq-root");
    if (!root) return;
    const cs = getComputedStyle(root);
    setValues(Object.fromEntries(tokens.map((t) => [t, cs.getPropertyValue(t).trim()])));
  }, [tokens, surface]);
  return (
    <>
      <span ref={probe} />
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, color: "var(--lq-color-text)" }}>
        <thead>
          <tr>
            <th style={cell}>Variable</th>
            <th style={cell}>Valeur ({surface === "light" ? "claire" : "sombre"})</th>
            <th style={{ ...cell, width: 60 }}>Aperçu</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => {
            const v = values[t] ?? "";
            return (
              <tr key={t}>
                <td style={cell}>
                  <code>{t}</code>
                </td>
                <td style={{ ...cell, fontFamily: "ui-monospace, monospace", fontSize: 12 }}>{v || "—"}</td>
                <td style={cell}>
                  {isColor(v) ? (
                    <span style={{ display: "inline-block", width: 36, height: 20, borderRadius: 3, background: v, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.12)" }} />
                  ) : t.startsWith("--lq-shadow") ? (
                    <span style={{ display: "inline-block", width: 36, height: 20, borderRadius: 2, background: "var(--lq-color-panel)", boxShadow: v }} />
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export function TokenTable({ tokens, surface = "light" }: { tokens: string[]; surface?: "light" | "dark" }) {
  return (
    <MinimalTheme surface={surface}>
      <div style={{ padding: 16, background: "var(--lq-color-panel)" }}>
        <Values tokens={tokens} surface={surface} />
      </div>
    </MinimalTheme>
  );
}

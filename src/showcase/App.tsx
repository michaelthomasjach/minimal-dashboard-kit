import { useState } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { SidebarLayout, Text, Toggle } from "@michaelthomasjach/liseuse-dashboard-kit";
import { MinimalTheme } from "../theme";
import { SCREENS, screenGroups } from "./screens";
import "./showcase.css";

/**
 * La coquille : barre latérale, barre haute, et la zone où les écrans se rendent.
 *
 * Elle ne connaît aucun écran par son nom — elle lit le registre (`screens/index.tsx`) et en tire
 * les deux choses qui doivent rester d'accord : les entrées du menu et les routes.
 */
function Shell({ surface, onSurface }: { surface: "light" | "dark"; onSurface: (next: "light" | "dark") => void }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = pathname.replace(/^\//, "");

  const navItems = screenGroups().map(({ group, screens }) => ({
    id: group,
    label: group,
    children: screens.map((screen) => ({
      id: screen.id,
      label: screen.label,
      active: screen.path === current,
      onClick: () => navigate(`/${screen.path}`),
    })),
  }));

  return (
    <SidebarLayout
      logo={<span className="mdk-logo">minimal</span>}
      navItems={navItems}
      stickyHeader
      header={
        <div className="mdk-topbar">
          <Text size="sm" muted>
            Thème « minimal » · kit liseuse
          </Text>
          <label className="mdk-row">
            <Text size="sm" muted>
              Sombre
            </Text>
            <Toggle
              checked={surface === "dark"}
              onChange={(next) => onSurface(next ? "dark" : "light")}
              ariaLabel="Basculer la surface sombre"
            />
          </label>
        </div>
      }
    >
      <Routes>
        {SCREENS.map((screen) => (
          <Route key={screen.id} path={`/${screen.path}`} element={screen.render()} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SidebarLayout>
  );
}

/**
 * `HashRouter` et non `BrowserRouter` : la vitrine est un site statique, et un rafraîchissement sur
 * `/tableaux` renvoie un 404 chez tout hébergeur qui ne sait pas réécrire vers `index.html` —
 * GitHub Pages le premier. Le dièse évite ce piège sans configuration. C'est une ligne à changer le
 * jour où elle est servie par quelque chose qui sait réécrire.
 */
export function App() {
  const [surface, setSurface] = useState<"light" | "dark">("light");
  return (
    <MinimalTheme surface={surface}>
      <HashRouter>
        <Shell surface={surface} onSurface={setSurface} />
      </HashRouter>
    </MinimalTheme>
  );
}

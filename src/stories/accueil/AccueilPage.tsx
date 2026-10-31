import { useState, type ReactNode } from "react";
import {
  AlertList,
  ArrowRightIcon,
  Badge,
  BarChart,
  Button,
  Card,
  Checkbox,
  CodeBlock,
  DonutChart,
  GaugeChart,
  Input,
  LineAreaChart,
  LiveTile,
  NotificationMenu,
  PriceChangeTag,
  ProgressBar,
  SegmentedControl,
  Select,
  Sparkline,
  StatCard,
  Tag,
  Toggle,
  type NotificationMenuItem,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { MinimalTheme } from "../../theme";
import { CHURN_TREND, REVENUE_TREND, SIGNUPS_TREND } from "../../showcase/demoData";
import { TOKEN_GROUPS } from "../_docs/TokenTable";
import { openPath, useStorybookIndex, type StorybookIndex } from "./storybookIndex";
import "./accueil.css";

const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

// Au niveau du module, pas à chaque rendu : chaque graphique se redessinerait sinon contre une
// série neuve à chaque changement de surface.
const REVENUE_SERIES = [
  { id: "revenu", label: "Revenu (k€)", data: REVENUE_TREND.map((y, i) => ({ x: i, y })) },
  { id: "objectif", label: "Objectif", data: REVENUE_TREND.map((_, i) => ({ x: i, y: 40 + i * 3.4 })) },
];
const CHANNELS = [
  { id: "direct", label: "Direct", value: 42 },
  { id: "partenaires", label: "Partenaires", value: 27 },
  { id: "recherche", label: "Recherche", value: 19 },
  { id: "autres", label: "Autres", value: 12 },
];
const SIGNUPS_BARS = SIGNUPS_TREND.slice(-6).map((value, i) => ({ id: `m${i}`, label: MONTHS[6 + i], value }));
const NOTIFICATIONS: NotificationMenuItem[] = [
  { id: "1", title: "Facture F-2041 réglée", text: "Atelier Morel — 4 820 €", time: "il y a 5 min", unread: true, tone: "success" },
  { id: "2", title: "Nouveau client", text: "Brasserie du Port a créé son compte.", time: "il y a 1 h", unread: true, tone: "accent" },
  { id: "3", title: "Export terminé", text: "commandes-octobre.csv est prêt.", time: "hier", tone: "info" },
];

/** Les familles du menu, dans l'ordre de la barre latérale (voir `storySort` dans preview.tsx). La
 *  page ouverte au clic est la plus représentative de la famille, pas la première par l'alphabet. */
const FAMILIES: { name: string; lead: string; open: string }[] = [
  { name: "Foundations", lead: "Les variables du thème, la typographie, les icônes et le fournisseur de thème.", open: "Foundations/Variables du thème" },
  { name: "Primitives", lead: "Boutons, cartes, panneaux, onglets, bascules, infobulles : les briques de tout le reste.", open: "Primitives/Button" },
  { name: "Forms", lead: "Champs, listes, dates, masques de saisie, étiquettes, éditeur riche.", open: "Forms/Input/Input" },
  { name: "Feedback", lead: "Notifications, alertes, chargements, progression, visites guidées.", open: "Feedback/Notification" },
  { name: "Charts", lead: "Courbes, barres, anneaux, jauges, cartes de chaleur, chandeliers.", open: "Charts/LineAreaChart" },
  { name: "Map", lead: "Globe interactif, carte tuilée, carte à points, exposition par pays.", open: "Map/Tile Map" },
  { name: "Finance", lead: "Tuiles d'indicateur, tableau de données, variations, comparaisons.", open: "Finance/StatCard" },
  { name: "Finance Widgets", lead: "Portefeuille, liste de surveillance, plus fortes variations.", open: "Finance Widgets/PortfolioSummaryWidget" },
  { name: "Widgets", lead: "Tuiles vivantes, horloges, météo, Kanban, objectifs, base de connaissances.", open: "Widgets/LiveTile" },
  { name: "Dashboard", lead: "Un tableau de bord assemblé de bout en bout avec les widgets.", open: "Dashboard/Maison — tableau de bord" },
  { name: "Layouts", lead: "Barre latérale, barre haute, fil d'Ariane, menu utilisateur.", open: "Layouts/SidebarLayout" },
  { name: "Pages", lead: "Connexion, inscription, page introuvable.", open: "Pages/LoginPage" },
  { name: "Audio", lead: "Balance, vumètres et égaliseur.", open: "Audio/Equalizer" },
  { name: "Scheduler", lead: "Planning de ressources et sa fenêtre de tâche.", open: "Scheduler/Planning de ressources" },
];

const SWATCHES = ["--lq-color-bg", "--lq-color-panel", "--mdk-color-text-strong", "--lq-color-text", "--lq-color-text-muted", "--lq-color-border", "--lq-color-accent", "--lq-color-up", "--lq-color-down", "--lq-color-warning", "--lq-color-info", "--lq-color-violet", "--lq-color-sky", "--lq-color-green", "--lq-color-amber", "--lq-color-rose"];
const TYPE_SCALE = [
  { token: "--lq-text-h3", sample: "Titre d'écran" },
  { token: "--lq-text-lg", sample: "Valeur secondaire" },
  { token: "--lq-text-md", sample: "Texte courant, 14 px" },
  { token: "--lq-text-sm", sample: "Légende de graphique" },
];
const SHAPES = ["--lq-radius-sm", "--lq-radius-md", "--lq-radius-lg", "--lq-radius-pill"];
const TOKEN_COUNT = TOKEN_GROUPS.reduce((n, g) => n + g.tokens.length, 0);

const USAGE_SNIPPET = `import { MinimalTheme } from "minimal-dashboard-kit/theme";
import { Button, Card } from "@michaelthomasjach/liseuse-dashboard-kit";

export function App() {
  return (
    <MinimalTheme surface="light">
      <Card title="Commandes">
        <Button>Exporter</Button>
      </Card>
    </MinimalTheme>
  );
}`;
const FONTS_SNIPPET = `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@500;600&display=swap" rel="stylesheet" />`;
const SHOWCASE_SNIPPET = `npm install      # GITHUB_TOKEN exporté : le kit est sur GitHub Packages
npm run dev      # la vitrine, sur http://localhost:5173
npm run storybook`;

function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: ReactNode; lead: ReactNode }) {
  return (
    <header className="mdk-home__head">
      <span className="mdk-home__eyebrow">{eyebrow}</span>
      <h2 className="mdk-home__title">{title}</h2>
      <p className="mdk-home__lead">{lead}</p>
    </header>
  );
}

/** Un composant vivant et son nom ; seul le nom est un bouton, pour ne pas voler les clics destinés
 *  au composant lui-même (les bascules basculent, les champs se remplissent). */
function Specimen({ name, title, index, wide, children }: { name: string; title: string; index: StorybookIndex; wide?: boolean; children: ReactNode }) {
  return (
    <figure className={["mdk-home__specimen", wide && "mdk-home__specimen--wide"].filter(Boolean).join(" ")}>
      <div className="mdk-home__stage">{children}</div>
      <figcaption>
        <button type="button" className="mdk-home__link" onClick={() => openPath(index.pathOf(title))}>
          {name}
        </button>
      </figcaption>
    </figure>
  );
}

/** Le mini tableau de bord du héros : de vrais composants, avec de vraies données de démonstration. */
function HeroDashboard() {
  return (
    <div className="mdk-home__dash">
      <div className="mdk-home__stats">
        <StatCard label="Revenu mensuel" value={euro(80000)} delta={12.4} caption="vs. mois précédent" sparklineData={REVENUE_TREND} />
        <StatCard label="Nouveaux clients" value="31" delta={-6.1} caption="vs. mois précédent" sparklineData={SIGNUPS_TREND} />
        <StatCard label="Attrition" value="4,0 %" delta={-1.2} caption="vs. mois précédent" sparklineData={CHURN_TREND} />
      </div>
      <div className="mdk-home__dash-row">
        <Card title="Revenu sur douze mois" meta="k€">
          <LineAreaChart series={REVENUE_SERIES} height={220} area xType="linear" formatX={(x) => MONTHS[Number(x)] ?? ""} formatY={(y) => `${y}`} />
        </Card>
        <Card title="Canaux d'acquisition" meta="en %">
          <DonutChart data={CHANNELS} size={150} centerValue="42 %" centerCaption="Direct" legendPosition="bottom" />
        </Card>
      </div>
    </div>
  );
}

function FormsSpecimen() {
  const [client, setClient] = useState("Atelier Morel");
  const [statut, setStatut] = useState<string | null>("payee");
  const [period, setPeriod] = useState<"mois" | "trimestre" | "annee">("trimestre");
  const [relance, setRelance] = useState(true);
  const [copie, setCopie] = useState(false);
  return (
    <Card title="Nouvelle facture">
      <div className="mdk-home__form">
        <Input label="Client" value={client} onChange={(e) => setClient(e.target.value)} />
        <Select
          label="Statut"
          value={statut}
          onChange={setStatut}
          options={[
            { value: "brouillon", label: "Brouillon" },
            { value: "envoyee", label: "Envoyée" },
            { value: "payee", label: "Payée" },
          ]}
        />
        <SegmentedControl
          label="Période"
          labelPosition="top"
          value={period}
          onChange={setPeriod}
          options={[
            { value: "mois", label: "Mois" },
            { value: "trimestre", label: "Trimestre" },
            { value: "annee", label: "Année" },
          ]}
        />
        <div className="mdk-home__row">
          <Toggle checked={relance} onChange={setRelance} ariaLabel="Relance automatique" />
          <span>Relance automatique à J+30</span>
        </div>
        <Checkbox checked={copie} onChange={setCopie} label="M'envoyer une copie" />
        <div className="mdk-home__row">
          <Button selected>Enregistrer</Button>
          <Button>Annuler</Button>
        </div>
      </div>
    </Card>
  );
}

export interface AccueilPageProps {
  /** Version du kit dont le Storybook lit le source, affichée dans le surtitre. */
  kitVersion: string;
  /** Nombre de composants du kit documentés (`docgen.json`). */
  componentCount: number;
}

export function AccueilPage({ kitVersion, componentCount }: AccueilPageProps) {
  const index = useStorybookIndex();
  const open = (title: string) => openPath(index.pathOf(title));

  return (
    <div className="mdk-home">
      <header className="mdk-home__hero">
        <span className="mdk-home__eyebrow">Thème « minimal » · kit v{kitVersion}</span>
        <h1 className="mdk-home__hero-title">
          Les composants de la liseuse, <span className="mdk-home__accent">habillés pour l'administration</span>.
        </h1>
        <p className="mdk-home__hero-lead">
          <strong>minimal-dashboard-kit</strong> est une couche de thème posée sur{" "}
          <code>@michaelthomasjach/liseuse-dashboard-kit</code>. Elle ne réécrit aucun composant : elle
          redéfinit les variables <code>--lq-*</code> qu'ils lisent tous, et leur donne le langage d'un
          tableau de bord d'administration dense et plat — neutres ardoise, un seul accent, angles de
          2 à 3 px. Chaque page de ce Storybook rend le composant du kit à travers <code>MinimalTheme</code> :
          c'est ce que verra une application qui l'utilise.
        </p>
        <div className="mdk-home__actions">
          <Button selected icon={<ArrowRightIcon size={15} />} iconPosition="trailing" onClick={() => open("Primitives/Button")}>
            Parcourir les composants
          </Button>
          <Button onClick={() => open("Foundations/Variables du thème")}>Les variables du thème</Button>
          <Button onClick={() => window.open("http://localhost:5173/", "_blank", "noopener")}>Ouvrir la vitrine</Button>
        </div>
        <p className="mdk-home__hint">
          La vitrine — trois écrans de référence : Vue d'ensemble, Tableaux, Formulaires — se lance à part
          avec <code>npm run dev</code>. La bascule <strong>Surface</strong> de la barre d'outils fait passer
          toute cette page, et toutes les autres, en sombre.
        </p>
        <div className="mdk-home__stage-frame">
          <HeroDashboard />
        </div>
        <dl className="mdk-home__figures">
          <div>
            <dt>{componentCount}</dt>
            <dd>composants du kit documentés</dd>
          </div>
          <div>
            <dt>{index.pageCount || "—"}</dt>
            <dd>pages dans le menu</dd>
          </div>
          <div>
            <dt>{TOKEN_COUNT}</dt>
            <dd>variables redéfinies par le thème</dd>
          </div>
          <div>
            <dt>0</dt>
            <dd>ligne de logique de composant</dd>
          </div>
        </dl>
      </header>

      <section className="mdk-home__section">
        <SectionHead
          eyebrow="Le propos"
          title="Mesuré, pas recopié."
          lead={
            <>
              La référence d'ambition est le gabarit d'administration <em>Pages</em> de Revox. Ses valeurs
              ont été <strong>mesurées</strong> dans un navigateur — fond, texte, rayons, ombres, petits
              titres en capitales — puis reportées dans nos propres variables. Ni sa feuille de style, ni
              ses gabarits, ni ses visuels ne sont repris : c'est un produit payant, et un système de
              design original de la même famille suffit.
            </>
          }
        />
        <div className="mdk-home__pillars">
          <article className="mdk-home__pillar">
            <h3>Une valeur, pas un titre</h3>
            <p>Grille typographique courte : sur un tableau de bord, le plus gros texte de l'écran doit être un chiffre.</p>
          </article>
          <article className="mdk-home__pillar">
            <h3>Un seul accent</h3>
            <p>Neutres ardoise, un primaire pour l'action et l'état sélectionné ; les couleurs de série restent aux graphiques.</p>
          </article>
          <article className="mdk-home__pillar">
            <h3>Fait pour l'écran</h3>
            <p>Le kit est à zéro rayon, son allure de papier. Ici, des angles faibles mais non nuls et des cartes détachées par une ombre.</p>
          </article>
        </div>
      </section>

      <section className="mdk-home__section">
        <SectionHead
          eyebrow="Deux surfaces"
          title="Clair et sombre, une seule feuille."
          lead={
            <>
              Les deux tuiles ci-dessous contiennent les mêmes composants, chacune sous son propre{" "}
              <code>MinimalTheme</code>. Seul l'attribut <code>surface</code> change ; aucune classe
              conditionnelle n'est écrite nulle part.
            </>
          }
        />
        <div className="mdk-home__surfaces">
          {(["light", "dark"] as const).map((surface) => (
            <div key={surface} className="mdk-home__surface">
              <div className="mdk-home__surface-frame">
              <MinimalTheme surface={surface}>
                <div className="mdk-home__surface-body">
                  <StatCard label="Panier moyen" value={euro(2580)} delta={3.8} caption="vs. mois précédent" sparklineData={REVENUE_TREND} />
                  <div className="mdk-home__row">
                    <Badge tone="up">Payée</Badge>
                    <Badge tone="warning">En attente</Badge>
                    <Badge tone="down">Impayée</Badge>
                  </div>
                  <ProgressBar label="Objectif trimestriel" value={72} labelPosition="left" showValue />
                </div>
              </MinimalTheme>
              </div>
              <span className="mdk-home__surface-label">surface="{surface}"</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mdk-home__section">
        <SectionHead
          eyebrow="Fondations"
          title="Ce que le thème redéfinit."
          lead="Les couleurs, l'échelle typographique, les rayons et les espacements : tout passe par des variables, lues ici en direct. Changez de surface dans la barre d'outils, elles se repeignent."
        />
        <div className="mdk-home__foundations">
          <section className="mdk-home__found">
            <h3>Couleurs</h3>
            <ul className="mdk-home__swatches">
              {SWATCHES.map((token) => (
                <li key={token}>
                  <span className="mdk-home__chip" style={{ background: `var(${token})` }} />
                  <code>{token.replace(/^--(lq|mdk)-color-/, "")}</code>
                </li>
              ))}
            </ul>
          </section>
          <section className="mdk-home__found">
            <h3>Typographie</h3>
            <ul className="mdk-home__typescale">
              {TYPE_SCALE.map(({ token, sample }) => (
                <li key={token}>
                  <span style={{ fontSize: `var(${token})` }}>{sample}</span>
                  <code>{token}</code>
                </li>
              ))}
              <li>
                <span className="mdk-home__caption-sample">Petit titre de carte</span>
                <code>--lq-caption-*</code>
              </li>
            </ul>
          </section>
          <section className="mdk-home__found">
            <h3>Rayons et ombre</h3>
            <ul className="mdk-home__shapes">
              {SHAPES.map((token) => (
                <li key={token}>
                  <span className="mdk-home__shape" style={{ borderRadius: `var(${token})` }} />
                  <code>{token.replace("--lq-", "")}</code>
                </li>
              ))}
            </ul>
            <button type="button" className="mdk-home__link" onClick={() => open("Foundations/Variables du thème")}>
              Toutes les variables et leurs valeurs calculées
            </button>
          </section>
        </div>
      </section>

      <section className="mdk-home__section">
        <SectionHead
          eyebrow="En fonctionnement"
          title="Les composants, vivants, dans le thème."
          lead="Rien de ce qui suit n'est une capture : ce sont les composants du kit, avec leur état. Le nom sous chaque cadre ouvre sa documentation."
        />
        <div className="mdk-home__specimens">
          <Specimen name="LiveTile" title="Widgets/LiveTile" index={index}>
            <LiveTile
              height={190}
              interval={3200}
              faces={[
                { tag: "Vitrine", eyebrow: "npm run dev", title: "Trois écrans de référence", subtitle: "Vue d'ensemble, Tableaux, Formulaires" },
                { tag: "Thème", eyebrow: `${TOKEN_COUNT} variables`, title: "Clair et sombre", subtitle: "Une seule feuille, minimal.css", background: "var(--lq-color-info)" },
                { tag: "Kit", eyebrow: `v${kitVersion}`, title: "La logique reste dans le kit", subtitle: "Ici, on ne décide que de l'apparence", background: "var(--mdk-color-text-strong)" },
              ]}
            />
          </Specimen>
          <Specimen name="BarChart" title="Charts/BarChart" index={index}>
            <BarChart data={SIGNUPS_BARS} height={190} formatValue={(v) => `${v}`} />
          </Specimen>
          <Specimen name="GaugeChart" title="Charts/GaugeChart" index={index}>
            <GaugeChart value={72} size={150} label="Objectif" formatValue={(v) => `${v} %`} />
          </Specimen>
          <Specimen name="NotificationMenu" title="Feedback/NotificationMenu" index={index}>
            <div className="mdk-home__row mdk-home__row--between">
              <span>Trois notifications, deux non lues</span>
              <NotificationMenu items={NOTIFICATIONS} title="Notifications" />
            </div>
          </Specimen>
          <Specimen name="AlertList" title="Feedback/AlertList" index={index} wide>
            <AlertList
              alerts={[
                { id: "a", level: "critical", message: "Trois factures dépassent 60 jours de retard." },
                { id: "b", level: "warning", message: "Le quota d'export mensuel est atteint à 90 %." },
                { id: "c", level: "info", message: "Nouvelle version du kit disponible." },
              ]}
            />
          </Specimen>
          <Specimen name="Sparkline · PriceChangeTag · Tag" title="Charts/Sparkline" index={index}>
            <div className="mdk-home__quotes">
              {[
                { name: "Revenu", data: REVENUE_TREND, delta: 12.4 },
                { name: "Clients", data: SIGNUPS_TREND, delta: -6.1 },
                { name: "Attrition", data: CHURN_TREND, delta: -1.2 },
              ].map((q) => (
                <div key={q.name} className="mdk-home__quote">
                  <span>{q.name}</span>
                  <Sparkline data={q.data} colorByTrend width={80} height={22} />
                  <PriceChangeTag value={q.delta} />
                </div>
              ))}
              <div className="mdk-home__row">
                <Tag>Octobre</Tag>
                <Tag onRemove={() => {}}>Clients actifs</Tag>
              </div>
            </div>
          </Specimen>
        </div>
        <div className="mdk-home__forms">
          <FormsSpecimen />
          <div className="mdk-home__forms-note">
            <h3>Les champs aussi.</h3>
            <p>
              Champs de 32 px à filet d'un pixel, libellés au-dessus, boutons de 35 px : le thème règle
              leurs dimensions par les variables <code>--lq-control-*</code>, <code>--lq-field-*</code> et{" "}
              <code>--lq-button-*</code> que le kit lit avec son propre rendu pour défaut.
            </p>
            <button type="button" className="mdk-home__link" onClick={() => open("Forms/Input/Input")}>
              La famille Forms
            </button>
          </div>
        </div>
      </section>

      <section className="mdk-home__section">
        <SectionHead
          eyebrow="Le catalogue"
          title="Le même menu que le kit."
          lead="Ce Storybook et celui du kit ont exactement les mêmes entrées : chaque page existe des deux côtés, l'une en e-ink, l'autre dans ce thème. Les comptes ci-dessous sont lus dans le menu lui-même."
        />
        <div className="mdk-home__families">
          {FAMILIES.map((f) => (
            <button key={f.name} type="button" className="mdk-home__family" onClick={() => open(f.open)}>
              <span className="mdk-home__family-head">
                <strong>{f.name}</strong>
                {index.pagesByFamily[f.name] ? <span className="mdk-home__count">{index.pagesByFamily[f.name]}</span> : null}
              </span>
              <span className="mdk-home__family-lead">{f.lead}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mdk-home__section">
        <SectionHead
          eyebrow="Prise en main"
          title="Un composant autour de l'application."
          lead={
            <>
              <code>MinimalTheme</code> charge la feuille du kit et celle du thème, et pose la classe{" "}
              <code>mdk</code> sur la racine du thème. L'application charge les polices elle-même : Inter
              pour le texte, Montserrat pour les petits titres.
            </>
          }
        />
        <div className="mdk-home__code">
          <CodeBlock code={USAGE_SNIPPET} filename="App.tsx" highlight="javascript" showLineNumbers />
          <div className="mdk-home__code-side">
            <CodeBlock code={FONTS_SNIPPET} filename="index.html" />
            <CodeBlock code={SHOWCASE_SNIPPET} language="bash" />
          </div>
        </div>
      </section>

      <section className="mdk-home__section">
        <SectionHead
          eyebrow="Sous le capot"
          title="Comment la couche tient."
          lead="Trois règles, et l'architecture entière en découle."
        />
        <div className="mdk-home__pillars">
          <article className="mdk-home__pillar">
            <h3>Strictement plus spécifique</h3>
            <p>
              Le thème redéfinit les variables sous <code>.mdk.lq-root[data-lq-palette][data-lq-surface]</code>,
              un point de spécificité au-dessus du kit : il gagne quel que soit l'ordre de chargement des
              feuilles, que les bundlers réorganisent sans prévenir.
            </p>
          </article>
          <article className="mdk-home__pillar">
            <h3>Des variables optionnelles</h3>
            <p>
              Pour les petits titres, les champs, la barre latérale et les lignes de données, le kit lit
              aussi des variables facultatives (<code>--lq-label-*</code>, <code>--lq-caption-*</code>,{" "}
              <code>--lq-control-*</code>, <code>--lq-sidebar-*</code>…) dont le défaut est son propre rendu.
            </p>
          </article>
          <article className="mdk-home__pillar">
            <h3>La logique reste au kit</h3>
            <p>
              Un correctif, une prop, un composant manquant se font dans le kit ; la couleur, la taille et
              l'espace se font ici. Les tables de props sont extraites des types du kit
              (<code>npm run docgen</code>) : elles décrivent ce qui est rendu.
            </p>
          </article>
        </div>
      </section>

      <p className="mdk-home__footnote">
        <code>minimal-dashboard-kit</code> · thème « minimal » sur <code>@michaelthomasjach/liseuse-dashboard-kit</code>{" "}
        v{kitVersion}. Ce Storybook lit le source du kit voisin ; la vitrine utilise le paquet publié.
      </p>
    </div>
  );
}

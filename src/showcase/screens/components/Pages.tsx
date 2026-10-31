import { useState, type ReactNode } from "react";
import { LoginPage, SignUpPage, NotFoundPage, HeaderLayout, SidebarLayout } from "@michaelthomasjach/liseuse-dashboard-kit";
import { Button, Checkbox, Input, InputPassword, Text, Heading, StatCard, Breadcrumbs, UserMenu } from "@michaelthomasjach/liseuse-dashboard-kit";
import { HomeIcon, UserIcon, SettingsIcon, FileIcon, BellIcon } from "@michaelthomasjach/liseuse-dashboard-kit";
import { SpecimenScreen, SpecimenGrid, Specimen } from "../../Specimen";
import { REVENUE_TREND, SIGNUPS_TREND } from "../../demoData";

/** L'image des pages d'accès. Une image ne lit pas les variables CSS : ses deux teintes reprennent
 *  donc à la main l'ardoise et l'indigo du thème. Locale et sans réseau, comme toute la vitrine. */
const ACCESS_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1400">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#1e2433"/>
          <stop offset="1" stop-color="#4f5bd5"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="1400" fill="url(#g)"/>
    </svg>
  `);

const logo = <span className="mdk-logo">minimal</span>;
const pct = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;

/** Le cadre d'une page plein écran. `transform` en fait le bloc conteneur de tout ce qui serait en
 *  `position: fixed` dessous, et la hauteur fixe garde la page dans son spécimen au lieu de la
 *  laisser déborder sur la coquille de la vitrine. */
function PageFrame({ children }: { children: ReactNode }) {
  return <div className="mdk-page-frame">{children}</div>;
}

function LoginDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <LoginPage
      imageSrc={ACCESS_IMAGE}
      imageAlt=""
      logo={logo}
      title="Bon retour"
      subtitle="Connectez-vous à l'espace d'administration."
      footer={<span>Pas de compte ? Demandez une invitation à votre administrateur.</span>}
    >
      <Input label="Adresse e-mail" type="email" placeholder="vous@entreprise.fr" leadingIcon={<UserIcon size={16} />} value={email} onChange={(e) => setEmail(e.target.value)} />
      <InputPassword label="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button block selected>
        Se connecter
      </Button>
    </LoginPage>
  );
}

function SignUpDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  return (
    <SignUpPage
      imageSrc={ACCESS_IMAGE}
      imageAlt=""
      logo={logo}
      title="Créer un compte"
      subtitle="Quelques informations pour ouvrir votre espace."
      terms={<Checkbox checked={terms} onChange={setTerms} label="J'accepte les conditions générales et la politique de confidentialité" />}
      footer={<span>Déjà un compte ? Connectez-vous.</span>}
    >
      <Input label="Nom complet" placeholder="Claire Lemoine" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Adresse e-mail professionnelle" type="email" placeholder="vous@entreprise.fr" value={email} onChange={(e) => setEmail(e.target.value)} />
      <InputPassword label="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button block selected disabled={!terms}>
        Créer mon compte
      </Button>
    </SignUpPage>
  );
}

/** Le contenu commun aux deux coquilles : assez pour qu'on voie où la page commence. */
function DemoContent({ title }: { title: string }) {
  return (
    <div className="mdk-screen">
      <div>
        <Heading level={2}>{title}</Heading>
        <Text muted size="sm">
          Le contenu de la page se rend ici.
        </Text>
      </div>
      <div className="mdk-grid mdk-grid--stats">
        <StatCard label="Revenu mensuel" value="80 000 €" delta={12.4} deltaFormat={pct} sparklineData={REVENUE_TREND} />
        <StatCard label="Nouveaux clients" value="31" delta={-6.1} deltaFormat={pct} sparklineData={SIGNUPS_TREND} />
      </div>
    </div>
  );
}

const ACCOUNT_ITEMS = [
  { id: "profil", label: "Mon profil" },
  { id: "sortie", label: "Se déconnecter", danger: true },
];

/**
 * La planche des pages et des coquilles : les cinq gabarits plein écran du kit.
 *
 * Chacun est pensé pour occuper toute la fenêtre ; on les montre donc chacun dans un cadre de
 * hauteur fixe, qui défile, plutôt qu'en vrai — la vitrine elle-même est déjà une `SidebarLayout`,
 * et la miniature ci-dessous en est une seconde, avec son propre menu de démonstration.
 */
export function Pages() {
  const [section, setSection] = useState("tableau");
  const [tab, setTab] = useState("apercu");

  const sideNav = [
    { id: "tableau", label: "Tableau de bord", icon: <HomeIcon size={16} /> },
    { id: "factures", label: "Factures", icon: <FileIcon size={16} /> },
    { id: "clients", label: "Clients", icon: <UserIcon size={16} /> },
    {
      id: "reglages",
      label: "Réglages",
      icon: <SettingsIcon size={16} />,
      children: [
        { id: "equipe", label: "Équipe" },
        { id: "facturation", label: "Facturation" },
      ],
    },
  ].map((item) => ({
    ...item,
    active: item.id === section,
    onClick: () => setSection(item.id),
    children: item.children?.map((child) => ({ ...child, active: child.id === section, onClick: () => setSection(child.id) })),
  }));

  const topNav = [
    { id: "apercu", label: "Aperçu" },
    { id: "ventes", label: "Ventes" },
    { id: "rapports", label: "Rapports" },
  ].map((item) => ({ ...item, active: item.id === tab, onClick: () => setTab(item.id) }));

  return (
    <SpecimenScreen
      title="Pages et mises en page"
      intro="Les pages d'accès, la page introuvable et les deux coquilles d'application, chacune dans un cadre."
    >
      <SpecimenGrid>
        <Specimen name="LoginPage" description="Image sur trois quarts, formulaire de connexion dans le dernier quart." wide>
          <PageFrame>
            <LoginDemo />
          </PageFrame>
        </Specimen>

        <Specimen name="SignUpPage" description="Même gabarit, avec une case de conditions générales qui conditionne l'envoi." wide>
          <PageFrame>
            <SignUpDemo />
          </PageFrame>
        </Specimen>

        <Specimen name="NotFoundPage" description="Page introuvable, avec un chemin de retour." wide>
          <PageFrame>
            <NotFoundPage
              message="Cette facture n'existe pas, ou a été archivée."
              actionLabel="Retour au tableau de bord"
              onAction={() => undefined}
              illustration={<FileIcon size={48} />}
            />
          </PageFrame>
        </Specimen>

        <Specimen name="HeaderLayout" description="Coquille à navigation horizontale ; à droite, les actions et le compte." wide>
          <PageFrame>
            <HeaderLayout
              logo={logo}
              navItems={topNav}
              actions={
                <div className="mdk-row">
                  <Button icon={<BellIcon size={16} />}>3</Button>
                  <UserMenu name="Claire Lemoine" subtitle="Administratrice" items={ACCOUNT_ITEMS} />
                </div>
              }
            >
              <DemoContent title={topNav.find((t) => t.active)?.label ?? ""} />
            </HeaderLayout>
          </PageFrame>
        </Specimen>

        <Specimen name="SidebarLayout" description="Coquille à barre latérale — celle de cette vitrine — avec un menu de démonstration." wide>
          <PageFrame>
            <SidebarLayout
              logo={logo}
              navItems={sideNav}
              footer={<UserMenu name="Claire Lemoine" subtitle="Administratrice" items={ACCOUNT_ITEMS} placement="top" />}
              header={
                <Breadcrumbs
                  items={[
                    { id: "accueil", label: "Accueil", onClick: () => setSection("tableau") },
                    { id: "courant", label: "Tableau de bord" },
                  ]}
                />
              }
            >
              <DemoContent title="Tableau de bord" />
            </SidebarLayout>
          </PageFrame>
        </Specimen>
      </SpecimenGrid>
    </SpecimenScreen>
  );
}

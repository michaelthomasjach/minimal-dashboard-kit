import { useState, type FormEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoginPage, Input, InputPassword, Checkbox, Button, Badge, UserIcon, type LoginPageProps } from "@michaelthomasjach/liseuse-dashboard-kit";

/** L'image des pages d'accès. Une image ne lit pas les variables CSS : ses deux teintes reprennent
 *  donc à la main l'ardoise et le violet du thème. Locale et sans réseau. */
const ACCESS_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1400">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#2b303b"/>
          <stop offset="1" stop-color="#7252d3"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="1400" fill="url(#g)"/>
    </svg>
  `);

const LOGO = (
  <span style={{ fontSize: "1.375rem", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.04em", color: "var(--lq-color-text)" }}>minimal</span>
);

/** Le formulaire est l'affaire de l'appelant : un vrai `<form>`, pour qu'Entrée l'envoie. Le kit
 *  espace les enfants directs de sa zone de formulaire ; un `<form>` en est un, il reprend donc
 *  lui-même l'espacement. */
const FORM_STYLE = { display: "flex", flexDirection: "column", gap: "var(--lq-space-4)" } as const;

/** Une connexion de démonstration : les champs vides sont signalés, sinon on « connecte ». */
function signIn(initialEmail: string, initialError: string | undefined) {
  return function Render(args: LoginPageProps) {
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({ password: initialError });
    const [done, setDone] = useState(false);

    const submit = (e: FormEvent) => {
      e.preventDefault();
      const next = {
        email: email.includes("@") ? undefined : "Saisissez une adresse e-mail valide.",
        password: password ? undefined : "Saisissez votre mot de passe.",
      };
      setErrors(next);
      setDone(!next.email && !next.password);
    };

    return (
      <LoginPage {...args}>
        <form style={FORM_STYLE} onSubmit={submit} noValidate>
          <Input
            label="Adresse e-mail"
            type="email"
            autoComplete="email"
            placeholder="vous@entreprise.fr"
            leadingIcon={<UserIcon size={16} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <InputPassword
            label="Mot de passe"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <Checkbox checked={remember} onChange={setRemember} label="Rester connecté sur cet appareil" />
          <Button type="submit" block selected>
            Se connecter
          </Button>
          {done && <Badge tone="up">Connexion réussie (démonstration)</Badge>}
        </form>
      </LoginPage>
    );
  };
}

/**
 * La page de connexion plein écran : une grande image, et le formulaire dans le dernier quart.
 */
const meta = {
  title: "Pages/LoginPage",
  component: LoginPage,
  parameters: {
    layout: "fullscreen", mdkPadding: 0,
    docs: {
      story: { inline: false, iframeHeight: "620px" },
      description: {
        component: [
          "**Page de connexion** plein écran : une image sur les trois quarts de la largeur, et un panneau centré verticalement dans le dernier quart, qui porte la marque, un titre, le formulaire et un pied de page.",
          "",
          "**Quand l'utiliser** — l'écran d'entrée d'une application, hors de toute coquille (`SidebarLayout`, `HeaderLayout`). Pour la création de compte, `SignUpPage` reprend le même gabarit avec une case de conditions générales.",
          "",
          "**Anatomie** — `imageSrc` (obligatoire) et `imageAlt` (vide par défaut : l'image est décorative), `logo`, `title` (un vrai `<h1>`), `subtitle`, `children` (le formulaire), `footer` (lien d'inscription, mention légale). Le panneau fait 360 px de large au plus, 320 px au moins.",
          "",
          "**Le formulaire vous appartient** — le kit ne fournit que la mise en page : les champs, la validation et l'envoi sont à vous. Mettez-les dans un vrai `<form>` (Entrée envoie, `autoComplete` aide les gestionnaires de mots de passe) avec un bouton `type=\"submit\"`. Le kit espace les **enfants directs** de sa zone de formulaire (`--lq-space-4`) : un `<form>` étant un seul enfant, donnez-lui le même espacement (`display: flex; flex-direction: column; gap: var(--lq-space-4)`). Le kit n'a pas de prop `onSubmit`.",
          "",
          "**Écran étroit** — sous **900 px**, l'image disparaît et le panneau prend toute la page.",
          "",
          "**Thème** — `--lq-color-bg` (fond du panneau), `--lq-color-text` (titre), `--lq-color-text-muted` (sous-titre, pied), `--lq-font-weight-bold`, `--lq-space-4` à `--lq-space-6`. L'image ne lit pas les variables : choisissez-la dans les teintes du thème.",
        ].join("\n"),
      },
    },
  },
  args: {
    imageSrc: ACCESS_IMAGE,
    imageAlt: "",
    logo: LOGO,
    title: "Bon retour",
    subtitle: "Connectez-vous à l'espace d'administration.",
    footer: <span>Pas de compte ? Demandez une invitation à votre administrateur.</span>,
    children: null,
  },
  argTypes: {
    imageSrc: { control: "text" },
    imageAlt: { table: { defaultValue: { summary: '""' } } },
    logo: { control: false },
    footer: { control: false },
    children: { control: false },
  },
  render: signIn("", undefined),
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Défaut",
  parameters: { docs: { description: { story: "Envoyez le formulaire vide (Entrée ou bouton) : chaque champ dit ce qui manque." } } },
};

export const WithError: Story = {
  name: "Identifiants refusés",
  render: signIn("claire.lemoine@lemoine.fr", "Adresse ou mot de passe incorrect."),
  parameters: { docs: { description: { story: "Le retour d'un refus du serveur : l'erreur se pose sur le champ du mot de passe, l'adresse reste remplie." } } },
};

export const Minimal: Story = {
  name: "Sans logo ni pied",
  args: { logo: undefined, footer: undefined, subtitle: undefined, title: "Connexion" },
  parameters: { docs: { description: { story: "Le minimum : l'image, un titre et le formulaire." } } },
};

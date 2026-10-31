import { useState } from "react";
import { Card, Heading, Text, Button, Toggle } from "@michaelthomasjach/liseuse-dashboard-kit";
import { Input, Select, Checkbox, TagInput } from "@michaelthomasjach/liseuse-dashboard-kit";

const PLANS = [
  { value: "mensuel", label: "Mensuel" },
  { value: "annuel", label: "Annuel — deux mois offerts" },
  { value: "perso", label: "Sur mesure" },
];

/**
 * L'écran des formulaires : les contrôles du kit dans le thème, et le second manque qu'il révèle.
 *
 * Tout ce qu'on attend d'un formulaire d'administration est là — champ, liste, cases, interrupteur,
 * étiquettes — sauf le **bouton radio**, qui n'existe pas dans le kit. `SegmentedControl` sert
 * parfois de remplaçant, mais il ne l'est pas : un groupe radio porte des libellés longs, s'empile
 * verticalement et accepte une description par option. Le choix du plan ci-dessous est exactement
 * ce cas, et il est rendu avec une `Select` faute de mieux.
 */
export function Forms() {
  const [plan, setPlan] = useState<string | null>("annuel");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [notify, setNotify] = useState(true);
  const [tags, setTags] = useState<string[]>(["prioritaire", "grand compte"]);

  const emailError = email.length > 0 && !email.includes("@") ? "Adresse incomplète." : undefined;

  return (
    <div className="mdk-screen">
      <header className="mdk-screen__head">
        <div>
          <Heading level={1}>Formulaires</Heading>
          <Text muted size="sm">
            Les contrôles du kit, habillés par la couche de thème — aucune règle locale.
          </Text>
        </div>
      </header>

      <div className="mdk-grid mdk-grid--forms">
        <Card title="Compte client">
          <div className="mdk-stack">
            <Input label="Raison sociale" value={name} onChange={(e) => setName(e.target.value)} placeholder="Lemoine SAS" />
            <Input
              label="Courriel de facturation"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="compta@exemple.fr"
              error={emailError}
              helperText={emailError ? undefined : "Sert uniquement à l'envoi des factures."}
            />
            <Select label="Formule" options={PLANS} value={plan} onChange={setPlan} placeholder="Choisir une formule" />
            <TagInput label="Étiquettes" value={tags} onChange={setTags} placeholder="Ajouter…" />
          </div>
        </Card>

        <Card title="Préférences" footer={<Button>Enregistrer</Button>}>
          <div className="mdk-stack">
            <Checkbox checked={consent} onChange={setConsent} label="Accepter les conditions générales de vente" />
            <div className="mdk-row">
              <Toggle checked={notify} onChange={setNotify} ariaLabel="Recevoir les alertes de facturation" />
              <Text size="sm">Recevoir les alertes de facturation</Text>
            </div>
            <Text size="sm" muted>
              Le groupe radio manque au kit : la formule ci-contre devrait en être un, avec une
              description sous chaque option. Elle est rendue en liste déroulante en attendant.
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}

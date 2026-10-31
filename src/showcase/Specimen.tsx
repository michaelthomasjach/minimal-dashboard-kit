import type { ReactNode } from "react";
import { Heading, Text } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * Le gabarit des planches de composants.
 *
 * Les écrans de référence (Vue d'ensemble, Tableaux, Formulaires) sont des mises en page ; les
 * planches, elles, montrent le kit composant par composant. Elles se comptent par dizaines, et une
 * planche écrite à la main chaque fois finirait par avoir dix allures différentes — c'est ce
 * gabarit qui les tient au même rang : un en-tête d'écran, puis une suite de spécimens, chacun
 * nommé par le composant exact du kit qu'il montre.
 */
export function SpecimenScreen({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <div className="mdk-screen">
      <header className="mdk-screen__head">
        <div>
          <Heading level={1}>{title}</Heading>
          <Text muted size="sm">
            {intro}
          </Text>
        </div>
      </header>
      {children}
    </div>
  );
}

/**
 * Un spécimen : le nom du composant, une ligne qui dit à quoi il sert, et le composant vivant.
 *
 * `wide` lui donne toute la largeur de l'écran — pour un graphique, un tableau, un calendrier, tout
 * ce qui se lit mal dans une demi-colonne.
 */
export function Specimen({
  name,
  description,
  wide,
  children,
}: {
  /** Le nom exact de l'export du kit, ou plusieurs séparés par « · ». */
  name: string;
  description?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={wide ? "mdk-specimen mdk-specimen--wide" : "mdk-specimen"}>
      <header className="mdk-specimen__head">
        <code className="mdk-specimen__name">{name}</code>
        {description ? (
          <Text size="sm" muted>
            {description}
          </Text>
        ) : null}
      </header>
      <div className="mdk-specimen__body">{children}</div>
    </section>
  );
}

/** La grille qui range les spécimens : deux colonnes quand la largeur le permet, une sinon. */
export function SpecimenGrid({ children }: { children: ReactNode }) {
  return <div className="mdk-specimens">{children}</div>;
}

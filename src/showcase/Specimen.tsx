import type { ReactNode } from "react";
import { Heading, Text } from "@michaelthomasjach/liseuse-dashboard-kit";

/**
 * L'en-tête d'un écran, sur le modèle des titres de section du gabarit Pages : un titre de 27 px
 * (le `h3` du kit, que le thème règle à cette taille) et une phrase d'introduction en texte courant,
 * pas atténué. Le gabarit n'a pas de titre de page plus gros que celui-là sous sa barre haute.
 *
 * Commun aux écrans de référence et aux planches, pour qu'aucun écran ne parle autrement.
 */
export function ScreenHead({ title, intro, actions }: { title: string; intro: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mdk-screen__head">
      <div className="mdk-screen__titles">
        <Heading level={3}>{title}</Heading>
        <Text>{intro}</Text>
      </div>
      {actions}
    </header>
  );
}

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
      <ScreenHead title={title} intro={intro} />
      {children}
    </div>
  );
}

/**
 * Un spécimen, dans l'anatomie d'une carte du gabarit : le nom du composant en petit titre
 * (Montserrat en capitales, les variables `--lq-label-*` du thème), sans filet dessous, puis le
 * corps — une phrase qui dit à quoi il sert, et le composant vivant.
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
        <h2 className="mdk-specimen__name">{name}</h2>
      </header>
      <div className="mdk-specimen__body">
        {description ? <p className="mdk-specimen__description">{description}</p> : null}
        {children}
      </div>
    </section>
  );
}

/** La grille qui range les spécimens : deux colonnes quand la largeur le permet, une sinon. */
export function SpecimenGrid({ children }: { children: ReactNode }) {
  return <div className="mdk-specimens">{children}</div>;
}

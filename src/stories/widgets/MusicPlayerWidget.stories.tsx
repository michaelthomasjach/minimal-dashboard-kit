import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { MusicPlayerWidget } from "@michaelthomasjach/liseuse-dashboard-kit";

const TRACKS = [
  { title: "La Javanaise", artist: "Serge Gainsbourg · Confidentiel" },
  { title: "Le Tourbillon", artist: "Jeanne Moreau · Jules et Jim" },
  { title: "La Mer", artist: "Charles Trenet · La Mer" },
];

/** Une pochette de repli dessinée en CSS : la story n'a pas d'image à charger. */
const NOTE = <span aria-hidden="true">♪</span>;

/**
 * La carte « en cours de lecture » : pochette, titre, artiste, trois boutons de transport et une
 * jauge de volume. Le lecteur lui-même est ailleurs — le widget ne joue rien.
 */
const meta = {
  title: "Composants/Widgets/MusicPlayerWidget",
  component: MusicPlayerWidget,
  parameters: {
    docs: {
      description: {
        component: [
          "Carte compacte **« en cours de lecture »** : la pochette (ou un repli), le titre et l'artiste, les commandes précédent / lecture-pause / suivant, et une jauge de volume.",
          "",
          "**Quand l'utiliser** — pour piloter une source audio extérieure (enceinte connectée, radio, lecteur réseau) depuis un tableau de bord. Ce n'est pas un lecteur : le widget ne lit aucun fichier et n'a pas de barre de progression. Pour régler un niveau ou une balance, voir `BalanceControl`, `LevelMeter` et `Equalizer`.",
          "",
          "**Contrôlé** — `isPlaying` dit l'état, `onPlayPause` est appelé au clic et c'est à l'application de basculer l'état (le bouton passe de « Lecture » à « Pause », nom accessible compris). `onPrev` et `onNext` sont facultatifs : **sans eux, le bouton correspondant est désactivé**, pour une source qui n'a pas de piste suivante (une radio).",
          "",
          "**Pochette** — `cover` est l'URL d'une image ; sans elle, `coverFallback` occupe la case (une note, des initiales). **Volume** — `volume` (0 à 100) affiche une jauge de 16 segments avec son pourcentage ; absent, la ligne disparaît. Le volume est **en lecture seule** : le kit ne propose pas de rappel pour le régler depuis la carte.",
          "",
          "**Thème** — `--lq-color-text`, `--lq-color-text-muted`, `--lq-color-border`, `--lq-color-border-subtle`, `--lq-color-fill-track` (fond de la jauge), `--lq-radius-sm` (pochette), `--lq-space-3`, `--lq-space-4`, et celles d'`IconButton`.",
        ].join("\n"),
      },
    },
  },
  args: {
    title: TRACKS[0].title,
    artist: TRACKS[0].artist,
    coverFallback: NOTE,
    isPlaying: true,
    volume: 35,
    onPlayPause: fn(),
    onPrev: fn(),
    onNext: fn(),
  },
  argTypes: {
    volume: { control: { type: "range", min: 0, max: 100, step: 1 } },
    coverFallback: { control: false },
    onPlayPause: { control: false },
    onPrev: { control: false },
    onNext: { control: false },
  },
  // Lecture / pause et le changement de piste sont tenus par la story ; les contrôles règlent le reste.
  render: function Render(args) {
    const [playing, setPlaying] = useState(args.isPlaying);
    useEffect(() => setPlaying(args.isPlaying), [args.isPlaying]);
    return (
      <div style={{ maxWidth: 360 }}>
        <MusicPlayerWidget
          {...args}
          isPlaying={playing}
          onPlayPause={() => {
            setPlaying((p) => !p);
            args.onPlayPause();
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof MusicPlayerWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Défaut" };

export const Playlist: Story = {
  name: "Liste de lecture",
  render: function Render(args) {
    const [playing, setPlaying] = useState(true);
    const [track, setTrack] = useState(0);
    const current = TRACKS[track];
    return (
      <div style={{ maxWidth: 360 }}>
        <MusicPlayerWidget
          {...args}
          title={current.title}
          artist={current.artist}
          isPlaying={playing}
          onPlayPause={() => setPlaying((p) => !p)}
          onPrev={() => setTrack((t) => (t + TRACKS.length - 1) % TRACKS.length)}
          onNext={() => setTrack((t) => (t + 1) % TRACKS.length)}
        />
      </div>
    );
  },
  parameters: { docs: { description: { story: "Précédent et suivant parcourent trois morceaux ; la carte n'affiche que ce que l'application lui passe." } } },
};

export const Radio: Story = {
  name: "Radio, sans piste suivante",
  args: { title: "France Musique", artist: "En direct", onPrev: undefined, onNext: undefined, volume: 60 },
  parameters: { docs: { description: { story: "Sans `onPrev` ni `onNext`, les deux boutons sont désactivés." } } },
};

export const Paused: Story = {
  name: "En pause, sans volume",
  args: { isPlaying: false, volume: undefined, title: "La Mer", artist: "Charles Trenet · La Mer" },
};

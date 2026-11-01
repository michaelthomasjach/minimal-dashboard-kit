/**
 * Les illustrations des tuiles du tableau de bord, générées ici en SVG.
 *
 * Le gabarit Pages illustre ses tuiles de photographies qui lui appartiennent : on n'en reprend
 * aucune. Ces deux scènes en aplats tiennent le même rôle — un fond riche sous un voile et un titre
 * blanc — sans rien télécharger et sans droits à régler.
 */

const svg = (body: string, w = 800, h = 520) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">${body}</svg>`)}`;

/** Un paysage de crêtes bleues sous un soleil pâle — la grande tuile « Explorer ». */
export const EXPLORE_ART = svg(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb8e8"/><stop offset="1" stop-color="#d7e6f6"/></linearGradient>
  </defs>
  <rect width="800" height="520" fill="url(#sky)"/>
  <circle cx="590" cy="150" r="70" fill="#f4f8fc" opacity=".85"/>
  <path d="M0 330 L120 250 L210 300 L330 200 L450 290 L560 230 L680 300 L800 240 V520 H0Z" fill="#6f9bd1"/>
  <path d="M0 390 L140 320 L260 370 L380 300 L520 380 L640 330 L800 380 V520 H0Z" fill="#4f7fbd"/>
  <path d="M0 450 L160 400 L300 440 L460 390 L600 450 L800 410 V520 H0Z" fill="#355f99"/>
`);

/** Des plis de papier magenta, façon origami — la tuile « Actualité ». */
export const NEWS_ART = svg(`
  <rect width="600" height="600" fill="#8f86b8"/>
  <polygon points="300,60 470,250 300,330" fill="#c2185b"/>
  <polygon points="300,60 130,250 300,330" fill="#ad1457"/>
  <polygon points="130,250 300,330 220,520" fill="#d81b60"/>
  <polygon points="470,250 300,330 380,520" fill="#e91e63"/>
  <polygon points="300,330 220,520 380,520" fill="#b0124f"/>
  <polygon points="470,250 560,120 520,300" fill="#ec407a"/>
`, 600, 600);

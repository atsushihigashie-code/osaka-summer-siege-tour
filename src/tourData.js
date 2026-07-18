const BASE = import.meta.env.BASE_URL; // '/' standalone, '/summer-siege-tour/' when embedded
const asset = (path) => BASE.replace(/\/$/, '') + path;

// 2-column x 5-row grid, matching the original PDF layout (1,2 / 3,4 / 5,6 / 7,8 / 9,10)
const GRID_PAD_X = 6; // vw
const GRID_GAP_X = 3; // vw
const GRID_PAD_Y = 4; // vh
const GRID_GAP_Y = 1.6; // vh
const CELL_W = (100 - 2 * GRID_PAD_X - GRID_GAP_X) / 2; // vw
const CELL_H = (100 - 2 * GRID_PAD_Y - GRID_GAP_Y * 4) / 5; // vh

function gridBoxFor(index) {
  const row = Math.floor(index / 2);
  const col = index % 2;
  const centerXvw = GRID_PAD_X + col * (CELL_W + GRID_GAP_X) + CELL_W / 2;
  const centerYvh = GRID_PAD_Y + row * (CELL_H + GRID_GAP_Y) + CELL_H / 2;
  return {
    tx: (centerXvw - 50).toFixed(2), // vw offset from viewport center
    ty: (centerYvh - 50).toFixed(2), // vh offset from viewport center
    sx: (CELL_W / 100).toFixed(4),
    sy: (CELL_H / 100).toFixed(4),
  };
}

export const slides = [
  {
    id: 1,
    audio: asset("/audio/大阪城ツアー1.mp3"),
    image: asset("/slides/slide_01.jpg"),
    eyebrow: "1615",
    title: "The Summer Siege of Osaka",
    subtitle: "The final clash for the realm and the tactical archetypes that defined it.",
    zoomFrom: "center 40%",
    zoomTo: "center 55%",
  },
  {
    id: 2,
    audio: asset("/audio/大阪城ツアー2.mp3"),
    image: asset("/slides/slide_02.jpg"),
    eyebrow: "The Board is Set",
    title: "Two Armies, Two Fates",
    subtitle:
      "The Tokugawa: an overwhelming force securing a new order. The Toyotomi: the last heroes fighting a doomed resistance.",
    zoomFrom: "left 30%",
    zoomTo: "right 60%",
  },
  {
    id: 3,
    audio: asset("/audio/大阪城ツアー3.mp3"),
    image: asset("/slides/slide_03.jpg"),
    eyebrow: "Opposing Philosophies",
    title: "Rear Command vs. Front-Line Desperation",
    subtitle:
      "Tokugawa Hidetada commanded from a calm, calculated distance. Ono Harunaga stood at the volatile center of the Toyotomi's front line.",
    zoomFrom: "center 20%",
    zoomTo: "center 70%",
  },
  {
    id: 4,
    audio: asset("/audio/大阪城ツアー4.mp3"),
    image: asset("/slides/slide_04.jpg"),
    eyebrow: "The Shogun's Bloodline",
    title: "Encirclement by Blood",
    subtitle:
      "Matsudaira Tadanao, Tokugawa Yorinobu, Matsudaira Tadateru, Tokugawa Yoshinao — Ieyasu's own line, positioned to seal the outcome.",
    zoomFrom: "center 25%",
    zoomTo: "center 65%",
  },
  {
    id: 5,
    audio: asset("/audio/大阪城ツアー5.mp3"),
    image: asset("/slides/slide_05.jpg"),
    eyebrow: "The Generation of 1600",
    title: "Boys Sent Into War",
    subtitle:
      "Some as young as thirteen — Sanada Daisuke stayed inside the castle with his father, a doomed symbol of resistance beside his clan.",
    zoomFrom: "center 15%",
    zoomTo: "center 60%",
  },
  {
    id: 6,
    audio: asset("/audio/大阪城ツアー6.mp3"),
    image: asset("/slides/slide_06.jpg"),
    eyebrow: "The Pillars of Resistance",
    title: "Mori Katsunaga's Last Charge",
    subtitle:
      "One of the Five Elders of Osaka. At Tennoji, he launched a fierce frontal assault on the Tokugawa forces before choosing death over surrender.",
    zoomFrom: "left 50%",
    zoomTo: "right 45%",
  },
  {
    id: 7,
    audio: asset("/audio/大阪城ツアー7.mp3"),
    image: asset("/slides/slide_07.jpg"),
    eyebrow: "Factions Within the Fortress",
    title: "The Moderate and the Hardliner",
    subtitle:
      "Ono Harunaga favored negotiation to save the Toyotomi line. His brother Harufusa pushed for continued war — and vanished when the castle burned.",
    zoomFrom: "left 35%",
    zoomTo: "right 55%",
  },
  {
    id: 8,
    audio: asset("/audio/大阪城ツアー8.mp3"),
    image: asset("/slides/slide_08.jpg"),
    eyebrow: "The Climax",
    title: "The Tennoji Breakthrough",
    subtitle:
      "Sanada Yukimura's suicidal charge broke the Shogunate's three lines, driving Ieyasu to the very brink of taking his own life.",
    zoomFrom: "right 60%",
    zoomTo: "left 35%",
  },
  {
    id: 9,
    audio: asset("/audio/大阪城ツアー9.mp3"),
    image: asset("/slides/slide_09.jpg"),
    eyebrow: "Japan's Greatest Warrior",
    title: "Sanada Yukimura",
    subtitle:
      "Age 49. The last great hero of the Sengoku period. He drove Ieyasu to the brink before falling in battle at Tennoji.",
    zoomFrom: "center 30%",
    zoomTo: "center 60%",
  },
  {
    id: 10,
    audio: asset("/audio/大阪城ツアー10.mp3"),
    image: asset("/slides/slide_10.jpg"),
    eyebrow: "260 Years",
    title: "The Dawn of the Edo Period",
    subtitle:
      "From Ieyasu to the 15th Shogun Yoshinobu, the Tokugawa Shogunate held power until 1868 — when imperial rule was restored and the Meiji era began.",
    zoomFrom: "left 40%",
    zoomTo: "right 40%",
  },
].map((s, i) => ({ ...s, gridBox: gridBoxFor(i) }));

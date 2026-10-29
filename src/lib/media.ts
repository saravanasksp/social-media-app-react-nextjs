const PX = (id: number, ext: "jpeg" | "png" = "jpeg", size = 960) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb&fit=crop&w=${size}&h=${size}`;

export const photos = {
  cliff: PX(1675183),
  andes: PX(18277102),
  layers: PX(40427957),
  hills: PX(31537627),
  peak: PX(35279782),
  boat: PX(1136919),
  pier: PX(24838084),
  dusk: PX(16448010),
  stockholm: PX(14745047),
  nyc: PX(245584),
  monochrome: PX(38268742),
  station: PX(18260084),
  mirror: PX(28251602),
  trams: PX(16824948),
  market: PX(15616136),
  couple: PX(26821403),
  coffeeNews: PX(2325307),
  latteHands: PX(2074118),
  cafeCamera: PX(19569363),
  latteArt: PX(35107742),
  coffeeCookies: PX(2074122),
  latteTable: PX(8046389),
  coffeeDark: PX(15801080),
  brunch: PX(2074124),
  swimmer: PX(12168711),
  waves: PX(4603458),
  aerialBeach: PX(737552),
  sand: PX(2128270),
  beachCrowd: PX(137703),
  rocky: PX(39984649),
  portugalCoast: PX(39102777),
  storm: PX(772831),
  plantDoor: PX(12470368),
  vase: PX(29904622),
  houseplant: PX(993626),
  pottery: PX(19884207, "png"),
  interior: PX(18063845, "png"),
  succulents: PX(13336361),
  monstera: PX(13037086),
  bedroom: PX(39196722),
} as const;

export const avatars = {
  maya: PX(16160871, "jpeg", 320),
  leo: PX(16160855, "jpeg", 320),
  sana: PX(3926827, "jpeg", 320),
  kenji: PX(16160859, "jpeg", 320),
  ivy: PX(34673103, "jpeg", 320),
  marco: PX(6265198, "jpeg", 320),
  noa: PX(10538885, "jpeg", 320),
  theo: PX(17265016, "jpeg", 320),
} as const;

export type GalleryImage = { url: string; label: string };

export const createGallery: GalleryImage[] = [
  { url: photos.cliff, label: "Coastline at dawn" },
  { url: photos.waves, label: "Ocean swell" },
  { url: photos.stockholm, label: "Old town street" },
  { url: photos.coffeeNews, label: "Slow morning" },
  { url: photos.plantDoor, label: "Quiet corner" },
  { url: photos.peak, label: "Mountain light" },
  { url: photos.mirror, label: "Glass & sky" },
  { url: photos.pottery, label: "Handmade shelf" },
  { url: photos.bedroom, label: "Soft interiors" },
  { url: photos.market, label: "Market colours" },
  { url: photos.aerialBeach, label: "From above" },
  { url: photos.latteArt, label: "Coffee ritual" },
];

export const EXPLORE_TAGS = [
  "slowliving",
  "filmphotography",
  "coastline",
  "quietcorners",
  "citytextures",
  "ceramics",
];

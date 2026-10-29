import { sql } from "drizzle-orm";
import { db } from "@/db";
import { comments, follows, likes, posts, saves, stories, users } from "@/db/schema";
import { avatars, photos } from "@/lib/media";
import { hashPassword } from "@/lib/password";

const DEMO_PASSWORD = "password123";
const MINUTE = 60 * 1000;

const globalForSeed = globalThis as typeof globalThis & {
  __vignetteSeed?: Promise<void>;
};

export function ensureSeeded(): Promise<void> {
  if (!globalForSeed.__vignetteSeed) {
    globalForSeed.__vignetteSeed = runSeed().catch((error: unknown) => {
      globalForSeed.__vignetteSeed = undefined;
      throw error;
    });
  }
  return globalForSeed.__vignetteSeed;
}

type UserSeed = {
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  website?: string;
  location?: string;
};

const userSeeds: UserSeed[] = [
  {
    username: "maya",
    displayName: "Maya Okafor",
    email: "maya@vignette.app",
    avatarUrl: avatars.maya,
    bio: "Photographer chasing warm light.\nLisbon ⇄ Lagos. Prints in the highlights.",
    website: "mayaokafor.studio",
    location: "Lisbon, Portugal",
  },
  {
    username: "leo",
    displayName: "Leo Lindqvist",
    email: "leo@vignette.app",
    avatarUrl: avatars.leo,
    bio: "Film photography & slow coffee. Nothing is urgent.",
    website: "leolindqvist.se",
    location: "Stockholm, Sweden",
  },
  {
    username: "sana",
    displayName: "Sana Iqbal",
    email: "sana@vignette.app",
    avatarUrl: avatars.sana,
    bio: "Interiors, quiet corners and slow mornings.\nCurrently: soft edges only.",
    website: "sanaiqbal.home",
    location: "London, UK",
  },
  {
    username: "kenji",
    displayName: "Kenji Mori",
    email: "kenji@vignette.app",
    avatarUrl: avatars.kenji,
    bio: "Streets, trains, and the moments in between.",
    location: "Tokyo, Japan",
  },
  {
    username: "ivy",
    displayName: "Ivy Chen",
    email: "ivy@vignette.app",
    avatarUrl: avatars.ivy,
    bio: "Ceramicist. Small batch stoneware out of a sunny studio.",
    website: "clayandco.shop",
    location: "Portland, USA",
  },
  {
    username: "marco",
    displayName: "Marco Duarte",
    email: "marco@vignette.app",
    avatarUrl: avatars.marco,
    bio: "Waves, sun and a little bit of salt.",
    location: "Ericeira, Portugal",
  },
  {
    username: "noa",
    displayName: "Noa Pereira",
    email: "noa@vignette.app",
    avatarUrl: avatars.noa,
    bio: "Designer. Type nerd. Making things with care.",
    website: "noapereira.design",
    location: "Barcelona, Spain",
  },
  {
    username: "theo",
    displayName: "Theo Bennett",
    email: "theo@vignette.app",
    avatarUrl: avatars.theo,
    bio: "Up before the sun, mostly for the view.",
    location: "Dolomites, Italy",
  },
];

type PostSeed = {
  username: string;
  imageUrl: string;
  caption: string;
  location: string;
  minutesAgo: number;
};

const postSeeds: PostSeed[] = [
  {
    username: "maya",
    imageUrl: photos.cliff,
    caption:
      "First light does something to my brain. Six hours of sleep, one impossible sunrise, zero regrets. #coastline",
    location: "Praia da Marinha, Portugal",
    minutesAgo: 42,
  },
  {
    username: "leo",
    imageUrl: photos.coffeeNews,
    caption: "Slow start, strong coffee. The whole morning plan. #slowliving",
    location: "Stockholm, Sweden",
    minutesAgo: 95,
  },
  {
    username: "kenji",
    imageUrl: photos.nyc,
    caption: "Crossing against the light. #citytextures",
    location: "New York, USA",
    minutesAgo: 170,
  },
  {
    username: "noa",
    imageUrl: photos.mirror,
    caption: "The building was doing something strange with the sky.",
    location: "Barcelona, Spain",
    minutesAgo: 240,
  },
  {
    username: "marco",
    imageUrl: photos.waves,
    caption: "Caught this one at the end of the set. Cold hands, warm light.",
    location: "Ericeira, Portugal",
    minutesAgo: 310,
  },
  {
    username: "ivy",
    imageUrl: photos.houseplant,
    caption: "New glaze test came out better than expected. Keeping this one.",
    location: "Portland, USA",
    minutesAgo: 420,
  },
  {
    username: "sana",
    imageUrl: photos.plantDoor,
    caption: "A corner that finally feels finished. #quietcorners",
    location: "London, UK",
    minutesAgo: 540,
  },
  {
    username: "theo",
    imageUrl: photos.peak,
    caption: "Got up at four. Regret nothing.",
    location: "Dolomites, Italy",
    minutesAgo: 660,
  },
  {
    username: "maya",
    imageUrl: photos.market,
    caption: "Sunday market colours. Bought peaches I will absolutely eat in the car.",
    location: "Lisbon, Portugal",
    minutesAgo: 1500,
  },
  {
    username: "leo",
    imageUrl: photos.stockholm,
    caption: "Winter light on a Tuesday. The city was almost quiet.",
    location: "Stockholm, Sweden",
    minutesAgo: 1700,
  },
  {
    username: "kenji",
    imageUrl: photos.monochrome,
    caption: "Concrete geometry. Nothing else needed.",
    location: "São Paulo, Brazil",
    minutesAgo: 1900,
  },
  {
    username: "sana",
    imageUrl: photos.bedroom,
    caption: "Soft edges, warm light, nothing to do today.",
    location: "London, UK",
    minutesAgo: 2300,
  },
  {
    username: "marco",
    imageUrl: photos.aerialBeach,
    caption: "The shoreline from above. Not a soul in sight. #coastline",
    location: "Peniche, Portugal",
    minutesAgo: 2700,
  },
  {
    username: "ivy",
    imageUrl: photos.succulents,
    caption: "Small things, slowly. #ceramics",
    location: "Portland, USA",
    minutesAgo: 2900,
  },
  {
    username: "noa",
    imageUrl: photos.latteTable,
    caption: "Studio fuel. Back to the type specimens.",
    location: "Barcelona, Spain",
    minutesAgo: 3200,
  },
  {
    username: "maya",
    imageUrl: photos.portugalCoast,
    caption: "The long way home. Always the long way home.",
    location: "Algarve, Portugal",
    minutesAgo: 4300,
  },
  {
    username: "theo",
    imageUrl: photos.pier,
    caption: "The fisherman caught nothing. Good morning anyway.",
    location: "Lake Zürich, Switzerland",
    minutesAgo: 5100,
  },
  {
    username: "kenji",
    imageUrl: photos.trams,
    caption: "Two of the same, going different ways.",
    location: "Lisbon, Portugal",
    minutesAgo: 6000,
  },
  {
    username: "leo",
    imageUrl: photos.station,
    caption: "Waiting for the 7:12.",
    location: "Melbourne, Australia",
    minutesAgo: 6900,
  },
  {
    username: "sana",
    imageUrl: photos.pottery,
    caption: "Shelf life. Every piece has a story now.",
    location: "London, UK",
    minutesAgo: 7600,
  },
  {
    username: "leo",
    imageUrl: photos.cafeCamera,
    caption: "Brunch with the camera I keep saying I'll sell.",
    location: "Stockholm, Sweden",
    minutesAgo: 8400,
  },
  {
    username: "maya",
    imageUrl: photos.vase,
    caption: "Objects with a history. Found this in a shop with no sign.",
    location: "Lagos, Portugal",
    minutesAgo: 9200,
  },
  {
    username: "ivy",
    imageUrl: photos.monstera,
    caption: "Studio move day one. The plant is thriving, I am exhausted.",
    location: "Portland, USA",
    minutesAgo: 10500,
  },
  {
    username: "marco",
    imageUrl: photos.swimmer,
    caption: "Salt water cures most things.",
    location: "Ericeira, Portugal",
    minutesAgo: 11800,
  },
];

type CommentSeed = { post: number; username: string; body: string; minutesAgo: number };

const commentSeeds: CommentSeed[] = [
  { post: 0, username: "leo", body: "That gradient. Worth the 4am alarm.", minutesAgo: 20 },
  { post: 0, username: "sana", body: "Frame this one, seriously.", minutesAgo: 18 },
  { post: 0, username: "marco", body: "Praia da Marinha never misses.", minutesAgo: 12 },
  { post: 1, username: "maya", body: "The newspaper is a nice touch.", minutesAgo: 70 },
  { post: 1, username: "noa", body: "Same mug every morning? Respect.", minutesAgo: 55 },
  { post: 2, username: "theo", body: "This looks like a film still.", minutesAgo: 130 },
  { post: 2, username: "sana", body: "The scale of that street is everything.", minutesAgo: 100 },
  { post: 4, username: "maya", body: "Those colours are unreal.", minutesAgo: 200 },
  { post: 4, username: "kenji", body: "Print swap? I'll trade a street frame.", minutesAgo: 180 },
  { post: 5, username: "sana", body: "That glaze is gorgeous.", minutesAgo: 300 },
  { post: 6, username: "ivy", body: "The plant + door combo is perfect.", minutesAgo: 400 },
  { post: 7, username: "noa", body: "4am club. Was it freezing?", minutesAgo: 500 },
  { post: 8, username: "leo", body: "Those peaches are elite.", minutesAgo: 1200 },
  { post: 9, username: "maya", body: "Quiet city days are the best days.", minutesAgo: 1400 },
  { post: 12, username: "maya", body: "I want to be there immediately.", minutesAgo: 2100 },
  { post: 15, username: "theo", body: "That coastline is a painting.", minutesAgo: 3600 },
  { post: 16, username: "leo", body: "Good mornings don't need fish.", minutesAgo: 4500 },
  { post: 17, username: "maya", body: "Lisbon suits your eye.", minutesAgo: 5200 },
  { post: 18, username: "sana", body: "Platform light is so underrated.", minutesAgo: 6100 },
  { post: 20, username: "noa", body: "Sell it to me. I'll pay in coffee.", minutesAgo: 7300 },
  { post: 22, username: "ivy", body: "The plant always wins.", minutesAgo: 9400 },
  { post: 23, username: "maya", body: "Most things, honestly.", minutesAgo: 10100 },
];

const followSeeds: [string, string][] = [
  ["maya", "leo"],
  ["maya", "sana"],
  ["maya", "marco"],
  ["maya", "ivy"],
  ["leo", "maya"],
  ["leo", "sana"],
  ["leo", "kenji"],
  ["sana", "maya"],
  ["sana", "ivy"],
  ["kenji", "maya"],
  ["kenji", "leo"],
  ["kenji", "theo"],
  ["ivy", "maya"],
  ["ivy", "sana"],
  ["marco", "maya"],
  ["marco", "leo"],
  ["noa", "maya"],
  ["noa", "sana"],
  ["noa", "leo"],
  ["theo", "maya"],
  ["theo", "marco"],
];

const storySeeds: { username: string; imageUrl: string; caption: string; minutesAgo: number }[] = [
  { username: "maya", imageUrl: photos.andes, caption: "Scouting light for the zine", minutesAgo: 25 },
  { username: "leo", imageUrl: photos.latteHands, caption: "Third coffee, no notes", minutesAgo: 48 },
  { username: "sana", imageUrl: photos.interior, caption: "Studio corner rework", minutesAgo: 90 },
  { username: "kenji", imageUrl: photos.couple, caption: "Golden hour in the city", minutesAgo: 120 },
  { username: "marco", imageUrl: photos.rocky, caption: "Tide is coming in", minutesAgo: 150 },
  { username: "ivy", imageUrl: photos.houseplant, caption: "Kiln day", minutesAgo: 190 },
  { username: "theo", imageUrl: photos.layers, caption: "Above the clouds, again", minutesAgo: 240 },
  { username: "noa", imageUrl: photos.coffeeDark, caption: "Type deadline fuel", minutesAgo: 300 },
];

async function runSeed(): Promise<void> {
  const existing = await db
    .select({ count: sql<number>`count(*)::int`.mapWith(Number) })
    .from(users);
  if ((existing[0]?.count ?? 0) > 0) return;

  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const now = Date.now();

  await db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(918273645)`);

    const recheck = await tx
      .select({ count: sql<number>`count(*)::int`.mapWith(Number) })
      .from(users);
    if ((recheck[0]?.count ?? 0) > 0) return;

    const insertedUsers = await tx
      .insert(users)
      .values(
        userSeeds.map((seed) => ({
          username: seed.username,
          displayName: seed.displayName,
          email: seed.email,
          passwordHash,
          avatarUrl: seed.avatarUrl,
          bio: seed.bio,
          website: seed.website ?? null,
          location: seed.location ?? null,
        })),
      )
      .returning({ id: users.id, username: users.username });

    const userIds = new Map(insertedUsers.map((row) => [row.username, row.id]));

    const insertedPosts = await tx
      .insert(posts)
      .values(
        postSeeds.map((seed) => ({
          userId: userIds.get(seed.username) as number,
          imageUrl: seed.imageUrl,
          caption: seed.caption,
          location: seed.location,
          createdAt: new Date(now - seed.minutesAgo * MINUTE),
        })),
      )
      .returning({ id: posts.id, userId: posts.userId, imageUrl: posts.imageUrl });

    const postIdByKey = new Map(
      insertedPosts.map((row) => [`${row.userId}|${row.imageUrl}`, row.id]),
    );
    const postIds = postSeeds.map(
      (seed) =>
        postIdByKey.get(`${userIds.get(seed.username) as number}|${seed.imageUrl}`) as number,
    );

    const allUserIds = insertedUsers.map((row) => row.id);

    const likeValues: { postId: number; userId: number; createdAt: Date }[] = [];
    postIds.forEach((postId, postIndex) => {
      allUserIds.forEach((userId, userIndex) => {
        if ((postIndex * 3 + userIndex * 5) % 7 <= 1) {
          likeValues.push({
            postId,
            userId,
            createdAt: new Date(
              now - (postSeeds[postIndex].minutesAgo - 10 + postIndex * 3 + userIndex * 7) * MINUTE,
            ),
          });
        }
      });
    });
    await tx.insert(likes).values(likeValues);

    const commentValues = commentSeeds
      .filter((seed) => seed.body.trim().length > 0 && userIds.has(seed.username))
      .map((seed) => ({
        postId: postIds[seed.post],
        userId: userIds.get(seed.username) as number,
        body: seed.body,
        createdAt: new Date(now - seed.minutesAgo * MINUTE),
      }));
    await tx.insert(comments).values(commentValues);

    await tx.insert(follows).values(
      followSeeds.map(([follower, following]) => ({
        followerId: userIds.get(follower) as number,
        followingId: userIds.get(following) as number,
        createdAt: new Date(now - 60 * 24 * 60 * MINUTE),
      })),
    );

    const mayaId = userIds.get("maya") as number;
    await tx.insert(saves).values(
      [1, 5, 6, 12, 20].map((index) => ({
        postId: postIds[index],
        userId: mayaId,
        createdAt: new Date(now - (index + 1) * 90 * MINUTE),
      })),
    );

    await tx.insert(stories).values(
      storySeeds.map((seed) => ({
        userId: userIds.get(seed.username) as number,
        imageUrl: seed.imageUrl,
        caption: seed.caption,
        createdAt: new Date(now - seed.minutesAgo * MINUTE),
      })),
    );
  });
}

export const DEMO_CREDENTIALS = { username: "maya", password: DEMO_PASSWORD };

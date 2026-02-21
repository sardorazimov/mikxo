import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

// --- KULLANICILAR (Instagram Mantığı) ---
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 30 }).unique(), // @yazilimci
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash"), // Email/Sifre girişi için
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  isOnline: boolean("is_online").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  bio: text("bio"),
  isBot: boolean("is_bot").default(false).notNull(),
  googleId: text("google_id").unique(),
 country: text("country"), 
  bannerUrl: text("banner_url"),

  birthDate: timestamp("birth_date"),

  website: text("website"),

  twitter: text("twitter"),

  github: text("github"),
});

// --- KANALLAR (Hashtag # Odaklı) ---
export const channels = pgTable("channels", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 50 }).unique().notNull(), // #genel, #proje-x
  description: text("description"),
  isPrivate: boolean("is_private").default(false),
  creatorId: uuid("creator_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- MESAJLAR (Hibrit Mesajlaşma) ---
export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  senderId: uuid("sender_id")
    .references(() => users.id)
    .notNull(),

  // Mesajın nereye gittiği: Kanal mı yoksa DM mi?
  channelId: uuid("channel_id").references(() => channels.id),
  receiverId: uuid("receiver_id").references(() => users.id), // DM için

  content: text("content"), // Ana metin

  // Medya Desteği (Resim, Ses, PDF)
  attachmentUrl: text("attachment_url"),
  attachmentType: varchar("attachment_type", { length: 20 }), // 'image', 'video', 'pdf', 'voice'
  attachmentMeta: jsonb("attachment_meta"), // { size: '2MB', duration: '0:30' }

  // Gizlilik ve Ekstra
  isSecret: boolean("is_secret").default(false), // Secret Chat
  expiresAt: timestamp("expires_at"), // Kendi kendini silen mesajlar
  createdAt: timestamp("created_at").defaultNow(),
});

// --- GRUPLAR ---
export const groups = pgTable("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  avatarUrl: text("avatar_url"),
  isPrivate: boolean("is_private").default(false),
  ownerId: uuid("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- GRUP ÜYELERİ ---
export const groupMembers = pgTable("group_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id").references(() => groups.id),
  userId: uuid("user_id").references(() => users.id),
  role: varchar("role", { length: 20 }).default("member"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// --- ARAMALAR ---
export const calls = pgTable("calls", {
  id: uuid("id").defaultRandom().primaryKey(),
  callerId: uuid("caller_id").references(() => users.id),
  receiverId: uuid("receiver_id").references(() => users.id),
  groupId: uuid("group_id").references(() => groups.id),
  type: varchar("type", { length: 10 }), // 'audio' | 'video'
  status: varchar("status", { length: 20 }), // 'calling' | 'active' | 'ended'
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
});

// --- ADMİN TOKEN ---
export const adminTokens = pgTable("admin_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  token: text("token").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

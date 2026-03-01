import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  service: text("service").notNull(),
  amount: integer("amount").notNull(),
  paymentMethod: text("payment_method").notNull(),
  provider: text("provider").default("manual"),
  providerRef: text("provider_ref"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
}).extend({
  status: z.enum(["pending", "completed", "failed"]).default("pending"),
  paymentMethod: z.enum(["card", "paypal", "cashapp", "zelle", "crypto"]),
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  phone: text("phone"),
  service: text("service").notNull(),
  serviceType: text("service_type").notNull().default("general"),
  amount: integer("amount").notNull(),
  sessionDate: timestamp("session_date"),
  hours: integer("hours"),
  notes: text("notes"),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  status: z.enum(["pending", "confirmed", "cancelled"]).default("pending"),
  paymentStatus: z.enum(["pending", "completed", "failed"]).default("pending"),
  paymentMethod: z.enum(["card", "paypal", "cashapp", "zelle", "crypto"]),
  serviceType: z.enum(["studio_booking", "mixing", "licensing", "general"]).default("general"),
  sessionDate: z.coerce.date().optional().nullable(),
  hours: z.number().int().min(1).max(12).optional().nullable(),
  phone: z.string().trim().min(7).max(30).optional().nullable(),
  notes: z.string().trim().max(1500).optional().nullable(),
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  email: z.string().email(),
  service: z.enum(["recording", "mixing", "licensing", "other"]),
  status: z.enum(["new", "in_progress", "resolved"]).default("new"),
  phone: z.string().trim().min(7).max(30).optional().nullable(),
  message: z.string().trim().min(10).max(4000),
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export const beats = pgTable("beats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  genre: text("genre").notNull(),
  bpm: integer("bpm").notNull(),
  price: integer("price").notNull(),
  audioPath: text("audio_path").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBeatSchema = createInsertSchema(beats).omit({
  id: true,
  createdAt: true,
});

export type InsertBeat = z.infer<typeof insertBeatSchema>;
export type Beat = typeof beats.$inferSelect;

import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, desc } from "drizzle-orm";
import { Pool } from "@neondatabase/serverless";
import {
  type User,
  type InsertUser,
  type Transaction,
  type InsertTransaction,
  type Beat,
  type InsertBeat,
  type Booking,
  type InsertBooking,
  type ContactMessage,
  type InsertContactMessage,
  users,
  transactions,
  beats,
  bookings,
  contactMessages,
} from "@shared/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getAllTransactions(): Promise<Transaction[]>;
  getTransactionById(id: string): Promise<Transaction | undefined>;
  getTransactionByProviderRef(providerRef: string): Promise<Transaction | undefined>;
  updateTransactionStatus(id: string, status: "pending" | "completed" | "failed"): Promise<Transaction | undefined>;
  createBeat(beat: InsertBeat): Promise<Beat>;
  getAllBeats(): Promise<Beat[]>;
  getBeatById(id: string): Promise<Beat | undefined>;
  deleteBeat(id: string): Promise<void>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  getAllBookings(): Promise<Booking[]>;
  updateBookingStatus(id: string, status: "pending" | "confirmed" | "cancelled"): Promise<Booking | undefined>;
  updateBookingPaymentStatus(id: string, paymentStatus: "pending" | "completed" | "failed"): Promise<Booking | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  updateContactMessageStatus(id: string, status: "new" | "in_progress" | "resolved"): Promise<ContactMessage | undefined>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(insertTransaction).returning();
    return result[0];
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.id, id));
    return result[0];
  }

  async getTransactionByProviderRef(providerRef: string): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.providerRef, providerRef));
    return result[0];
  }

  async updateTransactionStatus(id: string, status: "pending" | "completed" | "failed"): Promise<Transaction | undefined> {
    const result = await db
      .update(transactions)
      .set({ status, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();
    return result[0];
  }

  async createBeat(insertBeat: InsertBeat): Promise<Beat> {
    const result = await db.insert(beats).values(insertBeat).returning();
    return result[0];
  }

  async getAllBeats(): Promise<Beat[]> {
    return await db.select().from(beats).orderBy(desc(beats.createdAt));
  }

  async getBeatById(id: string): Promise<Beat | undefined> {
    const result = await db.select().from(beats).where(eq(beats.id, id));
    return result[0];
  }

  async deleteBeat(id: string): Promise<void> {
    await db.delete(beats).where(eq(beats.id, id));
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const result = await db.insert(bookings).values(insertBooking).returning();
    return result[0];
  }

  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async updateBookingStatus(id: string, status: "pending" | "confirmed" | "cancelled"): Promise<Booking | undefined> {
    const result = await db
      .update(bookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return result[0];
  }

  async updateBookingPaymentStatus(id: string, paymentStatus: "pending" | "completed" | "failed"): Promise<Booking | undefined> {
    const result = await db
      .update(bookings)
      .set({ paymentStatus, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return result[0];
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(insertMessage).returning();
    return result[0];
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async updateContactMessageStatus(id: string, status: "new" | "in_progress" | "resolved"): Promise<ContactMessage | undefined> {
    const result = await db
      .update(contactMessages)
      .set({ status, updatedAt: new Date() })
      .where(eq(contactMessages.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new DbStorage();

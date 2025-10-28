import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, desc } from "drizzle-orm";
import { Pool } from "@neondatabase/serverless";
import { type User, type InsertUser, type Transaction, type InsertTransaction, type Beat, type InsertBeat, users, transactions, beats } from "@shared/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getAllTransactions(): Promise<Transaction[]>;
  getTransactionById(id: string): Promise<Transaction | undefined>;
  createBeat(beat: InsertBeat): Promise<Beat>;
  getAllBeats(): Promise<Beat[]>;
  getBeatById(id: string): Promise<Beat | undefined>;
  deleteBeat(id: string): Promise<void>;
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
}

export const storage = new DbStorage();

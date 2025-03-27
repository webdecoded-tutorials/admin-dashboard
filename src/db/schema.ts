import { integer, pgTable, varchar, pgEnum, timestamp, date } from "drizzle-orm/pg-core";

export const planEnum = pgEnum("plan", ["free", "basic", "premium"]);
export const subscriptionEnum = pgEnum("subscription_type", ["monthly", "yearly"]);

export const subscriptionsTable = pgTable("subscriptions", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    startDate: date().notNull(),
    endDate: date(),
    type: subscriptionEnum().notNull(),
    plan: planEnum().notNull().default("free"),
});
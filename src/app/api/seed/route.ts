import { drizzle } from "drizzle-orm/node-postgres";
import { seed} from "drizzle-seed";
import { gt} from "drizzle-orm";
import * as schema from "@/db/schema";
import { db } from "@/db";

export async function GET() {
    // Get current date
    const now = new Date();
  
    await seed(db, { subscriptions: schema.subscriptionsTable }).refine((funcs) => ({
      subscriptions: {
        columns: {
          startDate: funcs.weightedRandom([
            // Growth phase
            { weight: 0.3, value: funcs.date({ minDate: "2024-04-01", maxDate: "2024-08-31" }) },
            // Peak adoption
            { weight: 0.4, value: funcs.date({ minDate: "2024-09-01", maxDate: "2024-12-31" }) },
            // Steady state
            { weight: 0.3, value: funcs.date({ minDate: "2025-01-01", maxDate: "2025-02-03" }) },
          ]),
          endDate: funcs.weightedRandom([
            // No end date (ongoing subscriptions)
            { weight: 0.6, value: funcs.default({ defaultValue: null }) },
            // Short-term subscribers (1-2 months)
            {
              weight: 0.2,
              value: funcs.date({
                minDate: "2024-02-01", // minimum 1 month subscription
                maxDate: "2024-08-31", // maximum 2 months from latest possible start
              }),
            },
            // Medium-term subscribers (3-6 months)
            {
              weight: 0.1,
              value: funcs.date({
                minDate: "2024-04-01",
                maxDate: "2025-02-03",
              }),
            },
            // Long-term subscribers that eventually churned
            {
              weight: 0.1,
              value: funcs.date({
                minDate: "2024-07-01",
                maxDate: now.toISOString().split("T")[0],
              }),
            },
          ]),
        },
        count: 20,
      },
    }));
    return Response.json({
        message: "Seed data generated successfully",
    })
  }
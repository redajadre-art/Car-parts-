import { seedDatabase } from "@/db/seed";

let isSeeding = false;
let seeded = false;

export async function ensureSeeded() {
  if (seeded) return;
  if (isSeeding) return;
  isSeeding = true;
  try {
    await seedDatabase();
    seeded = true;
  } catch (err) {
    console.error("Failed to seed database automatically:", err);
  } finally {
    isSeeding = false;
  }
}

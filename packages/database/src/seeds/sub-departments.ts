import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/hitsanat_dev";

export const subDepartments = [
  {
    code: "TIMIHRT",
    name_am: "ትምህርት",
    name_en: "Timihrt",
    description: "Educational programs and curriculum development",
  },
  {
    code: "MEZMUR",
    name_am: "መዝሙር",
    name_en: "Mezmur",
    description: "Worship and music ministry",
  },
  {
    code: "KUTITR",
    name_am: "ቁጥጥር",
    name_en: "Kutitr",
    description: "Children's ministry and Kutr program",
  },
  {
    code: "EKD",
    name_am: "እቅድ",
    name_en: "Ekd",
    description: "Planning and coordination department",
  },
  {
    code: "KINETIBEB",
    name_am: "ኪነ-ጥበብ",
    name_en: "Kinetibeb",
    description: "Sports and physical activities",
  },
];

async function seed() {
  const client = postgres(connectionString);
  const db = drizzle(client);

  console.log("Seeding sub_departments...");

  for (const dept of subDepartments) {
    await db.execute(sql`
      INSERT INTO sub_departments (code, name_am, name_en, description)
      VALUES (${dept.code}, ${dept.name_am}, ${dept.name_en}, ${dept.description})
      ON CONFLICT (code) DO NOTHING
    `);

    console.log(`Seeded: ${dept.code} - ${dept.name_en}`);
  }

  console.log("Seeding complete!");
  await client.end();
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});

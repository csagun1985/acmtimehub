import fs from "node:fs";
import Holidays from "date-holidays";

const states = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];
const regions = {
  NSW: "AU-NSW",
  VIC: "AU-VIC",
  QLD: "AU-QLD",
  SA: "AU-SA",
  WA: "AU-WA",
  TAS: "AU-TAS",
  ACT: "AU-ACT",
  NT: "AU-NT",
};

const data = {};
for (const state of states) {
  data[state] = {};
  const hd = new Holidays(regions[state]);
  for (let year = 2024; year <= 2032; year++) {
    data[state][year] = hd
      .getHolidays(year)
      .filter((h) => h.type === "public")
      .map((h) => ({ date: h.date.slice(0, 10), name: h.name }));
  }
}

const out = `import type { AuState } from "@/lib/types";

export type PublicHolidayEntry = { date: string; name: string };

/** Static AU public holidays (2024-2032). Regenerate: npm run db:generate-holidays */
export const AU_PUBLIC_HOLIDAYS: Record<
  AuState,
  Record<number, PublicHolidayEntry[]>
> = ${JSON.stringify(data, null, 2)} as Record<
  AuState,
  Record<number, PublicHolidayEntry[]>
>;
`;

fs.writeFileSync("src/lib/leave/au-public-holidays.ts", out);
console.log("Wrote src/lib/leave/au-public-holidays.ts");

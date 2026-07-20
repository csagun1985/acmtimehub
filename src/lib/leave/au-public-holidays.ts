import type { AuState } from "@/lib/types";

export type PublicHolidayEntry = { date: string; name: string };

/** Static AU public holidays (2024-2032). Regenerate: npm run db:generate-holidays */
export const AU_PUBLIC_HOLIDAYS: Record<
  AuState,
  Record<number, PublicHolidayEntry[]>
> = {
  "NSW": {
    "2024": [
      {
        "date": "2024-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2024-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2024-03-29",
        "name": "Good Friday"
      },
      {
        "date": "2024-03-30",
        "name": "Easter Saturday"
      },
      {
        "date": "2024-03-31",
        "name": "Easter Sunday"
      },
      {
        "date": "2024-04-01",
        "name": "Easter Monday"
      },
      {
        "date": "2024-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2024-06-10",
        "name": "King's Birthday"
      },
      {
        "date": "2024-10-07",
        "name": "Labour Day"
      },
      {
        "date": "2024-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2024-12-26",
        "name": "Boxing Day"
      }
    ],
    "2025": [
      {
        "date": "2025-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2025-01-27",
        "name": "Australia Day"
      },
      {
        "date": "2025-04-18",
        "name": "Good Friday"
      },
      {
        "date": "2025-04-19",
        "name": "Easter Saturday"
      },
      {
        "date": "2025-04-20",
        "name": "Easter Sunday"
      },
      {
        "date": "2025-04-21",
        "name": "Easter Monday"
      },
      {
        "date": "2025-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2025-06-09",
        "name": "King's Birthday"
      },
      {
        "date": "2025-10-06",
        "name": "Labour Day"
      },
      {
        "date": "2025-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2025-12-26",
        "name": "Boxing Day"
      }
    ],
    "2026": [
      {
        "date": "2026-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2026-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2026-04-03",
        "name": "Good Friday"
      },
      {
        "date": "2026-04-04",
        "name": "Easter Saturday"
      },
      {
        "date": "2026-04-05",
        "name": "Easter Sunday"
      },
      {
        "date": "2026-04-06",
        "name": "Easter Monday"
      },
      {
        "date": "2026-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2026-04-27",
        "name": "Anzac Day (substitute day)"
      },
      {
        "date": "2026-06-08",
        "name": "King's Birthday"
      },
      {
        "date": "2026-10-05",
        "name": "Labour Day"
      },
      {
        "date": "2026-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2026-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2026-12-28",
        "name": "Boxing Day (substitute day)"
      }
    ],
    "2027": [
      {
        "date": "2027-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2027-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2027-03-26",
        "name": "Good Friday"
      },
      {
        "date": "2027-03-27",
        "name": "Easter Saturday"
      },
      {
        "date": "2027-03-28",
        "name": "Easter Sunday"
      },
      {
        "date": "2027-03-29",
        "name": "Easter Monday"
      },
      {
        "date": "2027-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2027-04-26",
        "name": "Anzac Day (substitute day)"
      },
      {
        "date": "2027-06-14",
        "name": "King's Birthday"
      },
      {
        "date": "2027-10-04",
        "name": "Labour Day"
      },
      {
        "date": "2027-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2027-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2027-12-27",
        "name": "Christmas Day (substitute day)"
      },
      {
        "date": "2027-12-28",
        "name": "Boxing Day (substitute day)"
      }
    ],
    "2028": [
      {
        "date": "2028-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2028-01-03",
        "name": "New Year's Day"
      },
      {
        "date": "2028-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2028-04-14",
        "name": "Good Friday"
      },
      {
        "date": "2028-04-15",
        "name": "Easter Saturday"
      },
      {
        "date": "2028-04-16",
        "name": "Easter Sunday"
      },
      {
        "date": "2028-04-17",
        "name": "Easter Monday"
      },
      {
        "date": "2028-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2028-06-12",
        "name": "King's Birthday"
      },
      {
        "date": "2028-10-02",
        "name": "Labour Day"
      },
      {
        "date": "2028-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2028-12-26",
        "name": "Boxing Day"
      }
    ],
    "2029": [
      {
        "date": "2029-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2029-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2029-03-30",
        "name": "Good Friday"
      },
      {
        "date": "2029-03-31",
        "name": "Easter Saturday"
      },
      {
        "date": "2029-04-01",
        "name": "Easter Sunday"
      },
      {
        "date": "2029-04-02",
        "name": "Easter Monday"
      },
      {
        "date": "2029-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2029-06-11",
        "name": "King's Birthday"
      },
      {
        "date": "2029-10-01",
        "name": "Labour Day"
      },
      {
        "date": "2029-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2029-12-26",
        "name": "Boxing Day"
      }
    ],
    "2030": [
      {
        "date": "2030-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2030-01-28",
        "name": "Australia Day"
      },
      {
        "date": "2030-04-19",
        "name": "Good Friday"
      },
      {
        "date": "2030-04-20",
        "name": "Easter Saturday"
      },
      {
        "date": "2030-04-21",
        "name": "Easter Sunday"
      },
      {
        "date": "2030-04-22",
        "name": "Easter Monday"
      },
      {
        "date": "2030-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2030-06-10",
        "name": "King's Birthday"
      },
      {
        "date": "2030-10-07",
        "name": "Labour Day"
      },
      {
        "date": "2030-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2030-12-26",
        "name": "Boxing Day"
      }
    ],
    "2031": [
      {
        "date": "2031-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2031-01-27",
        "name": "Australia Day"
      },
      {
        "date": "2031-04-11",
        "name": "Good Friday"
      },
      {
        "date": "2031-04-12",
        "name": "Easter Saturday"
      },
      {
        "date": "2031-04-13",
        "name": "Easter Sunday"
      },
      {
        "date": "2031-04-14",
        "name": "Easter Monday"
      },
      {
        "date": "2031-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2031-06-09",
        "name": "King's Birthday"
      },
      {
        "date": "2031-10-06",
        "name": "Labour Day"
      },
      {
        "date": "2031-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2031-12-26",
        "name": "Boxing Day"
      }
    ],
    "2032": [
      {
        "date": "2032-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2032-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2032-03-26",
        "name": "Good Friday"
      },
      {
        "date": "2032-03-27",
        "name": "Easter Saturday"
      },
      {
        "date": "2032-03-28",
        "name": "Easter Sunday"
      },
      {
        "date": "2032-03-29",
        "name": "Easter Monday"
      },
      {
        "date": "2032-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2032-04-26",
        "name": "Anzac Day (substitute day)"
      },
      {
        "date": "2032-06-14",
        "name": "King's Birthday"
      },
      {
        "date": "2032-10-04",
        "name": "Labour Day"
      },
      {
        "date": "2032-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2032-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2032-12-27",
        "name": "Christmas Day (substitute day)"
      },
      {
        "date": "2032-12-28",
        "name": "Boxing Day (substitute day)"
      }
    ]
  },
  "VIC": {
    "2024": [
      {
        "date": "2024-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2024-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2024-03-11",
        "name": "Labour Day"
      },
      {
        "date": "2024-03-29",
        "name": "Good Friday"
      },
      {
        "date": "2024-03-30",
        "name": "Easter Saturday"
      },
      {
        "date": "2024-03-31",
        "name": "Easter Sunday"
      },
      {
        "date": "2024-04-01",
        "name": "Easter Monday"
      },
      {
        "date": "2024-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2024-06-10",
        "name": "King's Birthday"
      },
      {
        "date": "2024-09-27",
        "name": "AFL Grand Final Friday"
      },
      {
        "date": "2024-11-05",
        "name": "Melbourne Cup"
      },
      {
        "date": "2024-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2024-12-26",
        "name": "Boxing Day"
      }
    ],
    "2025": [
      {
        "date": "2025-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2025-01-27",
        "name": "Australia Day"
      },
      {
        "date": "2025-03-10",
        "name": "Labour Day"
      },
      {
        "date": "2025-04-18",
        "name": "Good Friday"
      },
      {
        "date": "2025-04-19",
        "name": "Easter Saturday"
      },
      {
        "date": "2025-04-20",
        "name": "Easter Sunday"
      },
      {
        "date": "2025-04-21",
        "name": "Easter Monday"
      },
      {
        "date": "2025-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2025-06-09",
        "name": "King's Birthday"
      },
      {
        "date": "2025-09-26",
        "name": "AFL Grand Final Friday"
      },
      {
        "date": "2025-11-04",
        "name": "Melbourne Cup"
      },
      {
        "date": "2025-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2025-12-26",
        "name": "Boxing Day"
      }
    ],
    "2026": [
      {
        "date": "2026-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2026-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2026-03-09",
        "name": "Labour Day"
      },
      {
        "date": "2026-04-03",
        "name": "Good Friday"
      },
      {
        "date": "2026-04-04",
        "name": "Easter Saturday"
      },
      {
        "date": "2026-04-05",
        "name": "Easter Sunday"
      },
      {
        "date": "2026-04-06",
        "name": "Easter Monday"
      },
      {
        "date": "2026-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2026-06-08",
        "name": "King's Birthday"
      },
      {
        "date": "2026-09-25",
        "name": "AFL Grand Final Friday"
      },
      {
        "date": "2026-11-03",
        "name": "Melbourne Cup"
      },
      {
        "date": "2026-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2026-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2026-12-28",
        "name": "Boxing Day (substitute day)"
      }
    ],
    "2027": [
      {
        "date": "2027-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2027-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2027-03-08",
        "name": "Labour Day"
      },
      {
        "date": "2027-03-26",
        "name": "Good Friday"
      },
      {
        "date": "2027-03-27",
        "name": "Easter Saturday"
      },
      {
        "date": "2027-03-28",
        "name": "Easter Sunday"
      },
      {
        "date": "2027-03-29",
        "name": "Easter Monday"
      },
      {
        "date": "2027-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2027-06-14",
        "name": "King's Birthday"
      },
      {
        "date": "2027-09-24",
        "name": "AFL Grand Final Friday"
      },
      {
        "date": "2027-11-02",
        "name": "Melbourne Cup"
      },
      {
        "date": "2027-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2027-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2027-12-27",
        "name": "Christmas Day (substitute day)"
      },
      {
        "date": "2027-12-28",
        "name": "Boxing Day (substitute day)"
      }
    ],
    "2028": [
      {
        "date": "2028-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2028-01-03",
        "name": "New Year's Day"
      },
      {
        "date": "2028-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2028-03-13",
        "name": "Labour Day"
      },
      {
        "date": "2028-04-14",
        "name": "Good Friday"
      },
      {
        "date": "2028-04-15",
        "name": "Easter Saturday"
      },
      {
        "date": "2028-04-16",
        "name": "Easter Sunday"
      },
      {
        "date": "2028-04-17",
        "name": "Easter Monday"
      },
      {
        "date": "2028-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2028-06-12",
        "name": "King's Birthday"
      },
      {
        "date": "2028-09-29",
        "name": "AFL Grand Final Friday"
      },
      {
        "date": "2028-11-07",
        "name": "Melbourne Cup"
      },
      {
        "date": "2028-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2028-12-26",
        "name": "Boxing Day"
      }
    ],
    "2029": [
      {
        "date": "2029-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2029-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2029-03-12",
        "name": "Labour Day"
      },
      {
        "date": "2029-03-30",
        "name": "Good Friday"
      },
      {
        "date": "2029-03-31",
        "name": "Easter Saturday"
      },
      {
        "date": "2029-04-01",
        "name": "Easter Sunday"
      },
      {
        "date": "2029-04-02",
        "name": "Easter Monday"
      },
      {
        "date": "2029-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2029-06-11",
        "name": "King's Birthday"
      },
      {
        "date": "2029-09-28",
        "name": "AFL Grand Final Friday"
      },
      {
        "date": "2029-11-06",
        "name": "Melbourne Cup"
      },
      {
        "date": "2029-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2029-12-26",
        "name": "Boxing Day"
      }
    ],
    "2030": [
      {
        "date": "2030-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2030-01-28",
        "name": "Australia Day"
      },
      {
        "date": "2030-03-11",
        "name": "Labour Day"
      },
      {
        "date": "2030-04-19",
        "name": "Good Friday"
      },
      {
        "date": "2030-04-20",
        "name": "Easter Saturday"
      },
      {
        "date": "2030-04-21",
        "name": "Easter Sunday"
      },
      {
        "date": "2030-04-22",
        "name": "Easter Monday"
      },
      {
        "date": "2030-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2030-06-10",
        "name": "King's Birthday"
      },
      {
        "date": "2030-09-27",
        "name": "AFL Grand Final Friday"
      },
      {
        "date": "2030-11-05",
        "name": "Melbourne Cup"
      },
      {
        "date": "2030-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2030-12-26",
        "name": "Boxing Day"
      }
    ],
    "2031": [
      {
        "date": "2031-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2031-01-27",
        "name": "Australia Day"
      },
      {
        "date": "2031-03-10",
        "name": "Labour Day"
      },
      {
        "date": "2031-04-11",
        "name": "Good Friday"
      },
      {
        "date": "2031-04-12",
        "name": "Easter Saturday"
      },
      {
        "date": "2031-04-13",
        "name": "Easter Sunday"
      },
      {
        "date": "2031-04-14",
        "name": "Easter Monday"
      },
      {
        "date": "2031-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2031-06-09",
        "name": "King's Birthday"
      },
      {
        "date": "2031-09-26",
        "name": "AFL Grand Final Friday"
      },
      {
        "date": "2031-11-04",
        "name": "Melbourne Cup"
      },
      {
        "date": "2031-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2031-12-26",
        "name": "Boxing Day"
      }
    ],
    "2032": [
      {
        "date": "2032-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2032-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2032-03-08",
        "name": "Labour Day"
      },
      {
        "date": "2032-03-26",
        "name": "Good Friday"
      },
      {
        "date": "2032-03-27",
        "name": "Easter Saturday"
      },
      {
        "date": "2032-03-28",
        "name": "Easter Sunday"
      },
      {
        "date": "2032-03-29",
        "name": "Easter Monday"
      },
      {
        "date": "2032-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2032-06-14",
        "name": "King's Birthday"
      },
      {
        "date": "2032-09-24",
        "name": "AFL Grand Final Friday"
      },
      {
        "date": "2032-11-02",
        "name": "Melbourne Cup"
      },
      {
        "date": "2032-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2032-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2032-12-27",
        "name": "Christmas Day (substitute day)"
      },
      {
        "date": "2032-12-28",
        "name": "Boxing Day (substitute day)"
      }
    ]
  },
  "QLD": {
    "2024": [
      {
        "date": "2024-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2024-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2024-03-29",
        "name": "Good Friday"
      },
      {
        "date": "2024-03-30",
        "name": "Easter Saturday"
      },
      {
        "date": "2024-03-31",
        "name": "Easter Sunday"
      },
      {
        "date": "2024-04-01",
        "name": "Easter Monday"
      },
      {
        "date": "2024-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2024-05-06",
        "name": "Labour Day"
      },
      {
        "date": "2024-10-07",
        "name": "King's Birthday"
      },
      {
        "date": "2024-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2024-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2024-12-26",
        "name": "Boxing Day"
      }
    ],
    "2025": [
      {
        "date": "2025-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2025-01-27",
        "name": "Australia Day"
      },
      {
        "date": "2025-04-18",
        "name": "Good Friday"
      },
      {
        "date": "2025-04-19",
        "name": "Easter Saturday"
      },
      {
        "date": "2025-04-20",
        "name": "Easter Sunday"
      },
      {
        "date": "2025-04-21",
        "name": "Easter Monday"
      },
      {
        "date": "2025-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2025-05-05",
        "name": "Labour Day"
      },
      {
        "date": "2025-10-06",
        "name": "King's Birthday"
      },
      {
        "date": "2025-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2025-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2025-12-26",
        "name": "Boxing Day"
      }
    ],
    "2026": [
      {
        "date": "2026-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2026-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2026-04-03",
        "name": "Good Friday"
      },
      {
        "date": "2026-04-04",
        "name": "Easter Saturday"
      },
      {
        "date": "2026-04-05",
        "name": "Easter Sunday"
      },
      {
        "date": "2026-04-06",
        "name": "Easter Monday"
      },
      {
        "date": "2026-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2026-05-04",
        "name": "Labour Day"
      },
      {
        "date": "2026-10-05",
        "name": "King's Birthday"
      },
      {
        "date": "2026-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2026-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2026-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2026-12-28",
        "name": "Boxing Day (substitute day)"
      }
    ],
    "2027": [
      {
        "date": "2027-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2027-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2027-03-26",
        "name": "Good Friday"
      },
      {
        "date": "2027-03-27",
        "name": "Easter Saturday"
      },
      {
        "date": "2027-03-28",
        "name": "Easter Sunday"
      },
      {
        "date": "2027-03-29",
        "name": "Easter Monday"
      },
      {
        "date": "2027-04-26",
        "name": "Anzac Day"
      },
      {
        "date": "2027-05-03",
        "name": "Labour Day"
      },
      {
        "date": "2027-10-04",
        "name": "King's Birthday"
      },
      {
        "date": "2027-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2027-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2027-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2027-12-27",
        "name": "Christmas Day (substitute day)"
      },
      {
        "date": "2027-12-28",
        "name": "Boxing Day (substitute day)"
      }
    ],
    "2028": [
      {
        "date": "2028-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2028-01-03",
        "name": "New Year's Day"
      },
      {
        "date": "2028-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2028-04-14",
        "name": "Good Friday"
      },
      {
        "date": "2028-04-15",
        "name": "Easter Saturday"
      },
      {
        "date": "2028-04-16",
        "name": "Easter Sunday"
      },
      {
        "date": "2028-04-17",
        "name": "Easter Monday"
      },
      {
        "date": "2028-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2028-05-01",
        "name": "Labour Day"
      },
      {
        "date": "2028-10-02",
        "name": "King's Birthday"
      },
      {
        "date": "2028-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2028-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2028-12-26",
        "name": "Boxing Day"
      }
    ],
    "2029": [
      {
        "date": "2029-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2029-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2029-03-30",
        "name": "Good Friday"
      },
      {
        "date": "2029-03-31",
        "name": "Easter Saturday"
      },
      {
        "date": "2029-04-01",
        "name": "Easter Sunday"
      },
      {
        "date": "2029-04-02",
        "name": "Easter Monday"
      },
      {
        "date": "2029-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2029-05-07",
        "name": "Labour Day"
      },
      {
        "date": "2029-10-01",
        "name": "King's Birthday"
      },
      {
        "date": "2029-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2029-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2029-12-26",
        "name": "Boxing Day"
      }
    ],
    "2030": [
      {
        "date": "2030-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2030-01-28",
        "name": "Australia Day"
      },
      {
        "date": "2030-04-19",
        "name": "Good Friday"
      },
      {
        "date": "2030-04-20",
        "name": "Easter Saturday"
      },
      {
        "date": "2030-04-21",
        "name": "Easter Sunday"
      },
      {
        "date": "2030-04-22",
        "name": "Easter Monday"
      },
      {
        "date": "2030-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2030-05-06",
        "name": "Labour Day"
      },
      {
        "date": "2030-10-07",
        "name": "King's Birthday"
      },
      {
        "date": "2030-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2030-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2030-12-26",
        "name": "Boxing Day"
      }
    ],
    "2031": [
      {
        "date": "2031-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2031-01-27",
        "name": "Australia Day"
      },
      {
        "date": "2031-04-11",
        "name": "Good Friday"
      },
      {
        "date": "2031-04-12",
        "name": "Easter Saturday"
      },
      {
        "date": "2031-04-13",
        "name": "Easter Sunday"
      },
      {
        "date": "2031-04-14",
        "name": "Easter Monday"
      },
      {
        "date": "2031-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2031-05-05",
        "name": "Labour Day"
      },
      {
        "date": "2031-10-06",
        "name": "King's Birthday"
      },
      {
        "date": "2031-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2031-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2031-12-26",
        "name": "Boxing Day"
      }
    ],
    "2032": [
      {
        "date": "2032-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2032-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2032-03-26",
        "name": "Good Friday"
      },
      {
        "date": "2032-03-27",
        "name": "Easter Saturday"
      },
      {
        "date": "2032-03-28",
        "name": "Easter Sunday"
      },
      {
        "date": "2032-03-29",
        "name": "Easter Monday"
      },
      {
        "date": "2032-04-26",
        "name": "Anzac Day"
      },
      {
        "date": "2032-05-03",
        "name": "Labour Day"
      },
      {
        "date": "2032-10-04",
        "name": "King's Birthday"
      },
      {
        "date": "2032-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2032-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2032-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2032-12-27",
        "name": "Christmas Day (substitute day)"
      },
      {
        "date": "2032-12-28",
        "name": "Boxing Day (substitute day)"
      }
    ]
  },
  "SA": {
    "2024": [
      {
        "date": "2024-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2024-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2024-03-11",
        "name": "Adelaide Cup Day"
      },
      {
        "date": "2024-03-29",
        "name": "Good Friday"
      },
      {
        "date": "2024-03-30",
        "name": "Easter Saturday"
      },
      {
        "date": "2024-03-31",
        "name": "Easter Sunday"
      },
      {
        "date": "2024-04-01",
        "name": "Easter Monday"
      },
      {
        "date": "2024-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2024-06-10",
        "name": "King's Birthday"
      },
      {
        "date": "2024-10-07",
        "name": "Labour Day"
      },
      {
        "date": "2024-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2024-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2024-12-26",
        "name": "Proclamation Day"
      },
      {
        "date": "2024-12-31",
        "name": "New Year's Eve"
      }
    ],
    "2025": [
      {
        "date": "2025-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2025-01-27",
        "name": "Australia Day"
      },
      {
        "date": "2025-03-10",
        "name": "Adelaide Cup Day"
      },
      {
        "date": "2025-04-18",
        "name": "Good Friday"
      },
      {
        "date": "2025-04-19",
        "name": "Easter Saturday"
      },
      {
        "date": "2025-04-20",
        "name": "Easter Sunday"
      },
      {
        "date": "2025-04-21",
        "name": "Easter Monday"
      },
      {
        "date": "2025-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2025-06-09",
        "name": "King's Birthday"
      },
      {
        "date": "2025-10-06",
        "name": "Labour Day"
      },
      {
        "date": "2025-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2025-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2025-12-26",
        "name": "Proclamation Day"
      },
      {
        "date": "2025-12-31",
        "name": "New Year's Eve"
      }
    ],
    "2026": [
      {
        "date": "2026-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2026-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2026-03-09",
        "name": "Adelaide Cup Day"
      },
      {
        "date": "2026-04-03",
        "name": "Good Friday"
      },
      {
        "date": "2026-04-04",
        "name": "Easter Saturday"
      },
      {
        "date": "2026-04-05",
        "name": "Easter Sunday"
      },
      {
        "date": "2026-04-06",
        "name": "Easter Monday"
      },
      {
        "date": "2026-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2026-06-08",
        "name": "King's Birthday"
      },
      {
        "date": "2026-10-05",
        "name": "Labour Day"
      },
      {
        "date": "2026-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2026-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2026-12-26",
        "name": "Proclamation Day"
      },
      {
        "date": "2026-12-28",
        "name": "Proclamation Day"
      },
      {
        "date": "2026-12-31",
        "name": "New Year's Eve"
      }
    ],
    "2027": [
      {
        "date": "2027-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2027-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2027-03-08",
        "name": "Adelaide Cup Day"
      },
      {
        "date": "2027-03-26",
        "name": "Good Friday"
      },
      {
        "date": "2027-03-27",
        "name": "Easter Saturday"
      },
      {
        "date": "2027-03-28",
        "name": "Easter Sunday"
      },
      {
        "date": "2027-03-29",
        "name": "Easter Monday"
      },
      {
        "date": "2027-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2027-06-14",
        "name": "King's Birthday"
      },
      {
        "date": "2027-10-04",
        "name": "Labour Day"
      },
      {
        "date": "2027-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2027-12-26",
        "name": "Proclamation Day"
      },
      {
        "date": "2027-12-27",
        "name": "Christmas Day"
      },
      {
        "date": "2027-12-28",
        "name": "Proclamation Day"
      },
      {
        "date": "2027-12-31",
        "name": "New Year's Eve"
      }
    ],
    "2028": [
      {
        "date": "2028-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2028-01-03",
        "name": "New Year's Day"
      },
      {
        "date": "2028-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2028-03-13",
        "name": "Adelaide Cup Day"
      },
      {
        "date": "2028-04-14",
        "name": "Good Friday"
      },
      {
        "date": "2028-04-15",
        "name": "Easter Saturday"
      },
      {
        "date": "2028-04-16",
        "name": "Easter Sunday"
      },
      {
        "date": "2028-04-17",
        "name": "Easter Monday"
      },
      {
        "date": "2028-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2028-06-12",
        "name": "King's Birthday"
      },
      {
        "date": "2028-10-02",
        "name": "Labour Day"
      },
      {
        "date": "2028-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2028-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2028-12-26",
        "name": "Proclamation Day"
      },
      {
        "date": "2028-12-31",
        "name": "New Year's Eve"
      }
    ],
    "2029": [
      {
        "date": "2029-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2029-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2029-03-12",
        "name": "Adelaide Cup Day"
      },
      {
        "date": "2029-03-30",
        "name": "Good Friday"
      },
      {
        "date": "2029-03-31",
        "name": "Easter Saturday"
      },
      {
        "date": "2029-04-01",
        "name": "Easter Sunday"
      },
      {
        "date": "2029-04-02",
        "name": "Easter Monday"
      },
      {
        "date": "2029-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2029-06-11",
        "name": "King's Birthday"
      },
      {
        "date": "2029-10-01",
        "name": "Labour Day"
      },
      {
        "date": "2029-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2029-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2029-12-26",
        "name": "Proclamation Day"
      },
      {
        "date": "2029-12-31",
        "name": "New Year's Eve"
      }
    ],
    "2030": [
      {
        "date": "2030-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2030-01-28",
        "name": "Australia Day"
      },
      {
        "date": "2030-03-11",
        "name": "Adelaide Cup Day"
      },
      {
        "date": "2030-04-19",
        "name": "Good Friday"
      },
      {
        "date": "2030-04-20",
        "name": "Easter Saturday"
      },
      {
        "date": "2030-04-21",
        "name": "Easter Sunday"
      },
      {
        "date": "2030-04-22",
        "name": "Easter Monday"
      },
      {
        "date": "2030-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2030-06-10",
        "name": "King's Birthday"
      },
      {
        "date": "2030-10-07",
        "name": "Labour Day"
      },
      {
        "date": "2030-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2030-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2030-12-26",
        "name": "Proclamation Day"
      },
      {
        "date": "2030-12-31",
        "name": "New Year's Eve"
      }
    ],
    "2031": [
      {
        "date": "2031-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2031-01-27",
        "name": "Australia Day"
      },
      {
        "date": "2031-03-10",
        "name": "Adelaide Cup Day"
      },
      {
        "date": "2031-04-11",
        "name": "Good Friday"
      },
      {
        "date": "2031-04-12",
        "name": "Easter Saturday"
      },
      {
        "date": "2031-04-13",
        "name": "Easter Sunday"
      },
      {
        "date": "2031-04-14",
        "name": "Easter Monday"
      },
      {
        "date": "2031-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2031-06-09",
        "name": "King's Birthday"
      },
      {
        "date": "2031-10-06",
        "name": "Labour Day"
      },
      {
        "date": "2031-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2031-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2031-12-26",
        "name": "Proclamation Day"
      },
      {
        "date": "2031-12-31",
        "name": "New Year's Eve"
      }
    ],
    "2032": [
      {
        "date": "2032-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2032-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2032-03-08",
        "name": "Adelaide Cup Day"
      },
      {
        "date": "2032-03-26",
        "name": "Good Friday"
      },
      {
        "date": "2032-03-27",
        "name": "Easter Saturday"
      },
      {
        "date": "2032-03-28",
        "name": "Easter Sunday"
      },
      {
        "date": "2032-03-29",
        "name": "Easter Monday"
      },
      {
        "date": "2032-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2032-06-14",
        "name": "King's Birthday"
      },
      {
        "date": "2032-10-04",
        "name": "Labour Day"
      },
      {
        "date": "2032-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2032-12-26",
        "name": "Proclamation Day"
      },
      {
        "date": "2032-12-27",
        "name": "Christmas Day"
      },
      {
        "date": "2032-12-28",
        "name": "Proclamation Day"
      },
      {
        "date": "2032-12-31",
        "name": "New Year's Eve"
      }
    ]
  },
  "WA": {
    "2024": [
      {
        "date": "2024-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2024-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2024-03-04",
        "name": "Labour Day"
      },
      {
        "date": "2024-03-29",
        "name": "Good Friday"
      },
      {
        "date": "2024-03-31",
        "name": "Easter Sunday"
      },
      {
        "date": "2024-04-01",
        "name": "Easter Monday"
      },
      {
        "date": "2024-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2024-06-03",
        "name": "Western Australia Day"
      },
      {
        "date": "2024-09-23",
        "name": "King's Birthday"
      },
      {
        "date": "2024-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2024-12-26",
        "name": "Boxing Day"
      }
    ],
    "2025": [
      {
        "date": "2025-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2025-01-27",
        "name": "Australia Day"
      },
      {
        "date": "2025-03-03",
        "name": "Labour Day"
      },
      {
        "date": "2025-04-18",
        "name": "Good Friday"
      },
      {
        "date": "2025-04-20",
        "name": "Easter Sunday"
      },
      {
        "date": "2025-04-21",
        "name": "Easter Monday"
      },
      {
        "date": "2025-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2025-06-02",
        "name": "Western Australia Day"
      },
      {
        "date": "2025-09-29",
        "name": "King's Birthday"
      },
      {
        "date": "2025-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2025-12-26",
        "name": "Boxing Day"
      }
    ],
    "2026": [
      {
        "date": "2026-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2026-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2026-03-02",
        "name": "Labour Day"
      },
      {
        "date": "2026-04-03",
        "name": "Good Friday"
      },
      {
        "date": "2026-04-05",
        "name": "Easter Sunday"
      },
      {
        "date": "2026-04-06",
        "name": "Easter Monday"
      },
      {
        "date": "2026-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2026-04-27",
        "name": "Anzac Day (substitute day)"
      },
      {
        "date": "2026-06-01",
        "name": "Western Australia Day"
      },
      {
        "date": "2026-09-28",
        "name": "King's Birthday"
      },
      {
        "date": "2026-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2026-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2026-12-28",
        "name": "Boxing Day (substitute day)"
      }
    ],
    "2027": [
      {
        "date": "2027-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2027-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2027-03-01",
        "name": "Labour Day"
      },
      {
        "date": "2027-03-26",
        "name": "Good Friday"
      },
      {
        "date": "2027-03-28",
        "name": "Easter Sunday"
      },
      {
        "date": "2027-03-29",
        "name": "Easter Monday"
      },
      {
        "date": "2027-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2027-04-26",
        "name": "Anzac Day (substitute day)"
      },
      {
        "date": "2027-06-07",
        "name": "Western Australia Day"
      },
      {
        "date": "2027-09-27",
        "name": "King's Birthday"
      },
      {
        "date": "2027-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2027-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2027-12-27",
        "name": "Christmas Day (substitute day)"
      },
      {
        "date": "2027-12-28",
        "name": "Boxing Day (substitute day)"
      }
    ],
    "2028": [
      {
        "date": "2028-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2028-01-03",
        "name": "New Year's Day"
      },
      {
        "date": "2028-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2028-03-06",
        "name": "Labour Day"
      },
      {
        "date": "2028-04-14",
        "name": "Good Friday"
      },
      {
        "date": "2028-04-16",
        "name": "Easter Sunday"
      },
      {
        "date": "2028-04-17",
        "name": "Easter Monday"
      },
      {
        "date": "2028-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2028-06-05",
        "name": "Western Australia Day"
      },
      {
        "date": "2028-09-25",
        "name": "King's Birthday"
      },
      {
        "date": "2028-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2028-12-26",
        "name": "Boxing Day"
      }
    ],
    "2029": [
      {
        "date": "2029-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2029-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2029-03-05",
        "name": "Labour Day"
      },
      {
        "date": "2029-03-30",
        "name": "Good Friday"
      },
      {
        "date": "2029-04-01",
        "name": "Easter Sunday"
      },
      {
        "date": "2029-04-02",
        "name": "Easter Monday"
      },
      {
        "date": "2029-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2029-06-04",
        "name": "Western Australia Day"
      },
      {
        "date": "2029-09-24",
        "name": "King's Birthday"
      },
      {
        "date": "2029-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2029-12-26",
        "name": "Boxing Day"
      }
    ],
    "2030": [
      {
        "date": "2030-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2030-01-28",
        "name": "Australia Day"
      },
      {
        "date": "2030-03-04",
        "name": "Labour Day"
      },
      {
        "date": "2030-04-19",
        "name": "Good Friday"
      },
      {
        "date": "2030-04-21",
        "name": "Easter Sunday"
      },
      {
        "date": "2030-04-22",
        "name": "Easter Monday"
      },
      {
        "date": "2030-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2030-06-03",
        "name": "Western Australia Day"
      },
      {
        "date": "2030-09-30",
        "name": "King's Birthday"
      },
      {
        "date": "2030-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2030-12-26",
        "name": "Boxing Day"
      }
    ],
    "2031": [
      {
        "date": "2031-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2031-01-27",
        "name": "Australia Day"
      },
      {
        "date": "2031-03-03",
        "name": "Labour Day"
      },
      {
        "date": "2031-04-11",
        "name": "Good Friday"
      },
      {
        "date": "2031-04-13",
        "name": "Easter Sunday"
      },
      {
        "date": "2031-04-14",
        "name": "Easter Monday"
      },
      {
        "date": "2031-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2031-06-02",
        "name": "Western Australia Day"
      },
      {
        "date": "2031-09-29",
        "name": "King's Birthday"
      },
      {
        "date": "2031-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2031-12-26",
        "name": "Boxing Day"
      }
    ],
    "2032": [
      {
        "date": "2032-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2032-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2032-03-01",
        "name": "Labour Day"
      },
      {
        "date": "2032-03-26",
        "name": "Good Friday"
      },
      {
        "date": "2032-03-28",
        "name": "Easter Sunday"
      },
      {
        "date": "2032-03-29",
        "name": "Easter Monday"
      },
      {
        "date": "2032-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2032-04-26",
        "name": "Anzac Day (substitute day)"
      },
      {
        "date": "2032-06-07",
        "name": "Western Australia Day"
      },
      {
        "date": "2032-09-27",
        "name": "King's Birthday"
      },
      {
        "date": "2032-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2032-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2032-12-27",
        "name": "Christmas Day (substitute day)"
      },
      {
        "date": "2032-12-28",
        "name": "Boxing Day (substitute day)"
      }
    ]
  },
  "TAS": {
    "2024": [
      {
        "date": "2024-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2024-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2024-03-11",
        "name": "Eight Hours Day"
      },
      {
        "date": "2024-03-29",
        "name": "Good Friday"
      },
      {
        "date": "2024-04-01",
        "name": "Easter Monday"
      },
      {
        "date": "2024-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2024-06-10",
        "name": "King's Birthday"
      },
      {
        "date": "2024-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2024-12-26",
        "name": "Boxing Day"
      }
    ],
    "2025": [
      {
        "date": "2025-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2025-01-27",
        "name": "Australia Day"
      },
      {
        "date": "2025-03-10",
        "name": "Eight Hours Day"
      },
      {
        "date": "2025-04-18",
        "name": "Good Friday"
      },
      {
        "date": "2025-04-21",
        "name": "Easter Monday"
      },
      {
        "date": "2025-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2025-06-09",
        "name": "King's Birthday"
      },
      {
        "date": "2025-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2025-12-26",
        "name": "Boxing Day"
      }
    ],
    "2026": [
      {
        "date": "2026-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2026-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2026-03-09",
        "name": "Eight Hours Day"
      },
      {
        "date": "2026-04-03",
        "name": "Good Friday"
      },
      {
        "date": "2026-04-06",
        "name": "Easter Monday"
      },
      {
        "date": "2026-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2026-06-08",
        "name": "King's Birthday"
      },
      {
        "date": "2026-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2026-12-28",
        "name": "Boxing Day"
      }
    ],
    "2027": [
      {
        "date": "2027-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2027-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2027-03-08",
        "name": "Eight Hours Day"
      },
      {
        "date": "2027-03-26",
        "name": "Good Friday"
      },
      {
        "date": "2027-03-29",
        "name": "Easter Monday"
      },
      {
        "date": "2027-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2027-06-14",
        "name": "King's Birthday"
      },
      {
        "date": "2027-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2027-12-27",
        "name": "Christmas Day (substitute day)"
      },
      {
        "date": "2027-12-28",
        "name": "Boxing Day"
      }
    ],
    "2028": [
      {
        "date": "2028-01-03",
        "name": "New Year's Day"
      },
      {
        "date": "2028-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2028-03-13",
        "name": "Eight Hours Day"
      },
      {
        "date": "2028-04-14",
        "name": "Good Friday"
      },
      {
        "date": "2028-04-17",
        "name": "Easter Monday"
      },
      {
        "date": "2028-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2028-06-12",
        "name": "King's Birthday"
      },
      {
        "date": "2028-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2028-12-26",
        "name": "Boxing Day"
      }
    ],
    "2029": [
      {
        "date": "2029-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2029-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2029-03-12",
        "name": "Eight Hours Day"
      },
      {
        "date": "2029-03-30",
        "name": "Good Friday"
      },
      {
        "date": "2029-04-02",
        "name": "Easter Monday"
      },
      {
        "date": "2029-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2029-06-11",
        "name": "King's Birthday"
      },
      {
        "date": "2029-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2029-12-26",
        "name": "Boxing Day"
      }
    ],
    "2030": [
      {
        "date": "2030-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2030-01-28",
        "name": "Australia Day"
      },
      {
        "date": "2030-03-11",
        "name": "Eight Hours Day"
      },
      {
        "date": "2030-04-19",
        "name": "Good Friday"
      },
      {
        "date": "2030-04-22",
        "name": "Easter Monday"
      },
      {
        "date": "2030-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2030-06-10",
        "name": "King's Birthday"
      },
      {
        "date": "2030-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2030-12-26",
        "name": "Boxing Day"
      }
    ],
    "2031": [
      {
        "date": "2031-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2031-01-27",
        "name": "Australia Day"
      },
      {
        "date": "2031-03-10",
        "name": "Eight Hours Day"
      },
      {
        "date": "2031-04-11",
        "name": "Good Friday"
      },
      {
        "date": "2031-04-14",
        "name": "Easter Monday"
      },
      {
        "date": "2031-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2031-06-09",
        "name": "King's Birthday"
      },
      {
        "date": "2031-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2031-12-26",
        "name": "Boxing Day"
      }
    ],
    "2032": [
      {
        "date": "2032-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2032-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2032-03-08",
        "name": "Eight Hours Day"
      },
      {
        "date": "2032-03-26",
        "name": "Good Friday"
      },
      {
        "date": "2032-03-29",
        "name": "Easter Monday"
      },
      {
        "date": "2032-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2032-06-14",
        "name": "King's Birthday"
      },
      {
        "date": "2032-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2032-12-27",
        "name": "Christmas Day (substitute day)"
      },
      {
        "date": "2032-12-28",
        "name": "Boxing Day"
      }
    ]
  },
  "ACT": {
    "2024": [
      {
        "date": "2024-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2024-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2024-03-11",
        "name": "Canberra Day"
      },
      {
        "date": "2024-03-29",
        "name": "Good Friday"
      },
      {
        "date": "2024-03-30",
        "name": "Easter Saturday"
      },
      {
        "date": "2024-03-31",
        "name": "Easter Sunday"
      },
      {
        "date": "2024-04-01",
        "name": "Easter Monday"
      },
      {
        "date": "2024-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2024-05-27",
        "name": "Reconciliation Day"
      },
      {
        "date": "2024-06-10",
        "name": "King's Birthday"
      },
      {
        "date": "2024-10-07",
        "name": "Labour Day"
      },
      {
        "date": "2024-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2024-12-26",
        "name": "Boxing Day"
      }
    ],
    "2025": [
      {
        "date": "2025-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2025-01-27",
        "name": "Australia Day"
      },
      {
        "date": "2025-03-10",
        "name": "Canberra Day"
      },
      {
        "date": "2025-04-18",
        "name": "Good Friday"
      },
      {
        "date": "2025-04-19",
        "name": "Easter Saturday"
      },
      {
        "date": "2025-04-20",
        "name": "Easter Sunday"
      },
      {
        "date": "2025-04-21",
        "name": "Easter Monday"
      },
      {
        "date": "2025-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2025-06-02",
        "name": "Reconciliation Day"
      },
      {
        "date": "2025-06-09",
        "name": "King's Birthday"
      },
      {
        "date": "2025-10-06",
        "name": "Labour Day"
      },
      {
        "date": "2025-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2025-12-26",
        "name": "Boxing Day"
      }
    ],
    "2026": [
      {
        "date": "2026-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2026-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2026-03-09",
        "name": "Canberra Day"
      },
      {
        "date": "2026-04-03",
        "name": "Good Friday"
      },
      {
        "date": "2026-04-04",
        "name": "Easter Saturday"
      },
      {
        "date": "2026-04-05",
        "name": "Easter Sunday"
      },
      {
        "date": "2026-04-06",
        "name": "Easter Monday"
      },
      {
        "date": "2026-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2026-04-27",
        "name": "Anzac Day (substitute day)"
      },
      {
        "date": "2026-06-01",
        "name": "Reconciliation Day"
      },
      {
        "date": "2026-06-08",
        "name": "King's Birthday"
      },
      {
        "date": "2026-10-05",
        "name": "Labour Day"
      },
      {
        "date": "2026-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2026-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2026-12-28",
        "name": "Boxing Day (substitute day)"
      }
    ],
    "2027": [
      {
        "date": "2027-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2027-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2027-03-08",
        "name": "Canberra Day"
      },
      {
        "date": "2027-03-26",
        "name": "Good Friday"
      },
      {
        "date": "2027-03-27",
        "name": "Easter Saturday"
      },
      {
        "date": "2027-03-28",
        "name": "Easter Sunday"
      },
      {
        "date": "2027-03-29",
        "name": "Easter Monday"
      },
      {
        "date": "2027-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2027-04-26",
        "name": "Anzac Day (substitute day)"
      },
      {
        "date": "2027-05-31",
        "name": "Reconciliation Day"
      },
      {
        "date": "2027-06-14",
        "name": "King's Birthday"
      },
      {
        "date": "2027-10-04",
        "name": "Labour Day"
      },
      {
        "date": "2027-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2027-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2027-12-27",
        "name": "Christmas Day (substitute day)"
      },
      {
        "date": "2027-12-28",
        "name": "Boxing Day (substitute day)"
      }
    ],
    "2028": [
      {
        "date": "2028-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2028-01-03",
        "name": "New Year's Day"
      },
      {
        "date": "2028-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2028-03-13",
        "name": "Canberra Day"
      },
      {
        "date": "2028-04-14",
        "name": "Good Friday"
      },
      {
        "date": "2028-04-15",
        "name": "Easter Saturday"
      },
      {
        "date": "2028-04-16",
        "name": "Easter Sunday"
      },
      {
        "date": "2028-04-17",
        "name": "Easter Monday"
      },
      {
        "date": "2028-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2028-05-29",
        "name": "Reconciliation Day"
      },
      {
        "date": "2028-06-12",
        "name": "King's Birthday"
      },
      {
        "date": "2028-10-02",
        "name": "Labour Day"
      },
      {
        "date": "2028-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2028-12-26",
        "name": "Boxing Day"
      }
    ],
    "2029": [
      {
        "date": "2029-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2029-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2029-03-12",
        "name": "Canberra Day"
      },
      {
        "date": "2029-03-30",
        "name": "Good Friday"
      },
      {
        "date": "2029-03-31",
        "name": "Easter Saturday"
      },
      {
        "date": "2029-04-01",
        "name": "Easter Sunday"
      },
      {
        "date": "2029-04-02",
        "name": "Easter Monday"
      },
      {
        "date": "2029-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2029-05-28",
        "name": "Reconciliation Day"
      },
      {
        "date": "2029-06-11",
        "name": "King's Birthday"
      },
      {
        "date": "2029-10-01",
        "name": "Labour Day"
      },
      {
        "date": "2029-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2029-12-26",
        "name": "Boxing Day"
      }
    ],
    "2030": [
      {
        "date": "2030-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2030-01-28",
        "name": "Australia Day"
      },
      {
        "date": "2030-03-11",
        "name": "Canberra Day"
      },
      {
        "date": "2030-04-19",
        "name": "Good Friday"
      },
      {
        "date": "2030-04-20",
        "name": "Easter Saturday"
      },
      {
        "date": "2030-04-21",
        "name": "Easter Sunday"
      },
      {
        "date": "2030-04-22",
        "name": "Easter Monday"
      },
      {
        "date": "2030-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2030-05-27",
        "name": "Reconciliation Day"
      },
      {
        "date": "2030-06-10",
        "name": "King's Birthday"
      },
      {
        "date": "2030-10-07",
        "name": "Labour Day"
      },
      {
        "date": "2030-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2030-12-26",
        "name": "Boxing Day"
      }
    ],
    "2031": [
      {
        "date": "2031-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2031-01-27",
        "name": "Australia Day"
      },
      {
        "date": "2031-03-10",
        "name": "Canberra Day"
      },
      {
        "date": "2031-04-11",
        "name": "Good Friday"
      },
      {
        "date": "2031-04-12",
        "name": "Easter Saturday"
      },
      {
        "date": "2031-04-13",
        "name": "Easter Sunday"
      },
      {
        "date": "2031-04-14",
        "name": "Easter Monday"
      },
      {
        "date": "2031-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2031-06-02",
        "name": "Reconciliation Day"
      },
      {
        "date": "2031-06-09",
        "name": "King's Birthday"
      },
      {
        "date": "2031-10-06",
        "name": "Labour Day"
      },
      {
        "date": "2031-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2031-12-26",
        "name": "Boxing Day"
      }
    ],
    "2032": [
      {
        "date": "2032-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2032-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2032-03-08",
        "name": "Canberra Day"
      },
      {
        "date": "2032-03-26",
        "name": "Good Friday"
      },
      {
        "date": "2032-03-27",
        "name": "Easter Saturday"
      },
      {
        "date": "2032-03-28",
        "name": "Easter Sunday"
      },
      {
        "date": "2032-03-29",
        "name": "Easter Monday"
      },
      {
        "date": "2032-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2032-04-26",
        "name": "Anzac Day (substitute day)"
      },
      {
        "date": "2032-05-31",
        "name": "Reconciliation Day"
      },
      {
        "date": "2032-06-14",
        "name": "King's Birthday"
      },
      {
        "date": "2032-10-04",
        "name": "Labour Day"
      },
      {
        "date": "2032-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2032-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2032-12-27",
        "name": "Christmas Day (substitute day)"
      },
      {
        "date": "2032-12-28",
        "name": "Boxing Day (substitute day)"
      }
    ]
  },
  "NT": {
    "2024": [
      {
        "date": "2024-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2024-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2024-03-29",
        "name": "Good Friday"
      },
      {
        "date": "2024-03-30",
        "name": "Easter Saturday"
      },
      {
        "date": "2024-03-31",
        "name": "Easter Sunday"
      },
      {
        "date": "2024-04-01",
        "name": "Easter Monday"
      },
      {
        "date": "2024-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2024-05-06",
        "name": "May Day"
      },
      {
        "date": "2024-06-10",
        "name": "King's Birthday"
      },
      {
        "date": "2024-08-05",
        "name": "Picnic Day"
      },
      {
        "date": "2024-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2024-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2024-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2024-12-31",
        "name": "New Year's Eve"
      }
    ],
    "2025": [
      {
        "date": "2025-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2025-01-27",
        "name": "Australia Day"
      },
      {
        "date": "2025-04-18",
        "name": "Good Friday"
      },
      {
        "date": "2025-04-19",
        "name": "Easter Saturday"
      },
      {
        "date": "2025-04-20",
        "name": "Easter Sunday"
      },
      {
        "date": "2025-04-21",
        "name": "Easter Monday"
      },
      {
        "date": "2025-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2025-05-05",
        "name": "May Day"
      },
      {
        "date": "2025-06-09",
        "name": "King's Birthday"
      },
      {
        "date": "2025-08-04",
        "name": "Picnic Day"
      },
      {
        "date": "2025-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2025-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2025-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2025-12-31",
        "name": "New Year's Eve"
      }
    ],
    "2026": [
      {
        "date": "2026-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2026-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2026-04-03",
        "name": "Good Friday"
      },
      {
        "date": "2026-04-04",
        "name": "Easter Saturday"
      },
      {
        "date": "2026-04-05",
        "name": "Easter Sunday"
      },
      {
        "date": "2026-04-06",
        "name": "Easter Monday"
      },
      {
        "date": "2026-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2026-05-04",
        "name": "May Day"
      },
      {
        "date": "2026-06-08",
        "name": "King's Birthday"
      },
      {
        "date": "2026-08-03",
        "name": "Picnic Day"
      },
      {
        "date": "2026-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2026-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2026-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2026-12-28",
        "name": "Boxing Day (substitute day)"
      },
      {
        "date": "2026-12-31",
        "name": "New Year's Eve"
      }
    ],
    "2027": [
      {
        "date": "2027-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2027-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2027-03-26",
        "name": "Good Friday"
      },
      {
        "date": "2027-03-27",
        "name": "Easter Saturday"
      },
      {
        "date": "2027-03-28",
        "name": "Easter Sunday"
      },
      {
        "date": "2027-03-29",
        "name": "Easter Monday"
      },
      {
        "date": "2027-04-26",
        "name": "Anzac Day"
      },
      {
        "date": "2027-05-03",
        "name": "May Day"
      },
      {
        "date": "2027-06-14",
        "name": "King's Birthday"
      },
      {
        "date": "2027-08-02",
        "name": "Picnic Day"
      },
      {
        "date": "2027-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2027-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2027-12-27",
        "name": "Christmas Day"
      },
      {
        "date": "2027-12-28",
        "name": "Boxing Day (substitute day)"
      },
      {
        "date": "2027-12-31",
        "name": "New Year's Eve"
      }
    ],
    "2028": [
      {
        "date": "2028-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2028-01-03",
        "name": "New Year's Day"
      },
      {
        "date": "2028-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2028-04-14",
        "name": "Good Friday"
      },
      {
        "date": "2028-04-15",
        "name": "Easter Saturday"
      },
      {
        "date": "2028-04-16",
        "name": "Easter Sunday"
      },
      {
        "date": "2028-04-17",
        "name": "Easter Monday"
      },
      {
        "date": "2028-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2028-05-01",
        "name": "May Day"
      },
      {
        "date": "2028-06-12",
        "name": "King's Birthday"
      },
      {
        "date": "2028-08-07",
        "name": "Picnic Day"
      },
      {
        "date": "2028-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2028-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2028-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2028-12-31",
        "name": "New Year's Eve"
      }
    ],
    "2029": [
      {
        "date": "2029-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2029-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2029-03-30",
        "name": "Good Friday"
      },
      {
        "date": "2029-03-31",
        "name": "Easter Saturday"
      },
      {
        "date": "2029-04-01",
        "name": "Easter Sunday"
      },
      {
        "date": "2029-04-02",
        "name": "Easter Monday"
      },
      {
        "date": "2029-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2029-05-07",
        "name": "May Day"
      },
      {
        "date": "2029-06-11",
        "name": "King's Birthday"
      },
      {
        "date": "2029-08-06",
        "name": "Picnic Day"
      },
      {
        "date": "2029-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2029-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2029-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2029-12-31",
        "name": "New Year's Eve"
      }
    ],
    "2030": [
      {
        "date": "2030-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2030-01-28",
        "name": "Australia Day"
      },
      {
        "date": "2030-04-19",
        "name": "Good Friday"
      },
      {
        "date": "2030-04-20",
        "name": "Easter Saturday"
      },
      {
        "date": "2030-04-21",
        "name": "Easter Sunday"
      },
      {
        "date": "2030-04-22",
        "name": "Easter Monday"
      },
      {
        "date": "2030-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2030-05-06",
        "name": "May Day"
      },
      {
        "date": "2030-06-10",
        "name": "King's Birthday"
      },
      {
        "date": "2030-08-05",
        "name": "Picnic Day"
      },
      {
        "date": "2030-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2030-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2030-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2030-12-31",
        "name": "New Year's Eve"
      }
    ],
    "2031": [
      {
        "date": "2031-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2031-01-27",
        "name": "Australia Day"
      },
      {
        "date": "2031-04-11",
        "name": "Good Friday"
      },
      {
        "date": "2031-04-12",
        "name": "Easter Saturday"
      },
      {
        "date": "2031-04-13",
        "name": "Easter Sunday"
      },
      {
        "date": "2031-04-14",
        "name": "Easter Monday"
      },
      {
        "date": "2031-04-25",
        "name": "Anzac Day"
      },
      {
        "date": "2031-05-05",
        "name": "May Day"
      },
      {
        "date": "2031-06-09",
        "name": "King's Birthday"
      },
      {
        "date": "2031-08-04",
        "name": "Picnic Day"
      },
      {
        "date": "2031-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2031-12-25",
        "name": "Christmas Day"
      },
      {
        "date": "2031-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2031-12-31",
        "name": "New Year's Eve"
      }
    ],
    "2032": [
      {
        "date": "2032-01-01",
        "name": "New Year's Day"
      },
      {
        "date": "2032-01-26",
        "name": "Australia Day"
      },
      {
        "date": "2032-03-26",
        "name": "Good Friday"
      },
      {
        "date": "2032-03-27",
        "name": "Easter Saturday"
      },
      {
        "date": "2032-03-28",
        "name": "Easter Sunday"
      },
      {
        "date": "2032-03-29",
        "name": "Easter Monday"
      },
      {
        "date": "2032-04-26",
        "name": "Anzac Day"
      },
      {
        "date": "2032-05-03",
        "name": "May Day"
      },
      {
        "date": "2032-06-14",
        "name": "King's Birthday"
      },
      {
        "date": "2032-08-02",
        "name": "Picnic Day"
      },
      {
        "date": "2032-12-24",
        "name": "Christmas Eve"
      },
      {
        "date": "2032-12-26",
        "name": "Boxing Day"
      },
      {
        "date": "2032-12-27",
        "name": "Christmas Day"
      },
      {
        "date": "2032-12-28",
        "name": "Boxing Day (substitute day)"
      },
      {
        "date": "2032-12-31",
        "name": "New Year's Eve"
      }
    ]
  }
} as Record<
  AuState,
  Record<number, PublicHolidayEntry[]>
>;

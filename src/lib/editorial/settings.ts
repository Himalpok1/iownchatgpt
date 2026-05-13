import { db, editorialSettings, isDatabaseConfigured } from "@/lib/db";

export type EditorialSlotName = "morning" | "midday" | "evening";

export interface EditorialScheduleSlot {
  slot: EditorialSlotName;
  hour: number;
  minute: number;
}

export interface EditorialSettingsRecord {
  key: string;
  automationEnabled: boolean;
  trackedTopics: string[];
  scheduleSlots: EditorialScheduleSlot[];
  maxSourcesPerRun: number;
  model: string;
  updatedAt: Date;
}

export const defaultEditorialSettings: Omit<EditorialSettingsRecord, "updatedAt"> = {
  key: "default",
  automationEnabled: true,
  trackedTopics: ["AI", "Tech", "Crypto", "Consumer Electronics"],
  scheduleSlots: [
    { slot: "morning", hour: 8, minute: 0 },
    { slot: "midday", hour: 13, minute: 0 },
    { slot: "evening", hour: 19, minute: 0 },
  ],
  maxSourcesPerRun: 9,
  model: "gemini-2.5-flash",
};

export async function getEditorialSettings(): Promise<EditorialSettingsRecord> {
  if (!isDatabaseConfigured) {
    return { ...defaultEditorialSettings, updatedAt: new Date() };
  }

  const [settings] = await db.select().from(editorialSettings).limit(1);

  if (!settings) {
    const [created] = await db
      .insert(editorialSettings)
      .values(defaultEditorialSettings)
      .returning();

    return normalizeEditorialSettings(created);
  }

  return normalizeEditorialSettings(settings);
}

export function normalizeEditorialSettings(
  settings: typeof editorialSettings.$inferSelect
): EditorialSettingsRecord {
  const trackedTopics = Array.isArray(settings.trackedTopics)
    ? settings.trackedTopics.filter((value): value is string => typeof value === "string")
    : defaultEditorialSettings.trackedTopics;

  const scheduleSlots = Array.isArray(settings.scheduleSlots)
    ? settings.scheduleSlots
        .map((value) =>
          typeof value === "object" && value
            ? {
                slot: String((value as { slot?: string }).slot ?? "morning") as EditorialSlotName,
                hour: Number((value as { hour?: number }).hour ?? 8),
                minute: Number((value as { minute?: number }).minute ?? 0),
              }
            : null
        )
        .filter((value): value is EditorialScheduleSlot => Boolean(value))
    : defaultEditorialSettings.scheduleSlots;

  return {
    key: settings.key,
    automationEnabled: settings.automationEnabled,
    trackedTopics,
    scheduleSlots,
    maxSourcesPerRun: settings.maxSourcesPerRun,
    model: settings.model,
    updatedAt: settings.updatedAt,
  };
}

export function getCurrentEditorialSlot(
  settings: EditorialSettingsRecord,
  now = new Date()
): EditorialSlotName {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const sorted = [...settings.scheduleSlots].sort(
    (a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute)
  );

  let selected = sorted[sorted.length - 1] ?? defaultEditorialSettings.scheduleSlots[0];

  for (const slot of sorted) {
    if (minutes >= slot.hour * 60 + slot.minute) {
      selected = slot;
    }
  }

  return selected.slot;
}

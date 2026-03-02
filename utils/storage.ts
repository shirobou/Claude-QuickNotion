import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Notion Integration Token ---
const NOTION_TOKEN_KEY = "notion_token";

export async function getNotionToken(): Promise<string | null> {
  return AsyncStorage.getItem(NOTION_TOKEN_KEY);
}

export async function saveNotionToken(token: string): Promise<void> {
  await AsyncStorage.setItem(NOTION_TOKEN_KEY, token);
}

export async function removeNotionToken(): Promise<void> {
  await AsyncStorage.removeItem(NOTION_TOKEN_KEY);
}

// --- Destinations (複数送信先) ---
const DESTINATIONS_KEY = "destinations";
const ACTIVE_DESTINATION_KEY = "active_destination_id";

export type Destination = {
  id: string;
  name: string;
  databaseId: string;
  titleProperty: string;
};

export async function getDestinations(): Promise<Destination[]> {
  const data = await AsyncStorage.getItem(DESTINATIONS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as Destination[];
  } catch {
    return [];
  }
}

export async function saveDestinations(list: Destination[]): Promise<void> {
  await AsyncStorage.setItem(DESTINATIONS_KEY, JSON.stringify(list));
}

export async function addDestination(
  dest: Omit<Destination, "id">
): Promise<Destination> {
  const destinations = await getDestinations();
  const newDest: Destination = {
    ...dest,
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  };
  destinations.push(newDest);
  await saveDestinations(destinations);
  return newDest;
}

export async function updateDestination(dest: Destination): Promise<void> {
  const destinations = await getDestinations();
  const index = destinations.findIndex((d) => d.id === dest.id);
  if (index >= 0) {
    destinations[index] = dest;
    await saveDestinations(destinations);
  }
}

export async function removeDestination(id: string): Promise<void> {
  const destinations = await getDestinations();
  const filtered = destinations.filter((d) => d.id !== id);
  await saveDestinations(filtered);
  const activeId = await getActiveDestinationId();
  if (activeId === id && filtered.length > 0) {
    await saveActiveDestinationId(filtered[0].id);
  }
}

export async function getActiveDestinationId(): Promise<string | null> {
  return AsyncStorage.getItem(ACTIVE_DESTINATION_KEY);
}

export async function saveActiveDestinationId(id: string): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_DESTINATION_KEY, id);
}

export async function getActiveDestination(): Promise<Destination | null> {
  const [destinations, activeId] = await Promise.all([
    getDestinations(),
    getActiveDestinationId(),
  ]);
  if (destinations.length === 0) return null;
  const active = destinations.find((d) => d.id === activeId);
  return active || destinations[0];
}

// --- Migration: 旧single DB設定 → Destination配列 ---
export async function migrateToDestinations(): Promise<void> {
  const destinations = await getDestinations();
  if (destinations.length > 0) return; // already migrated

  const dbId = await AsyncStorage.getItem("notion_database_id");
  const titleProp = await AsyncStorage.getItem("notion_title_property");
  if (!dbId) return; // no old data

  const dest = await addDestination({
    name: "送信先1",
    databaseId: dbId,
    titleProperty: titleProp || "Name",
  });
  await saveActiveDestinationId(dest.id);

  // Clean up old keys
  await AsyncStorage.removeItem("notion_database_id");
  await AsyncStorage.removeItem("notion_title_property");
}

// --- Theme Mode ---
const THEME_KEY = "app_theme";
export type ThemeMode = "dark" | "light";

export async function getThemeMode(): Promise<ThemeMode> {
  const value = await AsyncStorage.getItem(THEME_KEY);
  return (value as ThemeMode) || "dark";
}

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, mode);
}

// --- Send History ---
const HISTORY_KEY = "send_history";
const MAX_HISTORY = 100;

export type HistoryEntry = {
  id: string;
  text: string;
  timestamp: number;
  success: boolean;
  errorMessage?: string;
  destinationName?: string;
};

export async function getHistory(): Promise<HistoryEntry[]> {
  const data = await AsyncStorage.getItem(HISTORY_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as HistoryEntry[];
  } catch {
    return [];
  }
}

export async function addHistoryEntry(
  entry: Omit<HistoryEntry, "id">
): Promise<void> {
  const history = await getHistory();
  const newEntry: HistoryEntry = {
    ...entry,
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  };
  const updated = [newEntry, ...history].slice(0, MAX_HISTORY);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}

// --- Templates ---
const TEMPLATES_KEY = "text_templates";

export type Template = {
  id: string;
  label: string;
  text: string;
};

export async function getTemplates(): Promise<Template[]> {
  const data = await AsyncStorage.getItem(TEMPLATES_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as Template[];
  } catch {
    return [];
  }
}

export async function saveTemplates(list: Template[]): Promise<void> {
  await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(list));
}

export async function addTemplate(
  tmpl: Omit<Template, "id">
): Promise<Template> {
  const templates = await getTemplates();
  const newTmpl: Template = {
    ...tmpl,
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  };
  templates.push(newTmpl);
  await saveTemplates(templates);
  return newTmpl;
}

export async function updateTemplate(tmpl: Template): Promise<void> {
  const templates = await getTemplates();
  const index = templates.findIndex((t) => t.id === tmpl.id);
  if (index >= 0) {
    templates[index] = tmpl;
    await saveTemplates(templates);
  }
}

export async function removeTemplate(id: string): Promise<void> {
  const templates = await getTemplates();
  await saveTemplates(templates.filter((t) => t.id !== id));
}

// --- Setup Completion Flag ---
const SETUP_COMPLETE_KEY = "setup_complete";

export async function isSetupComplete(): Promise<boolean> {
  const value = await AsyncStorage.getItem(SETUP_COMPLETE_KEY);
  return value === "true";
}

export async function markSetupComplete(): Promise<void> {
  await AsyncStorage.setItem(SETUP_COMPLETE_KEY, "true");
}

export async function resetSetup(): Promise<void> {
  await AsyncStorage.removeItem(SETUP_COMPLETE_KEY);
}

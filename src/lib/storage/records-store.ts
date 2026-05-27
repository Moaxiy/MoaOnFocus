import {
  DEFAULT_FOCUS_PET_APPEARANCE,
  isFocusPetAppearanceId,
  type FocusPetAppearanceId,
} from "@/constants/focus-pets";
import type { FocusRecord, FocusSessionDraft } from "@/types/focus-record";

const LEGACY_RECORDS_KEY = "today-trajectory-records";
const LEGACY_SESSION_KEY = "today-trajectory-active-session";
const LEGACY_LAST_RECORD_KEY = "today-trajectory-last-record";
const LEGACY_PET_APPEARANCE_KEY = "today-trajectory-focus-pet-appearance";
const STORE_UPDATED_EVENT = "today-trajectory-store-updated";
const DESKTOP_STORE_UPDATED_EVENT = "records-store-updated";

export type RecordsStoreData = {
  version: 1;
  records: FocusRecord[];
  activeSession: FocusSessionDraft | null;
  lastRecord: FocusRecord | null;
  focusPetAppearance: FocusPetAppearanceId;
  updatedAt: string | null;
};

type PersistenceMode = "unknown" | "desktop-file" | "local-storage";

type TauriInvoke = <T>(command: string, args?: Record<string, unknown>) => Promise<T>;

const listeners = new Set<() => void>();

let store = createDefaultStore();
let initialized = false;
let initializing: Promise<void> | null = null;
let persistenceMode: PersistenceMode = "unknown";
let persistQueue = Promise.resolve();
let desktopEventBound = false;

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createDefaultStore(): RecordsStoreData {
  return {
    version: 1,
    records: [],
    activeSession: null,
    lastRecord: null,
    focusPetAppearance: DEFAULT_FOCUS_PET_APPEARANCE,
    updatedAt: null,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function normalizeRecord(value: unknown): FocusRecord | null {
  if (!isObject(value)) {
    return null;
  }

  const { id, taskName, startTime, endTime, durationMinutes, createdAt } = value;

  if (
    typeof id !== "string" ||
    typeof taskName !== "string" ||
    typeof startTime !== "string" ||
    typeof endTime !== "string" ||
    typeof durationMinutes !== "number" ||
    typeof createdAt !== "string"
  ) {
    return null;
  }

  return { id, taskName, startTime, endTime, durationMinutes, createdAt };
}

function normalizeSession(value: unknown): FocusSessionDraft | null {
  if (!isObject(value)) {
    return null;
  }

  const { taskName, durationMinutes, startTime } = value;

  if (
    typeof taskName !== "string" ||
    typeof durationMinutes !== "number" ||
    typeof startTime !== "string"
  ) {
    return null;
  }

  return { taskName, durationMinutes, startTime };
}

function normalizeStore(value: unknown): RecordsStoreData {
  if (!isObject(value)) {
    return createDefaultStore();
  }

  const records = Array.isArray(value.records)
    ? value.records.map(normalizeRecord).filter((record): record is FocusRecord => record !== null)
    : [];
  const lastRecord = normalizeRecord(value.lastRecord) ?? records.at(-1) ?? null;
  const activeSession = normalizeSession(value.activeSession);
  const focusPetAppearance =
    typeof value.focusPetAppearance === "string" &&
    isFocusPetAppearanceId(value.focusPetAppearance)
      ? value.focusPetAppearance
      : DEFAULT_FOCUS_PET_APPEARANCE;
  const updatedAt = typeof value.updatedAt === "string" ? value.updatedAt : null;

  return {
    version: 1,
    records,
    activeSession,
    lastRecord,
    focusPetAppearance,
    updatedAt,
  };
}

function readLegacyStore() {
  if (!canUseBrowserStorage()) {
    return createDefaultStore();
  }

  const records =
    safeParse<unknown[]>(window.localStorage.getItem(LEGACY_RECORDS_KEY))
      ?.map(normalizeRecord)
      .filter((record): record is FocusRecord => record !== null) ?? [];
  const lastRecord =
    normalizeRecord(safeParse(window.localStorage.getItem(LEGACY_LAST_RECORD_KEY))) ??
    records.at(-1) ??
    null;
  const activeSession = normalizeSession(
    safeParse(window.localStorage.getItem(LEGACY_SESSION_KEY)),
  );
  const storedPetAppearance = window.localStorage.getItem(LEGACY_PET_APPEARANCE_KEY);

  return {
    version: 1,
    records,
    activeSession,
    lastRecord,
    focusPetAppearance:
      storedPetAppearance && isFocusPetAppearanceId(storedPetAppearance)
        ? storedPetAppearance
        : DEFAULT_FOCUS_PET_APPEARANCE,
    updatedAt: null,
  } satisfies RecordsStoreData;
}

function writeLegacyStore(value: RecordsStoreData) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(LEGACY_RECORDS_KEY, JSON.stringify(value.records));

  if (value.activeSession) {
    window.localStorage.setItem(LEGACY_SESSION_KEY, JSON.stringify(value.activeSession));
  } else {
    window.localStorage.removeItem(LEGACY_SESSION_KEY);
  }

  if (value.lastRecord) {
    window.localStorage.setItem(LEGACY_LAST_RECORD_KEY, JSON.stringify(value.lastRecord));
  } else {
    window.localStorage.removeItem(LEGACY_LAST_RECORD_KEY);
  }

  window.localStorage.setItem(LEGACY_PET_APPEARANCE_KEY, value.focusPetAppearance);
}

function isStoreEmpty(value: RecordsStoreData) {
  return (
    value.records.length === 0 &&
    value.activeSession === null &&
    value.lastRecord === null &&
    value.focusPetAppearance === DEFAULT_FOCUS_PET_APPEARANCE
  );
}

async function getTauriInvoke(): Promise<TauriInvoke | null> {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const { invoke } = await import("@tauri-apps/api/core");
    return invoke as TauriInvoke;
  } catch {
    return null;
  }
}

async function readDesktopFileStore(): Promise<RecordsStoreData | null> {
  const invoke = await getTauriInvoke();

  if (!invoke) {
    return null;
  }

  try {
    const value = await invoke<unknown | null>("read_records_store");
    persistenceMode = "desktop-file";
    return value ? normalizeStore(value) : null;
  } catch {
    return null;
  }
}

async function writeDesktopFileStore(value: RecordsStoreData) {
  const invoke = await getTauriInvoke();

  if (!invoke) {
    return false;
  }

  try {
    await invoke("write_records_store", { value });
    persistenceMode = "desktop-file";
    return true;
  } catch {
    return false;
  }
}

function notifyStoreUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(STORE_UPDATED_EVENT));
  }
}

async function reloadFromDesktopFile() {
  const fileStore = await readDesktopFileStore();

  if (!fileStore) {
    return;
  }

  store = fileStore;
  initialized = true;
  notifyStoreUpdated();
}

function bindDesktopEvents() {
  if (desktopEventBound || typeof window === "undefined") {
    return;
  }

  desktopEventBound = true;

  import("@tauri-apps/api/event")
    .then(({ listen }) =>
      listen(DESKTOP_STORE_UPDATED_EVENT, () => {
        void reloadFromDesktopFile();
      }),
    )
    .catch(() => {
      desktopEventBound = false;
    });
}

export function initializeRecordsStore() {
  if (initializing) {
    return initializing;
  }

  bindDesktopEvents();

  initializing = (async () => {
    const fileStore = await readDesktopFileStore();

    if (fileStore) {
      store = fileStore;
    } else {
      const legacyStore = readLegacyStore();
      store = legacyStore;

      if (persistenceMode === "desktop-file" || !isStoreEmpty(legacyStore)) {
        void persistRecordsStore();
      } else {
        persistenceMode = "local-storage";
      }
    }

    initialized = true;
    notifyStoreUpdated();
  })();

  return initializing;
}

export function isRecordsStoreReady() {
  if (typeof window !== "undefined" && !initializing) {
    void initializeRecordsStore();
  }

  return initialized;
}

export function getRecordsStoreReadySnapshot() {
  return isRecordsStoreReady() ? "ready" : "loading";
}

export function getStore() {
  if (typeof window !== "undefined" && !initializing) {
    void initializeRecordsStore();
  }

  return store;
}

export function updateStore(updater: (current: RecordsStoreData) => RecordsStoreData) {
  store = {
    ...normalizeStore(updater(store)),
    updatedAt: new Date().toISOString(),
  };
  notifyStoreUpdated();
  void persistRecordsStore();
}

export function persistRecordsStore() {
  const snapshot = store;

  persistQueue = persistQueue.then(async () => {
    if (persistenceMode !== "local-storage") {
      const written = await writeDesktopFileStore(snapshot);

      if (written) {
        return;
      }
    }

    persistenceMode = "local-storage";
    writeLegacyStore(snapshot);
  });

  return persistQueue;
}

export function subscribeToStore(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  bindDesktopEvents();
  listeners.add(callback);
  window.addEventListener(STORE_UPDATED_EVENT, callback);
  void initializeRecordsStore();

  function handleLegacyStorage(event: StorageEvent) {
    if (
      event.key === LEGACY_RECORDS_KEY ||
      event.key === LEGACY_SESSION_KEY ||
      event.key === LEGACY_LAST_RECORD_KEY ||
      event.key === LEGACY_PET_APPEARANCE_KEY
    ) {
      store = readLegacyStore();
      initialized = true;
      callback();
    }
  }

  window.addEventListener("storage", handleLegacyStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener(STORE_UPDATED_EVENT, callback);
    window.removeEventListener("storage", handleLegacyStorage);
  };
}

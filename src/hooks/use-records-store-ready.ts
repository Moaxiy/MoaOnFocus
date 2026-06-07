"use client";

import { useSyncExternalStore } from "react";

import { subscribeToRecords } from "@/lib/storage/focus-records-storage";
import { getRecordsStoreReadySnapshot } from "@/lib/storage/records-store";

function getServerStoreReadySnapshot() {
  return "loading";
}

export function useRecordsStoreReady() {
  return useSyncExternalStore(
    subscribeToRecords,
    getRecordsStoreReadySnapshot,
    getServerStoreReadySnapshot,
  );
}

import { defineStore } from "pinia";
import {
  DEFAULT_CUSTOM_ACCENT,
  getBackground,
} from "../backgrounds.js";

const STORAGE_KEY = "study-timer-settings";
const DEFAULT_TIME_MINUTES = 30;
const DEFAULT_BACKGROUND_ID = "mono";

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function persist(state) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      timeSync: state.timeSync,
      backgroundId: state.backgroundId,
      customAccent: state.customAccent,
    })
  );
}

const persisted = loadPersisted();

export const useStore = defineStore("store", {
  state: () => ({
    timeSync:
      typeof persisted.timeSync === "number"
        ? persisted.timeSync
        : DEFAULT_TIME_MINUTES,
    backgroundId: persisted.backgroundId ?? DEFAULT_BACKGROUND_ID,
    customAccent: persisted.customAccent ?? DEFAULT_CUSTOM_ACCENT,
  }),
  getters: {
    getTimeSync(state) {
      return state.timeSync;
    },
    activeBackground(state) {
      return getBackground(state.backgroundId, state.customAccent);
    },
  },
  actions: {
    setTimeSync(time) {
      const minutes = Math.min(1439, Math.max(1, Math.round(Number(time) || 1)));
      this.timeSync = minutes;
      persist(this.$state);
    },
    setBackgroundId(id) {
      this.backgroundId = id;
      persist(this.$state);
    },
    setCustomAccent(hex) {
      this.customAccent = hex;
      persist(this.$state);
    },
    resetSettings() {
      this.timeSync = DEFAULT_TIME_MINUTES;
      this.backgroundId = DEFAULT_BACKGROUND_ID;
      this.customAccent = DEFAULT_CUSTOM_ACCENT;
      persist(this.$state);
    },
  },
});

<template>
  <div
    class="config-popover ui-panel"
    :style="[stripeStyle, position]"
    role="dialog"
    aria-labelledby="config-title"
  >
      <header class="terminal-header">
        <div>
          <p class="header-code">/// CONFIGURATION INTERFACE</p>
          <h2 id="config-title">SYS_CONFIG</h2>
        </div>
        <button
          type="button"
          class="ui-btn ui-btn--secondary close-btn"
          aria-label="Close configuration"
          @click="closeOptionsMenu"
        >
          <fa icon="fa-solid fa-xmark" />
          ESC
        </button>
      </header>

      <div class="warning-stripe" aria-hidden="true" />

      <div class="terminal-body">
        <nav class="module-nav" aria-label="Configuration modules">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="module-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <span class="mod-code">{{ tab.code }}</span>
            <span class="mod-label">{{ tab.label }}</span>
          </button>
        </nav>

        <div class="module-panel">
          <Transition name="mod-switch" mode="out-in">
            <section v-if="activeTab === 'timer'" key="timer">
              <h3 class="mod-title">MOD-01 // CHRONO SET</h3>
              <p class="mod-desc retro-prompt">
                SET SESSION DURATION (MINUTES)
              </p>

              <div class="preset-matrix">
                <button
                  v-for="preset in presets"
                  :key="preset"
                  type="button"
                  class="preset-key"
                  :class="{ active: store.timeSync === preset }"
                  @click="applyPreset(preset)"
                >
                  {{ preset }}
                </button>
              </div>

              <div class="manual-entry">
                <label for="session-minutes" class="retro-label"
                  >Manual Override</label
                >
                <div class="entry-row">
                  <input
                    id="session-minutes"
                    :value="store.timeSync"
                    type="number"
                    min="1"
                    max="1439"
                    step="1"
                    @change="applyMinutes($event.target.value)"
                  />
                  <span>MIN</span>
                </div>
              </div>
            </section>

            <section v-else-if="activeTab === 'backgrounds'" key="backgrounds">
              <h3 class="mod-title">MOD-02 // VISUAL LINK</h3>
              <p class="mod-desc retro-prompt">
                SELECT CRT PHOSPHOR / DECK PROFILE
              </p>

              <div class="profile-grid">
                <button
                  v-for="bg in profileOptions"
                  :key="bg.id"
                  type="button"
                  class="profile-card"
                  :class="{ selected: store.backgroundId === bg.id }"
                  :aria-label="`Select ${bg.name}`"
                  :aria-pressed="store.backgroundId === bg.id"
                  @click="applyBackground(bg.id)"
                >
                  <span class="profile-preview" :style="bg.style">
                    <span
                      class="phosphor-sample"
                      :style="{
                        color: bg.phosphor,
                        textShadow: `0 0 10px ${bg.phosphorGlow}`,
                      }"
                      >08:88:88</span
                    >
                  </span>
                  <span class="profile-name">{{ bg.name }}</span>
                  <span class="profile-code">{{ bg.code }}</span>
                </button>
              </div>

              <div v-if="store.backgroundId === 'custom'" class="custom-accent">
                <label for="custom-accent" class="retro-label">Accent colour</label>
                <div class="accent-row">
                  <input
                    id="custom-accent"
                    :value="store.customAccent"
                    type="color"
                    @input="applyCustomAccent($event.target.value)"
                  />
                  <span class="accent-hex">{{ store.customAccent }}</span>
                </div>
              </div>
            </section>

            <section v-else key="about">
              <h3 class="mod-title">MOD-03 // SYS INFO</h3>
              <div class="info-block">
                <p class="info-lead">
                  Study Timer is a retro-styled focus clock for blocking out
                  distraction and getting through study sessions.
                </p>
                <ul class="spec-list">
                  <li>Set how long each session runs, then hit Start</li>
                  <li>Six CRT themes, including a custom accent you can tune</li>
                  <li>Changes apply immediately; Factory reset is the undo</li>
                  <li>Your settings stay in this browser. Nothing leaves the machine</li>
                  <li>The tab title counts down so you can peek from other windows</li>
                </ul>
                <p class="build-tag">BUILD {{ buildDate }} · VUE 3 · PINIA</p>
                <a
                  href="https://github.com/VioletTides/study-timer"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="ui-btn inline-link"
                >
                  <fa icon="fa-brands fa-github" />
                  Source on GitHub
                </a>
              </div>
            </section>
          </Transition>
        </div>
      </div>

      <footer class="terminal-footer">
        <button type="button" class="ui-btn ui-btn--danger" @click="factoryReset">
          Factory reset
        </button>
      </footer>
  </div>
</template>

<script>
import { BUILD_DATE } from "../build-info.js";
import {
  backgrounds,
  buildCustomBackground,
  SESSION_PRESETS,
} from "../backgrounds.js";
import { useStore } from "../stores/store.js";

export default {
  props: {
    position: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["close"],
  setup() {
    const store = useStore();
    return { store, presets: SESSION_PRESETS, buildDate: BUILD_DATE };
  },
  data() {
    return {
      activeTab: "timer",
      tabs: [
        { id: "timer", code: "01", label: "CHRONO" },
        { id: "backgrounds", code: "02", label: "VISUAL" },
        { id: "about", code: "03", label: "SYSINFO" },
      ],
    };
  },
  computed: {
    profileOptions() {
      return backgrounds.map((bg) => {
        if (bg.id !== "custom") {
          return bg;
        }
        return buildCustomBackground(this.store.customAccent);
      });
    },
    stripeStyle() {
      const bg = this.store.activeBackground;
      return {
        "--stripe-accent": bg.phosphor,
        "--stripe-dark": bg.phosphorDim,
      };
    },
  },
  methods: {
    closeOptionsMenu() {
      this.$emit("close");
    },
    applyPreset(minutes) {
      this.store.setTimeSync(minutes);
    },
    applyMinutes(value) {
      this.store.setTimeSync(value);
    },
    applyBackground(id) {
      this.store.setBackgroundId(id);
    },
    applyCustomAccent(hex) {
      this.store.setCustomAccent(hex);
      if (this.store.backgroundId === "custom") {
        this.store.setBackgroundId("custom");
      }
    },
    factoryReset() {
      this.store.resetSettings();
    },
  },
};
</script>

<style scoped>
.config-popover {
  --cfg-pad: 0.875rem;
  --cfg-pad-lg: 1.125rem;

  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-origin: top right;
  font-family: var(--font-ui);
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--ui-text);
  -webkit-font-smoothing: antialiased;
}

.config-popover::before {
  content: "";
  position: absolute;
  top: -5px;
  right: 1.1rem;
  width: 10px;
  height: 10px;
  background: var(--ui-surface-overlay);
  border-left: 1px solid var(--ui-border-strong);
  border-top: 1px solid var(--ui-border-strong);
  transform: rotate(45deg);
  z-index: 1;
}

.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--cfg-pad-lg) var(--cfg-pad-lg) var(--cfg-pad);
  gap: 0.75rem;
}

.header-code {
  margin: 0 0 0.25rem;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  color: var(--ui-text-faint);
}

.terminal-header h2 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  line-height: 1.2;
  color: var(--ui-text);
}

.close-btn {
  flex-shrink: 0;
  padding: 0.45rem 0.7rem;
  font-size: 0.72rem;
}

.warning-stripe {
  height: 6px;
  background: repeating-linear-gradient(
    -45deg,
    var(--stripe-accent) 0px,
    var(--stripe-accent) 8px,
    var(--stripe-dark) 8px,
    var(--stripe-dark) 16px
  );
  opacity: 0.9;
}

.terminal-body {
  display: flex;
  flex: 0 1 auto;
  min-height: 0;
  max-height: min(52vh, 22rem);
  overflow: hidden;
}

.module-nav {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: var(--cfg-pad) 0.5rem var(--cfg-pad) var(--cfg-pad-lg);
  flex-shrink: 0;
  width: 7.25rem;
  border-right: 1px solid var(--ui-border);
}

.module-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  padding: 0.55rem 0.65rem;
  width: 100%;
  border: 1px solid transparent;
  background: transparent;
  color: var(--ui-text-muted);
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  line-height: 1.25;
  transition:
    color 0.15s ease,
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.15s var(--ease-mechanical);
}

.module-btn:hover {
  color: var(--ui-text);
  border-color: var(--ui-border);
  background: var(--ui-surface-raised);
}

.module-btn.active {
  color: var(--ui-text);
  border-color: var(--ui-border-strong);
  background: var(--ui-surface-raised);
  transform: translateX(3px);
}

.mod-code {
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  color: var(--ui-text-faint);
}

.mod-label {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
}

.module-panel {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: var(--cfg-pad) var(--cfg-pad-lg);
}

.module-panel section {
  margin: 0;
}

.mod-title {
  margin: 0 0 0.35rem;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ui-text);
}

.mod-desc {
  margin: 0 0 0.85rem;
}

.preset-matrix {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 1rem;
}

.preset-key {
  padding: 0.65rem 0.5rem;
  border: 1px solid var(--ui-border);
  background: var(--ui-surface-input);
  color: var(--ui-text-muted);
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.06em;
  line-height: 1;
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease,
    transform 0.15s var(--ease-mechanical);
}

.preset-key:hover {
  border-color: var(--ui-border-strong);
  color: var(--ui-text);
}

.preset-key.active {
  background: var(--ui-surface-raised);
  border-color: var(--ui-text);
  color: var(--ui-text);
  box-shadow: inset 0 0 0 1px var(--ui-border-strong);
  transform: scale(1.03);
}

.manual-entry {
  margin-top: 0.25rem;
}

.manual-entry label {
  display: block;
  margin-bottom: 0.45rem;
}

.entry-row {
  display: flex;
  align-items: center;
  max-width: 11rem;
  border: 1px solid var(--ui-border-strong);
  background: var(--ui-surface-input);
}

.entry-row input {
  flex: 1;
  min-width: 0;
  padding: 0.55rem 0.75rem;
  border: none;
  background: transparent;
  color: var(--ui-text);
  font-family: var(--font-display);
  font-size: 1.25rem;
  letter-spacing: 0.06em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.entry-row input::-webkit-outer-spin-button,
.entry-row input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.entry-row span {
  display: flex;
  align-items: center;
  padding: 0 0.6rem;
  font-family: inherit;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  color: var(--ui-text-muted);
  border-left: 1px solid var(--ui-border);
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
}

.profile-card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.45rem;
  border: 1px solid var(--ui-border);
  background: var(--ui-surface);
  cursor: pointer;
  text-align: left;
  font-family: var(--font-ui);
  transition:
    border-color 0.15s ease,
    transform 0.15s var(--ease-mechanical),
    box-shadow 0.15s ease;
}

.profile-card:hover {
  border-color: var(--ui-border-strong);
  transform: translateY(-2px);
}

.profile-card.selected {
  border-color: var(--ui-text);
  box-shadow: inset 0 0 0 1px var(--ui-border-strong);
  transform: translateY(-2px);
}

.profile-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  border: 1px solid var(--ui-border);
}

.phosphor-sample {
  font-family: var(--font-display);
  font-size: 0.85rem;
  letter-spacing: 0.1em;
}

.profile-name {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  line-height: 1.25;
  color: var(--ui-text);
}

.profile-code {
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  color: var(--ui-text-muted);
}

.info-block {
  margin-top: 0.15rem;
}

.info-lead {
  margin: 0 0 0.75rem;
  font-family: inherit;
  font-size: inherit;
  line-height: 1.5;
  color: var(--ui-text);
}

.spec-list {
  margin: 0 0 0.85rem;
  padding-left: 1.1rem;
  font-family: inherit;
  font-size: 0.78rem;
  line-height: 1.55;
  color: var(--ui-text-muted);
}

.spec-list li + li {
  margin-top: 0.35rem;
}

.build-tag {
  margin: 0 0 0.65rem;
  font-family: var(--font-display);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--ui-text-faint);
}

.custom-accent {
  margin-top: 1rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--ui-border);
}

.custom-accent label {
  display: block;
  margin-bottom: 0.45rem;
}

.accent-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.accent-row input[type="color"] {
  width: 48px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--ui-border-strong);
  background: var(--ui-surface-input);
  cursor: pointer;
}

.accent-hex {
  font-family: var(--font-display);
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  color: var(--ui-text);
}

.inline-link {
  display: inline-flex;
  font-size: 0.75rem;
  text-decoration: none;
}

.terminal-footer {
  display: flex;
  justify-content: flex-end;
  padding: var(--cfg-pad) var(--cfg-pad-lg);
  border-top: 1px solid var(--ui-border);
  background: var(--ui-surface);
}

.terminal-footer .ui-btn {
  font-size: 0.75rem;
  padding: 0.5rem 0.85rem;
}

.mod-switch-enter-active {
  animation: tab-in 0.22s var(--ease-mechanical) both;
}

.mod-switch-leave-active {
  animation: tab-out 0.15s ease both;
}

@keyframes tab-in {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes tab-out {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-6px);
  }
}

@media (max-width: 520px) {
  .terminal-body {
    flex-direction: column;
  }

  .module-nav {
    flex-direction: row;
    width: auto;
    padding: 0.65rem var(--cfg-pad-lg) 0;
    border-right: none;
    border-bottom: 1px solid var(--ui-border);
    overflow-x: auto;
  }

  .module-btn {
    width: auto;
    min-width: 4.5rem;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div id="app-root" class="app-root" :style="themeVars">
    <div class="crt-overlay" aria-hidden="true">
      <span class="scanlines" />
      <span class="vignette" />
      <span class="grid" />
    </div>

    <div class="app-shell">
      <header class="top-bar chrome-bar">
        <div class="brand">
          <span class="led" :class="{ on: !showOptionsMenu }" />
          <div class="brand-text">
            <span class="brand-id">STUDY_TIMER</span>
            <span class="brand-sub">SESSION TERMINAL // BUILD {{ buildDate }}</span>
          </div>
        </div>
        <div class="header-meta">
          <span class="meta-line status-ok">SYS: OK</span>
          <div ref="configAnchor" class="config-anchor">
            <button
              type="button"
              class="ui-btn config-trigger"
              :class="{ open: showOptionsMenu }"
              :aria-expanded="showOptionsMenu"
              aria-haspopup="dialog"
              aria-label="Open configuration"
              @click.stop="toggleOptionsMenu"
            >
              <fa icon="fa-solid fa-gear" class="config-icon" />
              CONFIG
            </button>

            <Teleport to="body">
              <Transition name="config-popover">
                <OptionsMenu
                  v-if="showOptionsMenu"
                  :position="popoverPosition"
                  @close="closeOptionsMenu"
                  @click.stop
                />
              </Transition>
            </Teleport>
          </div>
        </div>
      </header>

      <main class="main-timer-content">
        <Timer />
      </main>

      <footer class="bottom-bar chrome-bar">
        <span class="footer-tag">DECK-A // CHRONO-UNIT</span>
        <div class="footer-actions">
          <button
            type="button"
            class="ui-btn"
            :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
            @click="toggleFullscreen"
          >
            <fa :icon="isFullscreen ? 'fa-solid fa-compress' : 'fa-solid fa-expand'" />
            {{ isFullscreen ? "EXIT FS" : "FULLSCR" }}
          </button>
          <a
            class="ui-btn"
            href="https://github.com/VioletTides/study-timer"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
          >
            <fa icon="fa-brands fa-github" />
            SRC
          </a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { BUILD_DATE } from "./build-info.js";
import { useStore } from "./stores/store.js";
import OptionsMenu from "./components/OptionsMenu.vue";
import Timer from "./components/Timer.vue";

export default {
  name: "App",
  components: { OptionsMenu, Timer },
  setup() {
    const store = useStore();
    return { store };
  },
  data() {
    return {
      showOptionsMenu: false,
      isFullscreen: false,
      buildDate: BUILD_DATE,
      popoverPosition: {},
    };
  },
  computed: {
    themeVars() {
      const bg = this.store.activeBackground;
      return {
        ...bg.style,
        "--phosphor": bg.phosphor,
        "--phosphor-dim": bg.phosphorDim,
        "--phosphor-glow": bg.phosphorGlow,
        "--phosphor-soft": bg.phosphorSoft,
        "--panel-border": bg.panelBorder,
        "--grid-color": bg.grid,
        "--vignette-color": bg.vignette,
      };
    },
  },
  watch: {
    showOptionsMenu(isOpen) {
      if (isOpen) {
        this.updatePopoverPosition();
        document.addEventListener("keydown", this.onKeydown);
        window.addEventListener("resize", this.updatePopoverPosition);
        setTimeout(() => {
          document.addEventListener("click", this.onClickOutside);
        }, 0);
      } else {
        document.removeEventListener("keydown", this.onKeydown);
        document.removeEventListener("resize", this.updatePopoverPosition);
        document.removeEventListener("click", this.onClickOutside);
      }
    },
  },
  mounted() {
    document.addEventListener("fullscreenchange", this.onFullscreenChange);
  },
  beforeUnmount() {
    document.removeEventListener("fullscreenchange", this.onFullscreenChange);
    document.removeEventListener("keydown", this.onKeydown);
    document.removeEventListener("click", this.onClickOutside);
    window.removeEventListener("resize", this.updatePopoverPosition);
  },
  methods: {
    toggleOptionsMenu() {
      if (!this.showOptionsMenu) {
        this.updatePopoverPosition();
      }
      this.showOptionsMenu = !this.showOptionsMenu;
    },
    updatePopoverPosition() {
      const trigger = this.$refs.configAnchor?.querySelector(".config-trigger");
      if (!trigger) {
        return;
      }
      const rect = trigger.getBoundingClientRect();
      this.popoverPosition = {
        position: "fixed",
        top: `${rect.bottom + 8}px`,
        right: `${Math.max(12, window.innerWidth - rect.right)}px`,
        width: "min(480px, calc(100vw - 2rem))",
        maxHeight: `min(72vh, ${window.innerHeight - rect.bottom - 24}px)`,
      };
    },
    closeOptionsMenu() {
      this.showOptionsMenu = false;
    },
    onKeydown(event) {
      if (event.key === "Escape") {
        this.closeOptionsMenu();
      }
    },
    onClickOutside(event) {
      const anchor = this.$refs.configAnchor;
      const panel = document.querySelector(".config-popover");
      const target = event.target;
      if (
        anchor?.contains(target) ||
        panel?.contains(target)
      ) {
        return;
      }
      this.closeOptionsMenu();
    },
    onFullscreenChange() {
      this.isFullscreen = Boolean(document.fullscreenElement);
    },
    async toggleFullscreen() {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    },
  },
};
</script>

<style>
.app-root {
  position: relative;
  font-family: var(--font-ui);
  color: var(--text-primary);
  min-height: 100vh;
  width: 100vw;
  overflow: visible;
  transition: background 0.5s var(--ease-mechanical);
}

.crt-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}

.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.14) 2px,
    rgba(0, 0, 0, 0.14) 4px
  );
  animation: scanline-scroll 8s linear infinite;
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 85% 75% at 50% 50%,
    transparent 35%,
    var(--vignette-color) 100%
  );
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 75%);
}

.app-shell {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: clamp(0.75rem, 2.5vw, 1.5rem);
  animation: boot-in 0.8s ease-out both;
}

.chrome-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 0.75rem 1.1rem;
  gap: 1rem;
  border: 1px solid var(--ui-border);
  background: var(--ui-surface-overlay);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  overflow: visible;
}

.top-bar {
  position: relative;
  z-index: 30;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.led {
  width: 9px;
  height: 9px;
  background: var(--ui-text-faint);
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.8);
  transition: background 0.25s ease, box-shadow 0.25s ease;
}

.led.on {
  background: var(--color-success);
  box-shadow: 0 0 10px var(--color-success-glow);
  animation: status-pulse-success 2s ease-in-out infinite;
}

.brand-id {
  display: block;
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: var(--ui-text);
}

.brand-sub {
  display: block;
  margin-top: 0.2rem;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  color: var(--ui-text-muted);
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.meta-line {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

.config-anchor {
  position: relative;
}

.config-trigger.open {
  border-color: var(--ui-text);
  background: #2e3531;
}

.config-icon {
  transition: transform 0.35s var(--ease-mechanical);
}

.config-trigger.open .config-icon {
  transform: rotate(90deg);
}

.config-popover-enter-active {
  animation: popover-in 0.28s var(--ease-mechanical) both;
}

.config-popover-leave-active {
  animation: popover-out 0.2s var(--ease-mechanical) both;
}

@keyframes popover-in {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes popover-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
  }
}

.main-timer-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0;
}

.bottom-bar {
  margin-top: auto;
}

.footer-tag {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  color: var(--ui-text-muted);
}

.footer-actions {
  display: flex;
  gap: 0.5rem;
}

.footer-actions a {
  text-decoration: none;
}
</style>

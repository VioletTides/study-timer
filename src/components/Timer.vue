<template>
  <div
    class="timer"
    :class="{ complete: sessionComplete, running: timerState }"
  >
    <div class="timer-unit themed-display hud-panel crt-screen">
      <header class="unit-header">
        <span class="retro-label">Chrono Display</span>
        <span class="unit-id">MDL-CHR-01</span>
      </header>

      <div class="tape-counter" aria-hidden="true">
        <span
          v-for="n in segmentCount"
          :key="n"
          class="segment"
          :class="{ filled: n <= filledSegments }"
        />
      </div>

      <div class="display-block" aria-live="polite">
        <div class="time-readout">
          <template v-if="showHours">
            <span class="digit-block">{{ hrs }}</span>
            <span class="colon" :class="{ blink: timerState }">:</span>
          </template>
          <span class="digit-block">{{ mins }}</span>
          <span class="colon" :class="{ blink: timerState }">:</span>
          <span class="digit-block">{{ secs }}</span>
        </div>
        <p class="session-code">{{ sessionCode }}</p>
      </div>

      <div class="status-line">
        <span class="status-led" :class="statusLedClass" />
        <span class="retro-prompt status-text">{{ statusText }}</span>
      </div>

      <div class="progress-block">
        <p class="progress-label">{{ progressPercent }}% REMAINING</p>
        <div class="progress-rail">
          <div class="progress-fill" :style="{ width: `${progressPercent}%` }" />
        </div>
      </div>
    </div>

    <div class="deck-controls">
      <button
        type="button"
        class="ui-btn ui-btn--danger deck-btn"
        aria-label="Reset timer"
        @click="resetTimer"
      >
        <fa icon="fa-solid fa-rotate-right" />
        Reset
      </button>

      <button
        type="button"
        class="ui-btn deck-btn"
        :class="timerState ? 'is-active' : 'ui-btn--success'"
        :aria-label="timerState ? 'Pause timer' : 'Start timer'"
        @click="toggleTimer"
      >
        <fa :icon="timerState ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
        {{ timerState ? "Pause" : "Start" }}
      </button>
    </div>

    <Transition name="alert">
      <p v-if="sessionComplete" class="alert-banner" role="status">
        !! CYCLE COMPLETE // STANDBY FOR NEXT SESSION !!
      </p>
    </Transition>
  </div>
</template>

<script>
import { useStore } from "../stores/store.js";

const SEGMENT_COUNT = 24;

export default {
  setup() {
    const store = useStore();
    return { store, segmentCount: SEGMENT_COUNT };
  },
  data() {
    return {
      currentTime: 0,
      totalTime: 0,
      hrs: "00",
      mins: "00",
      secs: "00",
      timer: null,
      timerState: false,
      sessionComplete: false,
    };
  },
  computed: {
    showHours() {
      return this.totalTime >= 3600;
    },
    progressFraction() {
      if (!this.totalTime) {
        return 0;
      }
      return this.currentTime / this.totalTime;
    },
    progressPercent() {
      return Math.round(this.progressFraction * 100);
    },
    filledSegments() {
      return Math.round(this.progressFraction * SEGMENT_COUNT);
    },
    sessionCode() {
      const mins = String(this.store.getTimeSync).padStart(2, "0");
      return `TAPE-LENGTH // ${mins}:00:00`;
    },
    statusText() {
      if (this.sessionComplete) {
        return "SESSION TERMINATED // CYCLE OK";
      }
      if (this.timerState) {
        return "RECORDING IN PROGRESS...";
      }
      return "AWAITING OPERATOR INPUT";
    },
    statusLedClass() {
      if (this.sessionComplete) {
        return "ok";
      }
      if (this.timerState) {
        return "rec";
      }
      return "idle";
    },
  },
  watch: {
    "store.timeSync"() {
      this.resetTimer();
    },
  },
  mounted() {
    this.resetTimer();
  },
  beforeUnmount() {
    this.clearTimerInterval();
  },
  methods: {
    toggleTimer() {
      if (this.timerState) {
        this.clearTimerInterval();
        this.timerState = false;
        return;
      }

      this.sessionComplete = false;
      this.timer = setInterval(() => {
        if (this.currentTime > 0) {
          this.currentTime -= 1;
          this.updateTimer();
          return;
        }
        this.onSessionComplete();
      }, 1000);
      this.timerState = true;
    },
    onSessionComplete() {
      this.clearTimerInterval();
      this.timerState = false;
      this.sessionComplete = true;
      this.updateTimer();
    },
    clearTimerInterval() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    resetTimer() {
      this.clearTimerInterval();
      this.timerState = false;
      this.sessionComplete = false;
      this.totalTime = this.store.getTimeSync * 60;
      this.currentTime = this.totalTime;
      this.updateTimer();
    },
    updateTimer() {
      this.hrs = this.formatUnit(Math.floor((this.currentTime / 3600) % 24));
      this.mins = this.formatUnit(Math.floor((this.currentTime / 60) % 60));
      this.secs = this.formatUnit(Math.floor(this.currentTime % 60));
      document.title = `${this.hrs}:${this.mins}:${this.secs} - ${process.env.VUE_APP_TITLE}`;
    },
    formatUnit(value) {
      return value.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
    },
  },
};
</script>

<style scoped>
.timer {
  width: min(100%, 480px);
  animation: timer-rise 0.7s var(--ease-mechanical) 0.1s both;
}

@keyframes timer-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.timer-unit {
  padding: 1rem 1.25rem 1.25rem;
}

.unit-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--panel-border);
}

.unit-id {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--ui-text-muted);
}

.tape-counter {
  display: flex;
  gap: 3px;
  margin-bottom: 1.25rem;
  padding: 0.35rem;
  background: #0a0c0a;
  border: 1px solid var(--phosphor-dim);
}

.segment {
  flex: 1;
  height: 6px;
  background: var(--phosphor-dim);
  opacity: 0.35;
  transition: background 0.3s ease, opacity 0.3s ease;
}

.segment.filled {
  background: var(--phosphor);
  opacity: 1;
  box-shadow: 0 0 6px var(--phosphor-glow);
}

.timer.running .segment.filled {
  animation: led-pulse 1.5s ease-in-out infinite;
}

.display-block {
  text-align: center;
  padding: 0.5rem 0 1rem;
}

.time-readout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
}

.digit-block {
  font-family: var(--font-display);
  font-size: clamp(3.25rem, 15vw, 5rem);
  line-height: 1;
  letter-spacing: 0.08em;
  color: var(--phosphor);
  text-shadow:
    0 0 8px var(--phosphor-glow),
    0 0 24px var(--phosphor-soft),
    2px 2px 0 rgba(0, 0, 0, 0.8);
  font-variant-numeric: tabular-nums;
}

.colon {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 11vw, 3.75rem);
  color: var(--phosphor);
  opacity: 0.85;
  padding-bottom: 0.2rem;
}

.colon.blink {
  animation: cursor-blink 1s step-end infinite;
}

.session-code {
  margin: 0.75rem 0 0;
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  color: var(--ui-text-muted);
}

.status-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-top: 1px dashed var(--phosphor-dim);
}

.status-led {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  background: var(--phosphor-dim);
}

.status-led.idle {
  background: var(--phosphor-dim);
}

.status-led.rec {
  background: var(--color-warning);
  animation: status-blink 0.8s step-end infinite;
  box-shadow: 0 0 8px var(--color-warning-glow);
}

.status-led.ok {
  background: var(--color-success);
  box-shadow: 0 0 10px var(--color-success-glow);
  animation: status-pulse-success 1.5s ease-in-out infinite;
}

.status-text {
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  color: var(--ui-text);
}

.progress-block {
  margin-top: 0.75rem;
}

.progress-label {
  margin: 0 0 0.35rem;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-align: center;
  color: var(--ui-text-muted);
}

.progress-rail {
  height: 12px;
  background: #0a0c0a;
  border: 1px solid var(--phosphor-dim);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: repeating-linear-gradient(
    90deg,
    var(--phosphor) 0px,
    var(--phosphor) 6px,
    transparent 6px,
    transparent 10px
  );
  box-shadow: 0 0 12px var(--phosphor-glow);
  transition: width 0.95s linear;
}

.timer.complete .digit-block {
  color: var(--color-success);
  text-shadow:
    0 0 8px var(--color-success-glow),
    0 0 20px var(--color-success-soft);
}

.deck-controls {
  display: flex;
  justify-content: center;
  gap: 0.65rem;
  margin-top: 1.25rem;
  animation: timer-rise 0.7s var(--ease-mechanical) 0.25s both;
}

.deck-btn {
  min-width: 96px;
}

.alert-banner {
  margin: 1rem 0 0;
  padding: 0.7rem 0.85rem;
  text-align: center;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  color: var(--color-success);
  background: var(--color-success-soft);
  border: 1px solid var(--color-success);
  text-shadow: 0 0 8px var(--color-success-glow);
}

.alert-enter-active {
  animation: alert-in 0.35s var(--ease-mechanical) both;
}

.alert-leave-active {
  animation: alert-out 0.2s ease both;
}

@keyframes alert-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes alert-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>

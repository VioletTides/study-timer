<template>

  <body ref="body">
    <div class="top-bar">
      <button @click="toggleOptionsMenu">
        <fa icon="fa-solid fa-bars" />
      </button>
    </div>
    <div class="main-timer-content">
      <Timer></Timer>
    </div>
    <div class="bottom-bar">
      <fa icon="fa-solid fa-expand" />
      <fa icon="fa-brands fa-github" />
    </div>

  </body>

  <div v-if="showOptionsMenu">
    <OptionsMenu @close="toggleOptionsMenu"></OptionsMenu>
  </div>
</template>

<script>
import OptionsMenu from "./components/OptionsMenu.vue";
import Timer from "./components/Timer.vue";

export default {
  name: "App",
  components: { OptionsMenu, Timer },
  data() {
    return {
      title: "My First App",
      showOptionsMenu: false,
      blur: true,
    };
  },
  methods: {
    toggleOptionsMenu() {
      this.showOptionsMenu = !this.showOptionsMenu;
    },
  },
};
</script>

<style>
@font-face {
  font-family: "Nasa";
  src: url(./fonts/nasalization-rg.otf) format("opentype");
}

#app {
  font-family: "Nasa";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #d5dde6;
  position: absolute;
  height: 100vh;
  width: 100vw;
}

.blur {
  filter: blur(3px);
}

body {
  background: #333;
  margin: 1rem;
  overflow: hidden;
}
</style>

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./styles/global.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBars,
  faExpand,
  faCompress,
  faXmark,
  faRotateRight,
  faPlay,
  faPause,
  faGear,
  faClock,
  faPalette,
  faCircleInfo,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

library.add(
  faExpand,
  faCompress,
  faBars,
  faXmark,
  faRotateRight,
  faPlay,
  faPause,
  faGear,
  faClock,
  faPalette,
  faCircleInfo,
  faCheck,
  faGithub
);

createApp(App)
  .use(createPinia())
  .component("fa", FontAwesomeIcon)
  .mount("#app");

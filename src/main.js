import { createApp } from 'vue'
import { createPinia} from 'pinia'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faBars, faExpand, faXmark, faRotateRight } from '@fortawesome/free-solid-svg-icons'
library.add(faExpand)
library.add(faBars)
library.add(faXmark)
library.add(faRotateRight)

import { faGithub } from '@fortawesome/free-brands-svg-icons'
library.add(faGithub)

createApp(App)
.use(createPinia())
.component('fa', FontAwesomeIcon)
.mount('#app')

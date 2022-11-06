// store.js

import { defineStore } from 'pinia'

export const useStore = defineStore("store", {
    state: () => ({
        timeSync: 30,
    }),
    getters: {
        getTimeSync() {
            return this.timeSync;
        }
    },
    actions: {
        setTimeSync(time) {
            this.timeSync = time;
        },
        resetTimeSync() {
            this.timeSync = 30;
        }
    }
})
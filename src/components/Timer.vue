<template>
    <!-- show the timer with a button fot starting stopping and resetting -->
    <div>
        <div style="display: flex; justify-content: center">
            <div class="main-timer">
                <h1>{{ hrs }} : {{ mins }} : {{ secs }}</h1>
                <button class="reset-button" @click="resetTimer">
                    <fa icon="fa-solid fa-rotate-right"/>
                </button>
            </div>
        </div>

        <div class="toggle-timer">
            <button class="button" @click="toggleTimer" v-if="timerState">Stop</button>
            <button class="button" @click="toggleTimer" v-else>Start</button>
        </div>
    </div>


</template>

<script>
import { useStore } from "../stores/store.js";

export default {
    setup() {
        const store = useStore()
        return { store }
    },
    watch: {
        "store.timeSync": function () {
            console.log("user changed the timer")
            this.resetTimer()
        }
    },
    data() {
        return {
            currentTime: 0,
            hrs: 0,
            mins: 0,
            secs: 0,
            timer: null,
            timerState: false,
        };
    },
    mounted() {
        this.resetTimer();
    },
    methods: {
        toggleTimer() {
            if (this.timerState == false) {
                this.timer = setInterval(() => {
                    if (this.currentTime > 0) {
                        this.currentTime -= 1;
                        this.updateTimer();
                    } else if (this.currentTime <= 0) {
                        clearInterval(this.timer);
                    }
                }, 1000);
                this.timerState = true;
            } else if (this.timerState == true) {
                clearInterval(this.timer);
                this.timerState = false;
            }
        },
        resetTimer() {
            clearInterval(this.timer);
            this.timerState = false;
            this.currentTime = this.store.getTimeSync * 60;
            this.updateTimer();
        },
        updateTimer() {
            this.hrs = Math.floor((this.currentTime / (60 * 60)) % 24).toLocaleString(
                "en-us",
                { minimumIntegerDigits: 2, useGrouping: false }
            );
            this.mins = Math.floor((this.currentTime / 60) % 60).toLocaleString(
                "en-us",
                { minimumIntegerDigits: 2, useGrouping: false }
            );
            this.secs = Math.floor(this.currentTime % 60).toLocaleString("en-us", {
                minimumIntegerDigits: 2,
                useGrouping: false,
            });
            document.title = `${this.hrs}:${this.mins}:${this.secs} - ${process.env.VUE_APP_TITLE}`;
        },
    },
};
</script>

<style scoped>
.main-timer {
    position: relative;
    font-size: 48px;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 0 10px #000;
    display: flex;
    justify-content: center;
    align-items: center;
}

.reset-button {
    position: absolute;
    display: flex;
    right: -25%;
}
.reset-button:active {
    /* 180 degree rotation over 0.5s bezier */
    transform: rotate(360deg);
    transition: transform 2s cubic-bezier(0.4, 0, 0.2, 1);
}

.button {
    font-family: "Nasa";
    background-color: none;
    color: #000;
    border: none;
    padding: 20px 40px;
    border-radius: 50px;
    letter-spacing: 3px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.toggle-timer {
    display: flex;
    justify-content: center;
    ;
}
</style>

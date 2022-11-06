<template>
    <div class="backdrop">

        <div class="menu">
            <div class="top-bar">
                <button class="close-button" @click="closeOptionsMenu">
                    <fa icon="fa-solid fa-xmark" style="color:grey; font-size:18px" />
                </button>
            </div>
            <div>
                <div class="content">
                    <div class="options-list">
                        <!-- options menu title -->
                        <h2>Options</h2>
                        <div><button class="btn-options-list" @click="openMenu('timerMenu')">Timer</button></div>
                        <div><button class="btn-options-list" @click="openMenu('backgroundMenu')">Backgrounds</button>
                        </div>
                        <div><button class="btn-options-list" @click="openMenu('aboutMenu')">About</button></div>

                    </div>
                    <div class="inner-menu background-menu" v-if="backgroundMenu">
                        <div>
                            <p>Select a background below:</p>
                        </div>
                        <div>
                            <p>test</p>
                        </div>
                    </div>
                    <div class="inner-menu timer-menu" v-if="timerMenu">
                        <div>
                            <p>test</p>
                        </div>
                        <!-- a input field to change the initialTime variable -->
                        <form @submit.prevent="changeTime">
                            <input type="number" min="0" max="1439" step="any" v-model="inputMins"
                                :placeholder="inputMins" />
                        </form>
                    </div>
                    <div class="inner-menu about-menu" v-if="aboutMenu">
                        <div>
                            <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut tellus turpis.
                                Nullam porta lacus et lacus convallis euismod. In luctus, felis sit amet viverra
                                blandit, ligula enim maximus justo, sit amet gravida enim odio eu arcu. Ut imperdiet
                                volutpat aliquet. Donec ullamcorper nunc ut tortor sollicitudin ultrices. Nam vitae
                                tellus molestie nibh pellentesque sollicitudin a a ex. Quisque quis hendrerit lacus.

                                Cras purus erat, auctor in urna at, volutpat mollis nulla. Maecenas ornare non nisl
                                vitae interdum. Nullam tincidunt rhoncus lacus, non consequat nunc dignissim at. Donec
                                congue magna elit, non efficitur tortor dignissim non. Aenean tempor felis in convallis
                                consequat. Nullam pellentesque diam sed magna rhoncus malesuada. Sed et accumsan dolor.
                                Maecenas in faucibus tortor, eget blandit metus. Vivamus viverra lectus dui, sit amet
                                malesuada neque dictum in. Aliquam sollicitudin rutrum dui sed tincidunt. Vivamus quis
                                facilisis felis, at venenatis orci. Fusce commodo ex aliquet velit tincidunt, a molestie
                                nunc commodo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque
                                quis lacinia metus.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom-bar" style="display: flex; justify-content: space-between;">
                <button class="button" @click="reset">reset</button>
                <button class="button" @click="submitChanges">submit</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from "../stores/store.js";


export default {
    setup() {
        const store = useStore();
        return { store };
    },
    data() {
        return {
            inputMins: this.store.timeSync,
            timerMenu: true,
            backgroundMenu: false,
            aboutMenu: false,
        }
    },
    methods: {
        closeOptionsMenu() {
            this.$emit("close");
        },
        openMenu(menu) {
            if (menu == "timerMenu") {
                this.backgroundMenu = false;
                this.timerMenu = true;
                this.aboutMenu = false;
            }
            else if (menu == "backgroundMenu") {
                this.backgroundMenu = true;
                this.timerMenu = false;
                this.aboutMenu = false;
            } else if (menu == "aboutMenu") {
                this.backgroundMenu = false;
                this.timerMenu = false;
                this.aboutMenu = true;
            }
        },
        submitChanges() {
            this.changeTime();
        },
        changeTime() {
            this.store.setTimeSync(this.inputMins);
        }
    }
}
</script>

<style scoped>
.menu {
    width: 1000px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin: 100px auto;
    background: rgba(0, 0, 0, 0.1);
    border: 2px solid #fff;
    border-radius: 20px;
}

.backdrop {
    top: 0;
    left: 0;
    position: fixed;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    width: 100vw;
    height: 100vh;
}

.options-list {
    /* move div to the left inline */
    float: inline-start;
    width: 188px;
    height: 100%;
    border-radius: 20px;
    padding-left: 20px;
    display: block;
    /* add spacing between the list elements */
    border: 1px solid #fff;
    border-radius: 20px;

}

.btn-options-list {
    background: none;
    border: none;
    font-family: "Nasa", sans-serif;
    color: #fff;
    font-size: 2vmin;
    cursor: pointer;
    outline: none;
    /* add space between elements */
    line-height: 3.5;

}

.btn-options-list:hover {
    /* add a hover grow and move to the right */
    transform: scale(1.1) translateX(10px);
    /* add a bezier transition */
    transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);

}

/* add a transition coming out of hover */
.btn-options-list:hover {
    transform: scale(1) translateX(5px);
    transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.inner-menu {
    float: inline-start;
    /* set width to fill the parent div with no overflow */
    width: 728px;
    margin-left: 20px;
    padding: 20px;
    height: 100%;
    border-radius: 20px;
    border: 1px solid #fff;


}

.close-button {
    background: none;
    border: none;
    font-family: "Nasa", sans-serif;
    color: #fff;
    font-size: 2vmin;
    cursor: pointer;
    outline: none;

}

.top-bar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.bottom-bar {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}
</style>
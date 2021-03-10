<template>
    <EgretGame />
</template>

<script setup>
import EgretGame from "../egret/EgretGame.vue";
import egretScriptLoader from "../egret/egretScriptLoader";

egretScriptLoader.loadEgret().then((res) => {
    egret.ImageLoader.crossOrigin = "anonymous"; // 解决图片跨域问题
    return egret.runEgret({
        renderMode: "webgl",
        audioType: 0,
        calculateCanvasScaleFactor: (context) => {
            let backingStore =
                context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio ||
                1;
            return (window.devicePixelRatio || 1) / backingStore;
        },
    });
});
</script>

<style>
html,
body,
#app {
    margin: 0;
    padding: 0;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100vw;
    height: 100vh;
    position: relative;
}
</style>

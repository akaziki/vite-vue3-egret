<template>
    <div class="page-egret">
        <div
            class="EgretGame egret-player"
            data-entry-class="Main"
            data-orientation="auto"
            data-scale-mode="fixedHeight"
            data-frame-rate="60"
            :data-content-width="width"
            :data-content-height="height"
            data-multi-fingered="2"
            data-show-fps="false"
            data-show-log="false"
            data-show-fps-style="x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9"
        ></div>
    </div>
</template>

<script setup>
import { ref } from "vue";
const width = ref(window.innerWidth * 2);
const height = ref(window.innerHeight * 2);
</script>

<style>
.page-egret {
    position: absolute !important;
    top: 0;
    left: 0;
    margin: auto;
    width: 100%;
    height: 100%;
    background-color: white;
}
.EgretGame {
    position: absolute !important;
    top: 0;
    left: 0;
    margin: auto;
    width: 100%;
    height: 100%;
}
</style>

import vue from "@vitejs/plugin-vue";
import gameWatcher from "./gameWatcher";
const IS_DEV = process.env.NODE_ENV === "development";

/**
 * https://vitejs.dev/config/
 * @type {import('vite').UserConfig}
 */
export default {
    plugins: [vue()],
    server: {
        watch: IS_DEV ? gameWatcher.init() : null,
    },
};

import axios from 'axios';

const publicPath = window.location.href.split("?")[0].split("#")[0];

class EgretLauncher {
    async loadManifest() {
        let res = await axios({
            url:`${publicPath}game/manifest.json`,
            method:'get',
        })
        return res.data;
    }
    loadScript(list) {
        return new Promise((resolve) => {
            let loaded = 0;
            let loadNext = () => {
                this.loadSingleScript(list[loaded], () => {
                    loaded++;
                    if (loaded >= list.length) {
                        resolve();
                    } else {
                        loadNext();
                    }
                });
            };
            loadNext();
        });
    }
    loadSingleScript(src, callback) {
        let s = document.createElement("script");
        s.async = false;
        s.src = `${publicPath}game/${src}`;
        s.addEventListener(
            "load",
            () => {
                s.parentNode.removeChild(s);
                // s.removeEventListener('load', arguments.callee, false);
                callback();
            },
            false
        );
        document.body.appendChild(s);
    }
    async loadEgret() {
        const manifest = await this.loadManifest();
        let list = manifest.initial.concat(manifest.game);
        await this.loadScript(list);
    }
    getPreloadConfig() {
        return window.GameSdk.getPreloadConfig();
    }
}

export default new EgretLauncher();

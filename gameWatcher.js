const chokidar = require("chokidar");
const path = require("path");
const spawn = require("cross-spawn");
const fs = require("fs");
const egretPath = path.join(__dirname, "./egret");
const egretResourcePath = path.join(__dirname, "./egret/resource");
const egretResourceJsonPath = path.join(
    __dirname,
    `./egret/resource/default.res.json`
);
const publicGameIndexHtmlPath = path.join(
    __dirname,
    "./public/game/index.html"
);

class GameWatcher {
    resMapJson = {
        png: "image",
        mp3: "sound",
        jpg: "image",
        jpeg: "image",
        tmx: "text",
        json: "json",
        fnt: "font",
        dbbin: "bin",
        ttf: "bin",
        zip: "bin",
    };
    init() {
        console.log("game watcher 已启动");

        this.autoGenEgretResourceJson();
        this.egretBuild();
        this.delGameIndexHtml();

        return chokidar
            .watch(egretPath, {
                ignoreInitial: true,
                ignored: `${egretResourcePath}/default.res.json`,
            })
            .on("all", (event, path) => {
                console.log(event, path);
                if (path.indexOf(egretResourcePath) >= 0) {
                    this.autoGenEgretResourceJson(event);
                }
                this.egretBuild();
            });
    }
    delGameIndexHtml() {
        fs.unlinkSync(publicGameIndexHtmlPath);
        console.log(`deleted ${publicGameIndexHtmlPath}`);
    }

    egretBuild() {
        console.log("开始编译白鹭代码...");
        spawn.sync("egret", ["build"], {
            stdio: "ignore",
            cwd: egretPath,
        });
        console.log("白鹭代码编译完成");
    }

    autoGenEgretResourceJson(event) {
        if (!event || (event && (event === "add" || event === "unlink"))) {
            console.log("正在生成default.res.json文件...");
            let defaultJson = {
                groups: [
                    {
                        name: "preload",
                        keys: "",
                    },
                ],
                resources: [],
            };
            let files = this.egretResourcePathAllFiles();
            let keyList = [];
            files.map((relativeUrl) => {
                const resourceInfo = this.getResourceInfo(relativeUrl);
                keyList.push(resourceInfo.name);
                defaultJson.resources.push(resourceInfo);
            });
            defaultJson.groups[0].keys = keyList.join(",");
            fs.writeFileSync(
                egretResourceJsonPath,
                JSON.stringify(defaultJson)
            );
            console.log("生成default.res.json文件完毕");
        }
    }

    egretResourcePathAllFiles() {
        const files = [];
        this.getDirAllFiles(egretResourcePath, files);
        return files
            .filter((absUrl) => absUrl.indexOf("default.res.json") < 0)
            .map((absUrl) => absUrl.replace(`${egretResourcePath}/`, ""));
    }

    getDirAllFiles(path, files) {
        let res = fs.readdirSync(path);
        res.map((item) => {
            const absPath = `${path}/${item}`;
            let stat = fs.lstatSync(absPath);
            if (stat.isDirectory()) {
                this.getDirAllFiles(absPath, files);
            } else {
                files.push(absPath);
            }
        });
    }

    getResourceInfo(relativeUrl) {
        const tempArr = relativeUrl.split("/");
        const fileName = tempArr[tempArr.length - 1];
        const splitArr = fileName.split(".");
        if (splitArr.length > 1) {
            const ext = splitArr[splitArr.length - 1];
            return {
                name: fileName.replace(`.${ext}`, `_${ext}`),
                type: this.resMapJson[ext],
                url: relativeUrl,
            };
        } else {
            return { name: fileName, type: "", url: relativeUrl };
        }
    }
}

export default new GameWatcher();

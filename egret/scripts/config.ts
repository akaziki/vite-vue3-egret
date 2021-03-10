/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>

import * as path from "path";
import {
    CleanPlugin,
    UglifyPlugin,
    IncrementCompilePlugin,
    CompilePlugin,
    ManifestPlugin,
    ExmlPlugin,
    EmitResConfigFilePlugin,
    TextureMergerPlugin,
    RenamePlugin,
    StartServerPlugin,
} from "built-in";
import { CustomPlugin } from "./myplugin";
import { EuiCompilerPlugin } from "./plugins/eui-compiler-plugin";
import {
    WebpackDevServerPlugin,
    WebpackBundlePlugin,
} from "./plugins/webpack-plugin";

const config: ResourceManagerConfig = {
    buildConfig: (params) => {
        const { target, command, projectName, version } = params;

        console.log();
        if (command == "build") {
            const outputDir = "../public/game";
            return {
                outputDir,
                commands: [
                    new CleanPlugin({ matchers: ["game", "js", "resource"] }),
                    new CompilePlugin({ libraryType: "debug" }),
                    new RenamePlugin({
                        verbose: true,
                        hash: "crc32",
                        matchers: [
                            {
                                from: "**/*.js",
                                to: "[path][name]_[hash].[ext]",
                            },
                        ],
                    }),
                    new ManifestPlugin({ output: "manifest.json" }),
                ],
            };
        } else if (command == "publish") {
            const outputDir = `../public/game`;
            return {
                outputDir,
                commands: [
                    new CleanPlugin({ matchers: ["game", "js", "resource"] }),
                    new CustomPlugin(),
                    new CompilePlugin({
                        libraryType: "release",
                        defines: { DEBUG: false, RELEASE: true },
                    }),
                    new ExmlPlugin("commonjs"), // 非 EUI 项目关闭此设置
                    new UglifyPlugin([
                        {
                            sources: ["main.js"],
                            target: "main.min.js",
                        },
                    ]),
                    new RenamePlugin({
                        verbose: true,
                        hash: "crc32",
                        matchers: [
                            {
                                from: "**/*.js",
                                to: "[path][name]_[hash].[ext]",
                            },
                        ],
                    }),
                    new ManifestPlugin({ output: "manifest.json" }),
                ],
            };
        } else {
            throw `unknown command : ${params.command}`;
        }
    },

    mergeSelector: (path) => {
        if (path.indexOf("assets/bitmap/") >= 0) {
            return "assets/bitmap/sheet.sheet";
        } else if (
            path.indexOf("armature") >= 0 &&
            path.indexOf(".json") >= 0
        ) {
            return "assets/armature/1.zip";
        }
    },

    typeSelector: (path) => {
        const ext = path.substr(path.lastIndexOf(".") + 1);
        const typeMap = {
            jpg: "image",
            png: "image",
            webp: "image",
            json: "json",
            fnt: "font",
            pvr: "pvr",
            mp3: "sound",
            zip: "zip",
            sheet: "sheet",
            exml: "text",
        };
        let type = typeMap[ext];
        if (type == "json") {
            if (path.indexOf("sheet") >= 0) {
                type = "sheet";
            } else if (path.indexOf("movieclip") >= 0) {
                type = "movieclip";
            }
        }
        return type;
    },
};

export = config;

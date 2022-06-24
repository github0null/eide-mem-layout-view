const { defineConfig } = require('@vue/cli-service')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: './',
    outputDir: '../eide/res/html/mem_layout_view',
    filenameHashing: false,
    productionSourceMap: false,
    css: {
        sourceMap: false
    },
    configureWebpack: {
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: "@vscode/webview-ui-toolkit/dist/toolkit.min.js", to: "js/vscode-webview-ui-toolkit.min.js", context: "node_modules/" },
                ],
            }),
        ],
    }
})

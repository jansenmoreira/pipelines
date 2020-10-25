const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const outputPath = path.resolve(__dirname, 'dist');

module.exports = {
    entry: './source/main.ts',

    output: {
        path: outputPath,
        filename: 'bundle.js'
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    devtool: 'source-map',

    devServer: {
        contentBase: outputPath,
        compress: true,
        port: 8080,
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            }
        ]
    },

    plugins: [
        new VueLoaderPlugin()
    ]
};

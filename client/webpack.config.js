const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const outputPath = path.resolve(__dirname, 'public');

module.exports = {
    entry: './source/application.ts',

    output: {
        path: outputPath,
        filename: 'bundle.js'
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
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader', 
                    'css-loader'
                ],
            },
        ]
    },

    plugins: [
        new VueLoaderPlugin()
    ]
};

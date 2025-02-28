const path = require('path');

module.exports = {
    entry: {
        index: './index.js',
        viewer: './script/viewer/viewer.js'
    },
    optimization: {
        splitChunks: {
            chunks: 'all', // 벤더와 앱 코드를 분리
        },
    },
    output: {
        filename: '[name].[contenthash].bundle.js', // 캐싱 최적화
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: '[name].[chunkhash].chunk.js', // 청크 파일
    },
    module: {
        rules: [
            {
                test: /\.wasm$/,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        fallback: {
            "fs": false,
            "path": require.resolve("path-browserify"),
            "a": false,
            "env": false,
            "wasi_snapshot_preview1": false,
        },
    },
    module: {
        rules: [
            {
                test: /\.wasm/,
                type: 'asset/resource',
            }
        ]
    },
    mode: 'development'
};
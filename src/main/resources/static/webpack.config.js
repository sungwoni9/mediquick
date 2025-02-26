const path = require('path');

module.exports = {
    entry: {
        index: './index.js',
        viewer: './script/viewer/viewer.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        fallback: {
            "fs": false,
            "path": require.resolve("path-browserify")
        }
    },
    mode: 'development'
};
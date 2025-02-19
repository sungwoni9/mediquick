const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        filename: 'bundle.js',
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
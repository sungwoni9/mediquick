const path = require('path');

module.exports = {
    entry: {
        viewer: './script/viewer/main.js'
    },
    output: {
        filename: 'viewer.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        /**
        library: {
            name: 'Mediquick',
            type: 'umd'
        }
        */
    },
    resolve: {
        fallback: {
            "fs": false,
            "path": require.resolve("path-browserify")
        }
    },
    module: {
        rules: [
            {
                test: /\.wasm/,
                type: 'asset/resource',
            }
        ]
    },
    mode: "production"
};
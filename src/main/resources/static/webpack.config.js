const path = require('path');

module.exports = {
    entry: {
        // 'viewer'라는 이름으로 './script/viewer/viewer.js'를 진입점으로 설정
        test: './index.js',
        viewer: './script/viewer/viewer.js'
    },
    output: {
        // 출력 파일 이름 패턴. '[name]'은 entry에서 정의한 키(index, viewer)가 들어감
        filename: '[name].bundle.js',
        // 출력 파일이 저장될 절대 경로
        path: path.resolve(__dirname, 'dist'),
        // library: {
        //     name: 'Mediquick',
        //     type: 'umd'
        // }
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
    mode: "development"
};
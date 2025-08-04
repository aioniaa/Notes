// 引入一个包
const path = require('path');

// 引入html插件
const HTMLWebpackPlugin = require('html-webpack-plugin');

// 引入clean插件
// clean插件会在编译时删除dist插件后重新生成，确保生成的文件始终是最新的，不会产生旧代码的存在
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// webpack中的所有配置信息都应该写在module.exports中
module.exports = {
    // 指定入口文件
    entry: "./src/index.ts",
    mode: 'development',

    // 指定打包文件所在目录
    output: {
        // 指定打包文件的目录
        path: path.resolve(__dirname, 'dist'),
        // 打包后文件的文件
        filename: "bundle.js"
    },

    // 指定webpack打包时要使用的模块
    module: {
        // 指定要加载的规则
        rules: [
            {
                // test指定的时规则生效的文件
                test: /\.ts$/,
                // 要使用的loader
                use: 'ts-loader',
                // 要排除的文件
                exclude: /node-modules/
            },
            // 设置less文件的处理
            {
                test: /\.less$/,
                // use里的执行顺序是从下往上执行的，因此你想要最先执行的loader需要写在最下面
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ]
            },
        ]
    },

    

    // 配置webpack插件
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            // 指定生成的HTML文件的title
            // title: "This is webpack generated title in HTML",

            // 可以自己指定模板文件，按照模板内容生成对应的HTML
            template: "./src/index.html"
        }),
    ],

    // 用来设置模块，哪些文件可以作为模块来使用
    resolve: {
        extensions: ['.ts', '.js', '.css', '.less']
    }
};
const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

let config = {
    devtool: '#eval-source-map',
    entry: {
        app: ['./index.js'],
        vendor: ['vue', 'vue-router'],
    },
    output: {
        path: path.resolve(`${__dirname}/public/dist`),
        publicPath: '/dist/',
        filename: 'client-bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /.css$/,
                loader: 'style-loader!css-loader!postcss-loader!sass-loader?includePaths[]=./node_modules',
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        js: 'babel-loader',
                        scss: 'style-loader!css-loader!sass-loader?includePaths[]=./node_modules',
                        // scss: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!sass-loader?includePaths[]=./node_modules'}),
                    },
                    postcss: [
                        autoprefixer({
                            browsers: ['last 2 versions'],
                        }),
                    ],
                },
            },
            {
                test: /\.(png|jpg|gif|svg|eot|woff|ttf)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[ext]?[hash]',
                },
            },
        ],
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js',
            scss: path.resolve(__dirname, 'client/scss/'),
            img: path.resolve(__dirname, 'client/img/'),
        },
        extensions: ['.js', '.vue'],
    },
    plugins: [
        // Make sure element-ui uses english
        // new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'client-vendor-bundle.js',
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        // new ExtractTextPlugin('styles.css'),
        new webpack.DefinePlugin({
            ENV: JSON.stringify(process.env.NODE_ENV),
        }),
    ],
}

// Production flag, delete the sourcemapping config and add some production plugins
if (process.env.NODE_ENV === 'production') {
    delete config.devtool
    config.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        })
    )
    config.resolve.alias.vue = 'vue/dist/vue.min.js'
} else {
    // Development mode, so do dev stuff
    // const ExtractTextPlugin = require('extract-text-webpack-plugin')
    config.plugins.push(
        // new ExtractTextPlugin('styles.css'),
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoErrorsPlugin()
        new webpack.NoEmitOnErrorsPlugin()
    )
}

module.exports = config

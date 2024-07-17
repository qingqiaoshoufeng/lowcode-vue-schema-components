const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = ({ onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    config.merge({
      node: {
        fs: 'empty',
      }
    });

    config.module // fixes https://github.com/graphql/graphql-js/issues/1272
      .rule('mjs$')
      .test(/\.mjs$/)
      .include.add(/node_modules/)
      .end()
      .type('javascript/auto');

    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end();

    // config.plugin('define').use(webpack.DefinePlugin, [{
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    // }])

    // config.plugin('BundleAnalyzerPlugin').use(BundleAnalyzerPlugin);
    config.plugin('vue-loader-plugin').use(VueLoaderPlugin);
    // config.merge({
    //   output: {
    //     path: path.resolve(__dirname, 'lib'),
    //     publicPath: '/lib/',
    //     filename: 'index.js',  // 输出文件名
    //     library: 'lowcode-vue-schema-component',
    //     libraryTarget: 'umd'
    //   },
    // });
    // config.merge({
    //   devtool: 'source-map',
    // })

    config.plugin('copy-webpack-plugin').use(CopyWebpackPlugin, [{
      patterns: [
        { from: 'src', to: 'lib' }, // 指定要复制的JS文件夹路径和目标文件夹
      ],
    }]);

    config.resolve.merge({
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
    });
  });
};

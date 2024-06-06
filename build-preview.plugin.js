const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');

module.exports = ({ onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    config.merge({
      node: {
        fs: 'empty',
      },
      devServer: {
        proxy: [
          {
            context: ['/api'],
            target: 'http://10.13.4.153:3001',
            // pathRewrite: { '^/api': '' },
          },
        ],
      },
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
        '@': path.resolve(__dirname, 'src'),
      },
    });
  });
};

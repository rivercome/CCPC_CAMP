const QiniuPlugin = require('qiniu-webpack-plugin')

module.exports = function (webpackConfig, env) {
  if (env !== 'production') {} else {
    webpackConfig.plugins.push(
      new QiniuPlugin({
        ACCESS_KEY: 'bNjSD_Hy9ww3vwmCyK_28lwgqKliYQXEyrvqQU7o',
        SECRET_KEY: '9FmjqwFWDP99Vyg23FUW-K9ZRz30NPZF3q2OzXWG',
        bucket: 'ccpc',
        path: 'camp/'
      })
    )
  }
  return webpackConfig
}

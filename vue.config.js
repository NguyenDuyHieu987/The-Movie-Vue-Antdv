const { defineConfig } = require('@vue/cli-service');
const plugins = [];

if (process.env.NODE_ENV == 'production') {
  const { join } = require('path');
  const PrerenderPlugin = require('prerender-spa-plugin');
  const renderer = PrerenderPlugin.PuppeteerRenderer;
  plugins.unshift(
    new PrerenderPlugin({
      staticDir: join(__dirname, 'dist'),
      routes: ['/', '/info/:id/:name', '/play/:id/:name', '/ranking'],
      renderer: new renderer({
        // renderAfterDocumentEvent: 'render-complete',
      }),
      postProcessHtml: function (context) {
        var titles = {
          '/': 'Phimhay247 - Tất cả các phim hay mới nhất được cập nhật 24/7',
          '/ranking': 'Phimhay247 - Xếp hạng',
        };
        return context.html.replace(
          /<title>[^<]*<\/title>/i,
          '<title>' + titles[context.route] + '</title>'
        );
      },
    })
  );
}

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // proxy: 'http://127.0.0.1:5000/',
  },
  // configureWebpack(config) {
  //   config.plugins = [...config.plugins, ...plugins];
  // },
  configureWebpack: {
    // node: { fs: 'empty' },
  },
});

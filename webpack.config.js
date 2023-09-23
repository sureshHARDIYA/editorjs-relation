const path = require('path');

module.exports = (env, argv) => {
  const { mode } = argv;

  return {
    entry: './src/index.js',
    watch: true,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
          ],
        },
        {
          test: /\.s?[ac]ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader',
          options: {
            removeSVGTagAttrs: false,
          },
        },
      ],
    },
    output: {
      path: __dirname + '/public/dist',
      publicPath: '/',
      filename: mode === 'production' ? 'bundle.js' : `${mode}.bundle.js`,
      library: 'EditorJSRelation',
      libraryTarget: 'umd',
      libraryExport: 'default',
    },

    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization',
      },
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 9000,
    },
  };
};

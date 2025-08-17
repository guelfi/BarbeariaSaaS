const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: false,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true
        },
        angular: {
          test: /[\\/]node_modules[\\/]@angular[\\/]/,
          name: 'angular',
          chunks: 'all',
          priority: 20,
          reuseExistingChunk: true
        },
        material: {
          test: /[\\/]node_modules[\\/]@angular[\\/]material[\\/]/,
          name: 'material',
          chunks: 'all',
          priority: 30,
          reuseExistingChunk: true
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    },
    minimize: true,
    minimizer: [
      // Terser já é incluído por padrão no Angular CLI
    ]
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'src/app/core'),
      '@shared': path.resolve(__dirname, 'src/app/shared'),
      '@features': path.resolve(__dirname, 'src/app/features')
    }
  },
  plugins: [
    // Definir variáveis de ambiente para tree shaking
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.DEBUG': JSON.stringify(false)
    }),
    
    // Analisar bundle size
    new webpack.optimize.ModuleConcatenationPlugin(),
    
    // Remover código morto
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    })
  ],
  
  // Configurações específicas para otimização
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: '@angular-devkit/build-angular/src/babel/webpack-loader',
            options: {
              aot: true,
              buildOptimizer: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
              sassOptions: {
                outputStyle: 'compressed'
              }
            }
          }
        ]
      }
    ]
  }
};
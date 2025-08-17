const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: false,
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 5,
      maxAsyncRequests: 10,
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
        pwa: {
          test: /[\\/]node_modules[\\/]@angular[\\/]service-worker[\\/]/,
          name: 'pwa',
          chunks: 'all',
          priority: 25,
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
    // Configurações específicas para mobile
    concatenateModules: true,
    flagIncludedChunks: true,
    occurrenceOrder: true,
    providedExports: true,
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true
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
      'process.env.DEBUG': JSON.stringify(false),
      'process.env.PWA': JSON.stringify(true)
    }),
    
    // Otimizações específicas para PWA
    new webpack.optimize.ModuleConcatenationPlugin(),
    
    // Remover código não utilizado
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
    
    // Otimizar imports do Angular Material
    new webpack.IgnorePlugin({
      resourceRegExp: /^@angular\/material\/(?!button|input|form-field|icon|card|snack-bar|bottom-sheet|checkbox|divider|progress-spinner)/
    })
  ],
  
  // Configurações específicas para mobile/PWA
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: '@angular-devkit/build-angular/src/babel/webpack-loader',
            options: {
              aot: true,
              buildOptimizer: true,
              // Otimizações específicas para mobile
              target: 'es2015',
              modules: false
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
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['autoprefixer', { grid: true }],
                  ['cssnano', { preset: 'default' }]
                ]
              }
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
      },
      // Otimizar imagens
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash].[ext]',
              outputPath: 'assets/images/'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 80
              },
              optipng: {
                enabled: true
              },
              pngquant: {
                quality: [0.6, 0.8]
              },
              gifsicle: {
                interlaced: false
              },
              webp: {
                quality: 80
              }
            }
          }
        ]
      }
    ]
  },
  
  // Performance hints para mobile
  performance: {
    maxEntrypointSize: 400000, // 400KB
    maxAssetSize: 300000, // 300KB
    hints: 'warning'
  }
};
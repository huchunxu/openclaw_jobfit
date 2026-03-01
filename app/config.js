# JobFit 配置文件

module.exports = {
  projectName: 'jobfit-miniprogram',
  date: '2026-03-02',
  designWidth: 750,
  deviceRatio: {
    750: 1,
    640: 2 / 640,
    375: 750 / 375
  },
  sourceRoot: 'app',
  outputRoot: 'dist',
  plugins: [
    '@tarojs/plugin-framework-react',
    '@tarojs/plugin-platform-weapp'
  ],
  defineConstants: {
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['van-']
        }
      },
      url: {
        enable: true,
        config: {
          limit: 10240
        }
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopeName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8']
        }
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopeName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    webpackChain: (chain) => {
      chain.merge({
        output: {
          publicPath: '/'
        }
      })
    }
  }
}
// JobFit 微信小程序 - app.js
import Taro from '@tarojs/taro'

Taro.cloud.init({
  env: 'your-env-id'
})

App({
  onLaunch() {
    // 检查登录状态
    this.checkLogin()
    
    // 获取系统信息
    const systemInfo = Taro.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo
    this.globalData.statusBarHeight = systemInfo.statusBarHeight
  },
  
  checkLogin() {
    const token = Taro.getStorageSync('token')
    if (token) {
      this.globalData.isLoggedIn = true
      this.globalData.token = token
    }
  },
  
  login(code) {
    return new Promise((resolve, reject) => {
      Taro.login({
        success: res => {
          if (res.code) {
            // 调用后端登录接口
            Taro.request({
              url: `${this.globalData.apiBase}/api/weapp/login`,
              method: 'POST',
              data: { code: res.code },
              success: res => {
                if (res.data.token) {
                  Taro.setStorageSync('token', res.data.token)
                  this.globalData.token = res.data.token
                  this.globalData.isLoggedIn = true
                  resolve(res.data)
                } else {
                  reject(new Error('登录失败'))
                }
              },
              fail: reject
            })
          } else {
            reject(new Error('获取code失败'))
          }
        },
        fail: reject
      })
    })
  },
  
  globalData: {
    userInfo: null,
    token: null,
    isLoggedIn: false,
    apiBase: 'http://localhost:8000',
    systemInfo: null,
    statusBarHeight: 0
  }
})
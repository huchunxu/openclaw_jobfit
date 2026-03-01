// JobFit 微信小程序 - pages/profile/index.js
// 用户档案/我的页面
import Taro from '@tarojs/taro'
import { View, Text, Button, Switch } from '@tarojs/components'
import './index.css'

export default class Profile extends Taro.Component {
  config = {
    navigationBarTitleText: '我的'
  }
  
  state = {
    userInfo: {},
    profile: {},
    stats: {},
    isLoggedIn: false
  }
  
  componentDidShow() {
    this.checkLogin()
  }
  
  checkLogin() {
    const token = Taro.getStorageSync('token')
    if (token) {
      this.setState({ isLoggedIn: true })
      this.loadUserData()
    } else {
      this.setState({ isLoggedIn: false })
    }
  }
  
  async loadUserData() {
    try {
      const token = Taro.getStorageSync('token')
      
      // 获取用户信息
      const userRes = await Taro.request({
        url: `${getApp().globalData.apiBase}/api/users/me`,
        header: { Authorization: `Bearer ${token}` }
      })
      
      // 获取档案
      const profileRes = await Taro.request({
        url: `${getApp().globalData.apiBase}/api/profiles/me`,
        header: { Authorization: `Bearer ${token}` }
      })
      
      // 获取统计
      const statsRes = await Taro.request({
        url: `${getApp().globalData.apiBase}/api/stats`,
        header: { Authorization: `Bearer ${token}` }
      })
      
      this.setState({
        userInfo: userRes.data,
        profile: profileRes.data || {},
        stats: statsRes.data || {}
      })
    } catch (e) {
      console.error('加载用户数据失败', e)
    }
  }
  
  async handleLogin() {
    try {
      await getApp().login()
      this.checkLogin()
      Taro.showToast({ title: '登录成功', icon: 'success' })
    } catch (e) {
      Taro.showToast({ title: '登录失败', icon: 'none' })
    }
  }
  
  async logout() {
    const confirm = await Taro.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？'
    })
    
    if (confirm.confirm) {
      Taro.removeStorageSync('token')
      this.setState({ isLoggedIn: false, userInfo: {}, profile: {} })
    }
  }
  
  render() {
    const { isLoggedIn, userInfo, profile, stats } = this.state
    
    if (!isLoggedIn) {
      return (
        <View className='profile-page'>
          <View className='not-login'>
            <Text className='avatar'>👤</Text>
            <Text className='welcome'>登录 JobFit 开始求职</Text>
            <Button className='login-btn' onClick={this.handleLogin}>
              微信授权登录
            </Button>
          </View>
        </View>
      )
    }
    
    return (
      <View className='profile-page'>
        {/* 用户信息 */}
        <View className='user-section'>
          <View className='avatar-large'>
            {profile.name ? profile.name[0] : '?'}
          </View>
          <View className='user-name'>{profile.name || '未设置姓名'}</View>
          <View className='user-location'>{profile.location || '未设置城市'}</View>
        </View>
        
        {/* 统计 */}
        <View className='stats-grid'>
          <View className='stat-box'>
            <Text className='stat-num'>{stats.resumeCount || 0}</Text>
            <Text className='stat-label'>简历数</Text>
          </View>
          <View className='stat-box'>
            <Text className='stat-num'>{stats.applicationCount || 0}</Text>
            <Text className='stat-label'>投递数</Text>
          </View>
          <View className='stat-box'>
            <Text className='stat-num'>{stats.interviewCount || 0}</Text>
            <Text className='stat-label'>面试数</Text>
          </View>
          <View className='stat-box'>
            <Text className='stat-num'>{stats.avgScore || 0}</Text>
            <Text className='stat-label'>平均分</Text>
          </View>
        </View>
        
        {/* 菜单 */}
        <View className='menu-section'>
          <View className='menu-item' onClick={() => Taro.navigateTo({ url: '/pages/conversation/index' })}>
            <Text className='menu-icon'>📋</Text>
            <Text className='menu-text'>编辑档案</Text>
            <Text className='menu-arrow'>›</Text>
          </View>
          
          <View className='menu-item'>
            <Text className='menu-icon'>🔔</Text>
            <Text className='menu-text'>通知设置</Text>
            <Switch color='#1890ff'/>
          </View>
          
          <View className='menu-item'>
            <Text className='menu-icon'>🔒</Text>
            <Text className='menu-text'>隐私设置</Text>
            <Text className='menu-arrow'>›</Text>
          </View>
          
          <View className='menu-item'>
            <Text className='menu-icon'>❓</Text>
            <Text className='menu-text'>帮助与反馈</Text>
            <Text className='menu-arrow'>›</Text>
          </View>
          
          <View className='menu-item' onClick={this.logout}>
            <Text className='menu-icon'>🚪</Text>
            <Text className='menu-text'>退出登录</Text>
            <Text className='menu-arrow'>›</Text>
          </View>
        </View>
        
        <View className='version'>
          JobFit v1.0.0
        </View>
      </View>
    )
  }
}
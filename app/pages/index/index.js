// JobFit 微信小程序 - pages/index/index.js
import Taro from '@tarojs/taro'
import { View, Text, Button, Input } from '@tarojs/components'
import { AtButton, AtInput, AtCard } from 'taro-ui'
import './index.css'

export default class Index extends Taro.Component {
  config = {
    navigationBarTitleText: 'JobFit - AI求职助手'
  }
  
  state = {
    jdText: '',
    isAnalyzing: false,
    recentJobs: []
  }
  
  componentDidMount() {
    this.loadRecentJobs()
  }
  
  async loadRecentJobs() {
    const token = Taro.getStorageSync('token')
    if (!token) return
    
    try {
      const res = await Taro.request({
        url: `${getApp().globalData.apiBase}/api/jd/recent`,
        header: { Authorization: `Bearer ${token}` }
      })
      this.setState({ recentJobs: res.data || [] })
    } catch (e) {
      console.error('加载最近岗位失败', e)
    }
  }
  
  handleInputChange(e) {
    this.setState({ jdText: e.detail.value })
  }
  
  async analyzeJD() {
    const { jdText } = this.state
    if (!jdText.trim()) {
      Taro.showToast({ title: '请输入JD', icon: 'none' })
      return
    }
    
    this.setState({ isAnalyzing: true })
    
    try {
      const token = Taro.getStorageSync('token')
      const res = await Taro.request({
        url: `${getApp().globalData.apiBase}/api/jd/parse`,
        method: 'POST',
        header: { Authorization: `Bearer ${token}` },
        data: {
          input_type: 'text',
          content: jdText
        }
      })
      
      if (res.data.id) {
        Taro.showToast({ title: '解析成功', icon: 'success' })
        // 跳转到匹配页面
        Taro.navigateTo({
          url: `/pages/match/index?jd_id=${res.data.id}`
        })
      }
    } catch (e) {
      Taro.showToast({ title: '解析失败', icon: 'none' })
    } finally {
      this.setState({ isAnalyzing: false })
    }
  }
  
  render() {
    const { jdText, isAnalyzing, recentJobs } = this.state
    
    return (
      <View className='index-page'>
        {/* 头部 */}
        <View className='header'>
          <Text className='title'>JobFit</Text>
          <Text className='subtitle'>你的 AI 求职助手</Text>
        </View>
        
        {/* 主要输入区域 */}
        <View className='main-input'>
          <View className='input-box'>
            <textarea
              className='jd-input'
              placeholder='粘贴JD文本或招聘链接...'
              value={jdText}
              onInput={this.handleInputChange}
              maxLength={5000}
            />
          </View>
          <Button 
            className='analyze-btn'
            loading={isAnalyzing}
            onClick={this.analyzeJD}
          >
            {isAnalyzing ? '分析中...' : '立即分析'}
          </Button>
        </View>
        
        {/* 快速入口 */}
        <View className='quick-actions'>
          <View className='action-item' onClick={() => Taro.navigateTo({ url: '/pages/profile/index' })}>
            <Text className='action-icon'>📋</Text>
            <Text className='action-text'>我的档案</Text>
          </View>
          <View className='action-item' onClick={() => Taro.navigateTo({ url: '/pages/resumes/index' })}>
            <Text className='action-icon'>📄</Text>
            <Text className='action-text'>简历中心</Text>
          </View>
          <View className='action-item' onClick={() => Taro.navigateTo({ url: '/pages/applications/index' })}>
            <Text className='action-icon'>📮</Text>
            <Text className='action-text'>投递管理</Text>
          </View>
        </View>
        
        {/* 最近分析的岗位 */}
        {recentJobs.length > 0 && (
          <View className='recent-jobs'>
            <Text className='section-title'>最近分析</Text>
            {recentJobs.map(job => (
              <View className='job-card' key={job.id} onClick={() => Taro.navigateTo({ url: `/pages/match/index?jd_id=${job.id}` })}>
                <View className='job-title'>{job.job_title}</View>
                <View className='job-company'>{job.company_name}</View>
                <View className='job-score'>{job.match_score}分</View>
              </View>
            ))}
          </View>
        )}
      </View>
    )
  }
}
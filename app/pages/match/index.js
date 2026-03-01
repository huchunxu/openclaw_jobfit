// JobFit 微信小程序 - pages/match/index.js
// 匹配结果展示页面
import Taro from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import './index.css'

export default class Match extends Taro.Component {
  config = {
    navigationBarTitleText: '匹配分析'
  }
  
  state = {
    jdId: null,
    jdInfo: {},
    matchResult: {},
    isLoading: true
  }
  
  componentDidMount() {
    const jdId = Taro.getStorageSync('last_jd_id') || this.$router.params.jd_id
    if (jdId) {
      this.loadMatchResult(jdId)
    } else {
      Taro.showToast({ title: '参数错误', icon: 'none' })
      Taro.navigateBack()
    }
  }
  
  async loadMatchResult(jdId) {
    this.setState({ isLoading: true })
    
    try {
      const token = Taro.getStorageSync('token')
      
      // 获取 JD 信息
      const jdRes = await Taro.request({
        url: `${getApp().globalData.apiBase}/api/jd/${jdId}`,
        header: { Authorization: `Bearer ${token}` }
      })
      
      // 获取匹配结果
      const matchRes = await Taro.request({
        url: `${getApp().globalData.apiBase}/api/match`,
        method: 'POST',
        header: { Authorization: `Bearer ${token}` },
        data: { jd_id: jdId }
      })
      
      this.setState({
        jdId,
        jdInfo: jdRes.data,
        matchResult: matchRes.data,
        isLoading: false
      })
    } catch (e) {
      Taro.showToast({ title: '加载失败', icon: 'none' })
      this.setState({ isLoading: false })
    }
  }
  
  getScoreColor(score) {
    if (score >= 70) return '#52c41a'
    if (score >= 50) return '#faad14'
    return '#ff4d4f'
  }
  
  getRecommendationColor(level) {
    if (level === 'strong') return '#52c41a'
    if (level === 'conditional') return '#faad14'
    return '#ff4d4f'
  }
  
  async generateResume() {
    const { jdId } = this.state
    Taro.showLoading({ title: '生成中...' })
    
    try {
      const token = Taro.getStorageSync('token')
      const res = await Taro.request({
        url: `${getApp().globalData.apiBase}/api/resumes/generate`,
        method: 'POST',
        header: { Authorization: `Bearer ${token}` },
        data: { jd_id: jdId }
      })
      
      Taro.hideLoading()
      
      if (res.data.id) {
        Taro.navigateTo({
          url: `/pages/resume-preview/index?resume_id=${res.data.id}`
        })
      }
    } catch (e) {
      Taro.hideLoading()
      Taro.showToast({ title: '生成失败', icon: 'none' })
    }
  }
  
  render() {
    const { jdInfo, matchResult, isLoading } = this.state
    
    if (isLoading) {
      return (
        <View className='match-loading'>
          <Text>加载中...</Text>
        </View>
      )
    }
    
    const { overall_score, scores, recommendation, gap_items } = matchResult
    
    return (
      <View className='match-page'>
        {/* JD 信息 */}
        <View className='jd-info'>
          <View className='jd-title'>{jdInfo.job_title}</View>
          <View className='jd-company'>{jdInfo.company_name}</View>
          <View className='jd-location'>{jdInfo.location}</View>
        </View>
        
        {/* 综合评分 */}
        <View className='score-section'>
          <View className='score-label'>综合匹配度</View>
          <View className='score-value' style={{ color: this.getScoreColor(overall_score) }}>
            {overall_score}分
          </View>
          <View className='score-bar'>
            <View 
              className='score-progress' 
              style={{ 
                width: `${overall_score}%`,
                backgroundColor: this.getScoreColor(overall_score)
              }}
            />
          </View>
        </View>
        
        {/* 投递建议 */}
        <View className='recommendation' style={{ borderColor: this.getRecommendationColor(recommendation?.level) }}>
          <View className='rec-label' style={{ color: this.getRecommendationColor(recommendation?.level) }}>
            {recommendation?.label}
          </View>
          <View className='rec-reason'>{recommendation?.reason}</View>
        </View>
        
        {/* 五维评分 */}
        <View className='dimensions'>
          <View className='dim-title'>评分维度</View>
          {scores && Object.entries(scores).map(([key, value]) => (
            <View className='dim-item' key={key}>
              <Text className='dim-name'>
                {key === 'tech_skills' ? '技术技能' :
                 key === 'experience' ? '工作经验' :
                 key === 'education' ? '教育背景' :
                 key === 'soft_skills' ? '软技能' : '关键词'}
              </Text>
              <View className='dim-bar'>
                <View 
                  className='dim-progress' 
                  style={{ width: `${(value.score / value.max) * 100}%` }}
                />
              </View>
              <Text className='dim-score'>{value.score}/{value.max}</Text>
            </View>
          ))}
        </View>
        
        {/* 能力缺口 */}
        {gap_items && gap_items.length > 0 && (
          <View className='gaps'>
            <View className='gaps-title'>需要提升的能力</View>
            {gap_items.map((gap, index) => (
              <View className='gap-item' key={index}>
                <View className='gap-item-name'>
                  <Text className={`severity ${gap.severity}`}>
                    {gap.severity === 'critical' ? '●' : '○'}
                  </Text>
                  {gap.item}
                </View>
                <View className='gap-suggestion'>{gap.suggestion}</View>
              </View>
            ))}
          </View>
        )}
        
        {/* 操作按钮 */}
        <View className='actions'>
          <Button 
            className='generate-btn'
            onClick={this.generateResume}
          >
            生成专属简历
          </Button>
        </View>
      </View>
    )
  }
}
// JobFit 微信小程序 - pages/resumes/index.js
// 简历管理中心
import Taro from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import './index.css'

export default class Resumes extends Taro.Component {
  config = {
    navigationBarTitleText: '简历中心'
  }
  
  state = {
    resumes: [],
    isLoading: true
  }
  
  componentDidShow() {
    this.loadResumes()
  }
  
  async loadResumes() {
    this.setState({ isLoading: true })
    
    try {
      const token = Taro.getStorageSync('token')
      const res = await Taro.request({
        url: `${getApp().globalData.apiBase}/api/resumes`,
        header: { Authorization: `Bearer ${token}` }
      })
      
      this.setState({
        resumes: res.data || [],
        isLoading: false
      })
    } catch (e) {
      this.setState({ isLoading: false })
    }
  }
  
  getStatusText(status) {
    const statusMap = {
      'draft': '草稿',
      'published': '已发布',
      'sent': '已投递',
      'interview': '面试中',
      'offer': '已录用',
      'rejected': '已拒绝'
    }
    return statusMap[status] || status
  }
  
  getStatusColor(status) {
    const colorMap = {
      'draft': '#999',
      'published': '#52c41a',
      'sent': '#1890ff',
      'interview': '#faad14',
      'offer': '#52c41a',
      'rejected': '#ff4d4f'
    }
    return colorMap[status] || '#999'
  }
  
  async exportResume(resumeId, format) {
    Taro.showLoading({ title: '导出中...' })
    
    try {
      const token = Taro.getStorageSync('token')
      const res = await Taro.request({
        url: `${getApp().globalData.apiBase}/api/resumes/${resumeId}/export`,
        method: 'GET',
        data: { format },
        header: { Authorization: `Bearer ${token}` }
      })
      
      Taro.hideLoading()
      
      if (res.data.url) {
        Taro.downloadFile({
          url: res.data.url,
          success: res => {
            Taro.saveFile({ tempFilePath: res.tempFilePath })
            Taro.showToast({ title: '已保存', icon: 'success' })
          }
        })
      }
    } catch (e) {
      Taro.hideLoading()
      Taro.showToast({ title: '导出失败', icon: 'none' })
    }
  }
  
  async deleteResume(resumeId) {
    const confirm = await Taro.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确认删除吗？'
    })
    
    if (!confirm.confirm) return
    
    try {
      const token = Taro.getStorageSync('token')
      await Taro.request({
        url: `${getApp().globalData.apiBase}/api/resumes/${resumeId}`,
        method: 'DELETE',
        header: { Authorization: `Bearer ${token}` }
      })
      
      Taro.showToast({ title: '删除成功', icon: 'success' })
      this.loadResumes()
    } catch (e) {
      Taro.showToast({ title: '删除失败', icon: 'none' })
    }
  }
  
  render() {
    const { resumes, isLoading } = this.state
    
    return (
      <View className='resumes-page'>
        {isLoading ? (
          <View className='loading'>加载中...</View>
        ) : resumes.length === 0 ? (
          <View className='empty'>
            <Text className='empty-icon'>📄</Text>
            <Text className='empty-text'>暂无简历</Text>
            <Text className='empty-hint'>先分析一个岗位，生成专属简历</Text>
          </View>
        ) : (
          <View className='resume-list'>
            {resumes.map(resume => (
              <View className='resume-card' key={resume.id}>
                <View className='resume-header'>
                  <View className='resume-title'>{resume.jd_title || '简历'}</View>
                  <View className='resume-status' style={{ color: this.getStatusColor(resume.status) }}>
                    {this.getStatusText(resume.status)}
                  </View>
                </View>
                
                <View className='resume-info'>
                  <View className='resume-company'>{resume.company_name}</View>
                  <View className='resume-score'>{resume.match_score}分</View>
                </View>
                
                <View className='resume-time'>
                  生成时间：{resume.created_at}
                </View>
                
                <View className='resume-actions'>
                  <Button 
                    className='action-btn' 
                    size='mini'
                    onClick={() => this.exportResume(resume.id, 'pdf')}
                  >
                    导出PDF
                  </Button>
                  <Button 
                    className='action-btn' 
                    size='mini'
                    onClick={() => this.exportResume(resume.id, 'word')}
                  >
                    导出Word
                  </Button>
                  <Button 
                    className='action-btn delete' 
                    size='mini'
                    onClick={() => this.deleteResume(resume.id)}
                  >
                    删除
                  </Button>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {/* 统计 */}
        <View className='stats'>
          <View className='stat-item'>
            <Text className='stat-value'>{resumes.length}</Text>
            <Text className='stat-label'>简历总数</Text>
          </View>
          <View className='stat-item'>
            <Text className='stat-value'>{resumes.filter(r => r.status === 'sent').length}</Text>
            <Text className='stat-label'>已投递</Text>
          </View>
          <View className='stat-item'>
            <Text className='stat-value'>{resumes.filter(r => r.status === 'interview').length}</Text>
            <Text className='stat-label'>面试中</Text>
          </View>
        </View>
      </View>
    )
  }
}
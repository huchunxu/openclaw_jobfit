// JobFit 微信小程序 - pages/applications/index.js
// 投递管理页面
import Taro from '@tarojs/taro'
import { View, Text, Button, Tabs, TabBar } from '@tarojs/components'
import './index.css'

const STATUS_TABS = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待投递' },
  { key: 'sent', label: '已投递' },
  { key: 'interview', label: '面试中' },
  { key: 'offer', label: '已录用' },
  { key: 'rejected', label: '已拒绝' }
]

export default class Applications extends Taro.Component {
  config = {
    navigationBarTitleText: '投递管理'
  }
  
  state = {
    applications: [],
    currentTab: 'all',
    isLoading: true,
    stats: {}
  }
  
  componentDidShow() {
    this.loadApplications()
  }
  
  async loadApplications() {
    const { currentTab } = this.state
    
    this.setState({ isLoading: true })
    
    try {
      const token = Taro.getStorageSync('token')
      const params = currentTab !== 'all' ? { status: currentTab } : {}
      
      const res = await Taro.request({
        url: `${getApp().globalData.apiBase}/api/applications`,
        data: params,
        header: { Authorization: `Bearer ${token}` }
      })
      
      // 计算统计数据
      const apps = res.data || []
      const stats = {
        total: apps.length,
        pending: apps.filter(a => a.status === 'pending').length,
        sent: apps.filter(a => a.status === 'sent').length,
        interview: apps.filter(a => a.status === 'interview').length,
        offer: apps.filter(a => a.status === 'offer').length,
        rejected: apps.filter(a => a.status === 'rejected').length
      }
      
      this.setState({
        applications: apps,
        stats,
        isLoading: false
      })
    } catch (e) {
      this.setState({ isLoading: false })
    }
  }
  
  handleTabChange(tab) {
    this.setState({ currentTab: tab.key }, () => {
      this.loadApplications()
    })
  }
  
  async updateStatus(appId, newStatus) {
    try {
      const token = Taro.getStorageSync('token')
      await Taro.request({
        url: `${getApp().globalData.apiBase}/api/applications/${appId}`,
        method: 'PUT',
        header: { Authorization: `Bearer ${token}` },
        data: { status: newStatus }
      })
      
      Taro.showToast({ title: '更新成功', icon: 'success' })
      this.loadApplications()
    } catch (e) {
      Taro.showToast({ title: '更新失败', icon: 'none' })
    }
  }
  
  getStatusColor(status) {
    const colorMap = {
      'pending': '#999',
      'sent': '#1890ff',
      'screening': '#faad14',
      'interview': '#fa8c16',
      'offer': '#52c41a',
      'rejected': '#ff4d4f',
      'abandoned': '#999'
    }
    return colorMap[status] || '#999'
  }
  
  getNextStatus(currentStatus) {
    const flow = {
      'pending': 'sent',
      'sent': 'screening',
      'screening': 'interview',
      'interview': 'offer',
      'offer': 'offer',
      'rejected': 'rejected'
    }
    return flow[currentStatus]
  }
  
  render() {
    const { applications, currentTab, isLoading, stats } = this.state
    
    return (
      <View className='applications-page'>
        {/* 统计卡片 */}
        <View className='stats-bar'>
          <View className='stat-box'>
            <Text className='stat-num'>{stats.total || 0}</Text>
            <Text className='stat-label'>全部</Text>
          </View>
          <View className='stat-box'>
            <Text className='stat-num'>{stats.interview || 0}</Text>
            <Text className='stat-label'>面试中</Text>
          </View>
          <View className='stat-box'>
            <Text className='stat-num'>{stats.offer || 0}</Text>
            <Text className='stat-label'>已录用</Text>
          </View>
        </View>
        
        {/* Tab 切换 */}
        <View className='tabs'>
          {STATUS_TABS.map(tab => (
            <View 
              key={tab.key}
              className={`tab ${currentTab === tab.key ? 'active' : ''}`}
              onClick={() => this.handleTabChange(tab)}
            >
              {tab.label}
            </View>
          ))}
        </View>
        
        {/* 投递列表 */}
        {isLoading ? (
          <View className='loading'>加载中...</View>
        ) : applications.length === 0 ? (
          <View className='empty'>
            <Text className='empty-icon'>📮</Text>
            <Text className='empty-text'>暂无投递记录</Text>
          </View>
        ) : (
          <View className='app-list'>
            {applications.map(app => (
              <View className='app-card' key={app.id}>
                <View className='app-header'>
                  <View className='app-position'>{app.job_title}</View>
                  <View 
                    className='app-status'
                    style={{ color: this.getStatusColor(app.status) }}
                  >
                    {app.status === 'pending' ? '待投递' :
                     app.status === 'sent' ? '已投递' :
                     app.status === 'screening' ? '筛选中' :
                     app.status === 'interview' ? '面试中' :
                     app.status === 'offer' ? '已录用' :
                     app.status === 'rejected' ? '已拒绝' : app.status}
                  </View>
                </View>
                
                <View className='app-company'>{app.company_name}</View>
                
                {/* 时间轴 */}
                <View className='app-timeline'>
                  {app.generated_at && (
                    <View className='timeline-item'>
                      <Text className='timeline-dot'>●</Text>
                      <Text className='timeline-text'>简历生成 {app.generated_at}</Text>
                    </View>
                  )}
                  {app.sent_at && (
                    <View className='timeline-item'>
                      <Text className='timeline-dot'>●</Text>
                      <Text className='timeline-text'>已投递 {app.sent_at}</Text>
                    </View>
                  )}
                  {app.interview_at && (
                    <View className='timeline-item active'>
                      <Text className='timeline-dot'>◉</Text>
                      <Text className='timeline-text'>面试 {app.interview_at}</Text>
                    </View>
                  )}
                </View>
                
                {/* 操作 */}
                <View className='app-actions'>
                  <Button 
                    size='mini'
                    onClick={() => {
                      const nextStatus = this.getNextStatus(app.status)
                      if (nextStatus && nextStatus !== app.status) {
                        this.updateStatus(app.id, nextStatus)
                      }
                    }}
                  >
                    推进状态
                  </Button>
                  <Button 
                    size='mini'
                    onClick={() => Taro.navigateTo({ 
                      url: `/pages/resumes/index?resume_id=${app.resume_id}` 
                    })}
                  >
                    查看简历
                  </Button>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    )
  }
}
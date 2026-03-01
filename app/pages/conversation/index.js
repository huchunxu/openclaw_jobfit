// JobFit 微信小程序 - pages/conversation/index.js
// 对话式信息采集页面
import Taro from '@tarojs/taro'
import { View, Text, Input, Button, ScrollView } from '@tarojs/components'
import './index.css'

const QUESTION_BANKS = {
  basic: [
    { id: 'name', question: '你好！我是JobFit助手小Fit，先来认识一下你吧～请问你的姓名是？', key: 'name' },
    { id: 'location', question: '你现在在哪个城市？意向工作地点也可以说一下', key: 'location' },
    { id: 'contact', question: '你的联系方式是？（手机号和邮箱）', key: 'contact' },
    { id: 'job_status', question: '你目前的求职状态是？', key: 'job_status', options: ['在职找机会', '离职待业', '应届', '实习生'] }
  ],
  intention: [
    { id: 'target_position', question: '你主要想找什么类型的岗位？说说你的目标职位名称', key: 'target_position' },
    { id: 'industry', question: '你期望在哪个行业发展？有偏好的公司类型吗？', key: 'industry' }
  ],
  education: [
    { id: 'education', question: '先来说说你的教育经历～最高学历是什么？毕业学校和专业是什么？', key: 'education' }
  ],
  work: [
    { id: 'company', question: '请介绍你的工作经历：公司名称、职位和所在部门是什么？', key: 'company' },
    { id: 'responsibility', question: '在这份工作中，你主要负责哪些工作内容？', key: 'responsibility' },
    { id: 'achievement', question: '在这份工作中，你最值得骄傲的成果是什么？有没有具体的数字？', key: 'achievement' },
    { id: 'tools', question: '在这份工作中，你主要用到了哪些技术/工具/方法论？', key: 'tools' }
  ],
  skills: [
    { id: 'tech_skills', question: '说说你的技术技能！列出你熟练掌握的技术、工具、语言等', key: 'tech_skills' },
    { id: 'certifications', question: '有没有职业资格证书或专业认证？', key: 'certifications' }
  ]
}

export default class Conversation extends Taro.Component {
  config = {
    navigationBarTitleText: '建立档案'
  }
  
  state = {
    currentModule: 'basic',
    currentQuestionIndex: 0,
    messages: [],
    userInput: '',
    isRecording: false,
    profileData: {}
  }
  
  componentDidMount() {
    this.startConversation()
  }
  
  startConversation() {
    const firstQuestion = QUESTION_BANKS.basic[0]
    this.setState({
      messages: [
        { role: 'assistant', content: firstQuestion.question }
      ]
    })
  }
  
  handleInput(e) {
    this.setState({ userInput: e.detail.value })
  }
  
  handleSend() {
    const { userInput, messages, currentModule, currentQuestionIndex, profileData } = this.state
    
    if (!userInput.trim()) return
    
    // 添加用户消息
    const newMessages = [...messages, { role: 'user', content: userInput }]
    this.setState({ messages: newMessages, userInput: '' })
    
    // 保存数据
    const currentQuestion = QUESTION_BANKS[currentModule][currentQuestionIndex]
    const newProfileData = { ...profileData, [currentQuestion.key]: userInput }
    
    // 进入下一题
    setTimeout(() => {
      this.nextQuestion(newProfileData)
    }, 500)
  }
  
  nextQuestion(profileData) {
    const { currentModule, currentQuestionIndex } = this.state
    const questions = QUESTION_BANKS[currentModule]
    
    let nextIndex = currentQuestionIndex + 1
    let nextModule = currentModule
    
    // 检查是否需要切换模块
    if (nextIndex >= questions.length) {
      // 按顺序切换模块
      const moduleOrder = ['basic', 'intention', 'education', 'work', 'skills']
      const currentModuleIndex = moduleOrder.indexOf(currentModule)
      
      if (currentModuleIndex < moduleOrder.length - 1) {
        nextModule = moduleOrder[currentModuleIndex + 1]
        nextIndex = 0
      } else {
        // 完成所有问题
        this.finishConversation(profileData)
        return
      }
    }
    
    const nextQuestion = QUESTION_BANKS[nextModule][nextIndex]
    
    this.setState({
      currentModule: nextModule,
      currentQuestionIndex: nextIndex,
      profileData,
      messages: [...this.state.messages, { role: 'assistant', content: nextQuestion.question }]
    })
  }
  
  finishConversation(profileData) {
    // 保存到后端
    this.saveProfile(profileData)
    
    Taro.showToast({ title: '档案创建成功', icon: 'success' })
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/index/index' })
    }, 1500)
  }
  
  async saveProfile(data) {
    const token = Taro.getStorageSync('token')
    try {
      await Taro.request({
        url: `${getApp().globalData.apiBase}/api/profiles`,
        method: 'POST',
        header: { Authorization: `Bearer ${token}` },
        data
      })
    } catch (e) {
      console.error('保存失败', e)
    }
  }
  
  render() {
    const { messages, userInput } = this.state
    
    return (
      <View className='conversation-page'>
        <ScrollView className='messages-list' scrollY>
          {messages.map((msg, index) => (
            <View key={index} className={`message ${msg.role}`}>
              <View className='message-content'>
                {msg.content}
              </View>
            </View>
          ))}
        </ScrollView>
        
        <View className='input-area'>
          <Input
            className='user-input'
            type='text'
            value={userInput}
            onInput={this.handleInput}
            placeholder='请输入...'
            onConfirm={this.handleSend}
          />
          <Button className='send-btn' onClick={this.handleSend}>发送</Button>
        </View>
      </View>
    )
  }
}
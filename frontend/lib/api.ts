import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器 - 添加Token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除并跳转登录
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// 用户相关
export const authAPI = {
  // 发送验证码
  sendCode: (phone: string) =>
    api.post("/api/auth/send-code", { phone }),
  
  // 验证码登录
  loginWithCode: (phone: string, code: string) =>
    api.post("/api/auth/login", { phone, code }),
  
  // 获取当前用户信息
  getCurrentUser: () => api.get("/api/users/me"),
};

// 用户档案
export const profileAPI = {
  // 获取档案
  getProfile: (userId: number) => api.get(`/api/profiles/${userId}`),
  
  // 创建档案
  createProfile: (userId: number, data: any) =>
    api.post(`/api/profiles/${userId}`, data),
  
  // 更新档案
  updateProfile: (userId: number, data: any) =>
    api.put(`/api/profiles/${userId}`, data),
};

// JD 相关
export const jdAPI = {
  // 解析JD
  parseJD: (data: { input_type: string; content: string; platform?: string }) =>
    api.post("/api/jd/parse", data),
  
  // 获取JD列表
  getJDList: (userId: number) => api.get(`/api/jd/list?user_id=${userId}`),
  
  // 获取JD详情
  getJDDetail: (jdId: number) => api.get(`/api/jd/${jdId}`),
};

// 匹配相关
export const matchAPI = {
  // 计算匹配度
  calculateMatch: (userId: number, jdId: number) =>
    api.post("/api/match", null, { params: { user_id: userId, jd_id: jdId } }),
  
  // 获取匹配结果列表
  getMatchList: (userId: number) =>
    api.get(`/api/match/list?user_id=${userId}`),
  
  // 获取匹配详情
  getMatchDetail: (matchId: number) => api.get(`/api/match/${matchId}`),
};

// 简历相关
export const resumeAPI = {
  // 生成简历
  generateResume: (userId: number, data: { jd_id: number; template_id?: string; length_preference?: string }) =>
    api.post("/api/resumes/generate", data, { params: { user_id: userId } }),
  
  // 获取简历列表
  getResumeList: (userId: number) => api.get(`/api/resumes/list?user_id=${userId}`),
  
  // 获取简历详情
  getResumeDetail: (resumeId: number) => api.get(`/api/resumes/${resumeId}`),
  
  // 导出简历
  exportResume: (resumeId: number, format: "pdf" | "word") =>
    api.get(`/api/resumes/${resumeId}/export`, { params: { format } }),
};

// 对话相关
export const conversationAPI = {
  // 开始对话
  startConversation: () => api.post("/api/conversation/start"),
  
  // 发送消息
  sendMessage: (conversationId: number, message: string) =>
    api.post(`/api/conversation/${conversationId}/message`, { message }),
  
  // 获取对话历史
  getHistory: (conversationId: number) =>
    api.get(`/api/conversation/${conversationId}/history`),
};

export default api;
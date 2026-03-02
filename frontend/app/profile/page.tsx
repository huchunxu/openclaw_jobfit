"use client";

import { useState } from "react";

export default function Profile() {
  const [activeSection, setActiveSection] = useState("basic");
  
  // 模拟已有数据
  const [profile, setProfile] = useState({
    // 基本信息
    name: "张三",
    gender: "男",
    birth_year: 1995,
    location: "北京",
    target_locations: ["北京", "上海", "杭州"],
    linkedin_url: "",
    github_url: "https://github.com/zhangsan",
    portfolio_url: "",
    
    // 求职意向
    target_positions: ["高级Python开发工程师", "后端开发工程师"],
    target_industries: ["互联网", "金融科技"],
    salary_range_min: 30000,
    salary_range_max: 50000,
    job_type: "full_time",
    available_date: "2026-04-01",
    
    // 自我介绍
    self_introduction: "5年后端开发经验，熟练掌握Python、Django..."
  });

  const [education, setEducation] = useState([
    {
      id: 1,
      school_name: "清华大学",
      major: "计算机科学与技术",
      degree: "bachelor",
      gpa: "3.8",
      start_date: "2013-09",
      end_date: "2017-06"
    }
  ]);

  const [workExperience, setWorkExperience] = useState([
    {
      id: 1,
      company_name: "字节跳动",
      position: "高级后端开发工程师",
      start_date: "2021-03",
      end_date: "",
      is_current: true,
      achievements: ["负责用户增长系统后端开发", "QPS提升50%"]
    }
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1,
      project_name: "电商平台后端重构",
      role: "技术负责人",
      tech_stack: ["Python", "Django", "MySQL", "Redis"]
    }
  ]);

  const [skills, setSkills] = useState([
    { id: 1, skill_type: "tech", skill_name: "Python", level: "expert", years: 5 },
    { id: 2, skill_type: "tech", skill_name: "Django", level: "proficient", years: 4 },
    { id: 3, skill_type: "tech", skill_name: "MySQL", level: "proficient", years: 5 },
    { id: 4, skill_type: "soft", skill_name: "团队协作", level: "expert" }
  ]);

  const sections = [
    { id: "basic", name: "基本信息", icon: "👤" },
    { id: "job", name: "求职意向", icon: "🎯" },
    { id: "education", name: "教育背景", icon: "🎓" },
    { id: "work", name: "工作经历", icon: "💼" },
    { id: "project", name: "项目经历", icon: "🚀" },
    { id: "skills", name: "技能证书", icon: "🛠️" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">个人信息</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 左侧导航 */}
          <div className="w-48">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeSection === section.id
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.name}
                </button>
              ))}
            </nav>
          </div>

          {/* 右侧内容 */}
          <div className="flex-1">
            {/* 基本信息 */}
            {activeSection === "basic" && (
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">基本信息</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
                    <select
                      value={profile.gender}
                      onChange={(e) => setProfile({...profile, gender: e.target.value})}
                      className="input-field"
                    >
                      <option value="男">男</option>
                      <option value="女">女</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">出生年份</label>
                    <input
                      type="number"
                      value={profile.birth_year}
                      onChange={(e) => setProfile({...profile, birth_year: parseInt(e.target.value)})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">所在城市</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                    <input
                      type="url"
                      value={profile.github_url}
                      onChange={(e) => setProfile({...profile, github_url: e.target.value})}
                      className="input-field"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={profile.linkedin_url}
                      onChange={(e) => setProfile({...profile, linkedin_url: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button className="btn-primary">保存</button>
                </div>
              </div>
            )}

            {/* 求职意向 */}
            {activeSection === "job" && (
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">求职意向</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">目标岗位</label>
                    <input
                      type="text"
                      value={profile.target_positions.join(", ")}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">目标行业</label>
                    <input
                      type="text"
                      value={profile.target_industries.join(", ")}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">期望薪资下限</label>
                    <input
                      type="number"
                      value={profile.salary_range_min}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">期望薪资上限</label>
                    <input
                      type="number"
                      value={profile.salary_range_max}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">工作类型</label>
                    <select value={profile.job_type} className="input-field">
                      <option value="full_time">全职</option>
                      <option value="part_time">兼职</option>
                      <option value="intern">实习</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">可到岗日期</label>
                    <input
                      type="date"
                      value={profile.available_date}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button className="btn-primary">保存</button>
                </div>
              </div>
            )}

            {/* 教育背景 */}
            {activeSection === "education" && (
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">教育背景</h2>
                  <button className="text-indigo-600 hover:text-indigo-700">+ 添加</button>
                </div>
                {education.map((edu) => (
                  <div key={edu.id} className="p-4 bg-gray-50 rounded-lg mb-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500">学校</label>
                        <p className="font-medium">{edu.school_name}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">专业</label>
                        <p className="font-medium">{edu.major}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">学历</label>
                        <p className="font-medium">{edu.degree}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">时间</label>
                        <p className="font-medium">{edu.start_date} - {edu.end_date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 工作经历 */}
            {activeSection === "work" && (
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">工作经历</h2>
                  <button className="text-indigo-600 hover:text-indigo-700">+ 添加</button>
                </div>
                {workExperience.map((exp) => (
                  <div key={exp.id} className="p-4 bg-gray-50 rounded-lg mb-4">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{exp.position}</h3>
                        <p className="text-sm text-gray-500">{exp.company_name}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {exp.start_date} - {exp.is_current ? "至今" : exp.end_date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 项目经历 */}
            {activeSection === "project" && (
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">项目经历</h2>
                  <button className="text-indigo-600 hover:text-indigo-700">+ 添加</button>
                </div>
                {projects.map((proj) => (
                  <div key={proj.id} className="p-4 bg-gray-50 rounded-lg mb-4">
                    <h3 className="font-medium">{proj.project_name}</h3>
                    <p className="text-sm text-gray-500">{proj.role}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {proj.tech_stack.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-sm rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 技能 */}
            {activeSection === "skills" && (
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">技能证书</h2>
                  <button className="text-indigo-600 hover:text-indigo-700">+ 添加</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                      <span className="font-medium">{skill.skill_name}</span>
                      <span className="text-sm text-gray-500">({skill.level})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
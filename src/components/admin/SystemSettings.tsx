'use client';

import { useState } from 'react';
import { 
  Settings, 
  Database, 
  Shield, 
  Bell, 
  Mail, 
  Globe, 
  Palette,
  Save,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';

export function SystemSettings() {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState<string>('general');
  const [loading, setLoading] = useState(false);

  // 系统设置数据（实际应该从API获取）
  const [settings, setSettings] = useState({
    general: {
      site_name: '读书豆',
      site_description: '优质小说阅读平台',
      site_keywords: '小说,阅读,文学',
      admin_email: 'admin@example.com',
      timezone: 'Asia/Shanghai',
      language: 'zh-CN'
    },
    security: {
      password_min_length: 8,
      login_attempts_limit: 5,
      session_timeout: 3600,
      two_factor_enabled: false,
      ip_whitelist_enabled: false,
      ip_whitelist: ''
    },
    notification: {
      email_notifications: true,
      new_user_notification: true,
      new_novel_notification: true,
      system_alerts: true,
      smtp_host: '',
      smtp_port: 587,
      smtp_username: '',
      smtp_password: '',
      smtp_encryption: 'tls'
    },
    content: {
      novel_approval_required: false,
      chapter_approval_required: false,
      comment_moderation: true,
      max_upload_size: 10,
      allowed_file_types: 'jpg,jpeg,png,gif',
      content_filter_enabled: true
    }
  });

  const sections = [
    { id: 'general', label: '基本设置', icon: Settings },
    { id: 'security', label: '安全设置', icon: Shield },
    { id: 'notification', label: '通知设置', icon: Bell },
    { id: 'content', label: '内容设置', icon: Globe }
  ];

  const handleSave = async (section: string) => {
    try {
      setLoading(true);
      // 这里应该调用API保存设置
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
      showToast('设置保存成功', 'success');
    } catch (err) {
      console.error('Failed to save settings:', err);
      showToast('保存失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (section: string) => {
    if (!confirm('确定要重置此部分的设置吗？')) {
      return;
    }
    
    // 重置为默认值的逻辑
    showToast('设置已重置', 'success');
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-light-text dark:text-dark-text">
          系统设置
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleReset(activeSection)}
            className="px-4 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg dark:hover:bg-dark-bg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            重置
          </button>
          <button
            onClick={() => handleSave(activeSection)}
            disabled={loading}
            className="px-4 py-2 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? '保存中...' : '保存设置'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border p-4">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                      activeSection === section.id
                        ? 'bg-light-accent dark:bg-dark-accent text-white'
                        : 'text-light-text dark:text-dark-text hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="lg:col-span-3">
          <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border p-6">
            {/* 基本设置 */}
            {activeSection === 'general' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  基本设置
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      网站名称
                    </label>
                    <input
                      type="text"
                      value={settings.general.site_name}
                      onChange={(e) => updateSetting('general', 'site_name', e.target.value)}
                      className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      管理员邮箱
                    </label>
                    <input
                      type="email"
                      value={settings.general.admin_email}
                      onChange={(e) => updateSetting('general', 'admin_email', e.target.value)}
                      className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      时区
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                    >
                      <option value="Asia/Shanghai">Asia/Shanghai</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      语言
                    </label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => updateSetting('general', 'language', e.target.value)}
                      className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                    >
                      <option value="zh-CN">简体中文</option>
                      <option value="en-US">English</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    网站描述
                  </label>
                  <textarea
                    value={settings.general.site_description}
                    onChange={(e) => updateSetting('general', 'site_description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    关键词
                  </label>
                  <input
                    type="text"
                    value={settings.general.site_keywords}
                    onChange={(e) => updateSetting('general', 'site_keywords', e.target.value)}
                    placeholder="用逗号分隔多个关键词"
                    className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                  />
                </div>
              </div>
            )}

            {/* 安全设置 */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  安全设置
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      密码最小长度
                    </label>
                    <input
                      type="number"
                      min="6"
                      max="20"
                      value={settings.security.password_min_length}
                      onChange={(e) => updateSetting('security', 'password_min_length', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      登录尝试限制
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="10"
                      value={settings.security.login_attempts_limit}
                      onChange={(e) => updateSetting('security', 'login_attempts_limit', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      会话超时时间（秒）
                    </label>
                    <input
                      type="number"
                      min="1800"
                      max="86400"
                      value={settings.security.session_timeout}
                      onChange={(e) => updateSetting('security', 'session_timeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="two_factor"
                      checked={settings.security.two_factor_enabled}
                      onChange={(e) => updateSetting('security', 'two_factor_enabled', e.target.checked)}
                      className="w-4 h-4 text-light-accent dark:text-dark-accent bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border dark:border-dark-border rounded focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                    <label htmlFor="two_factor" className="text-sm text-light-text dark:text-dark-text">
                      启用双因素认证
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="ip_whitelist"
                      checked={settings.security.ip_whitelist_enabled}
                      onChange={(e) => updateSetting('security', 'ip_whitelist_enabled', e.target.checked)}
                      className="w-4 h-4 text-light-accent dark:text-dark-accent bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border dark:border-dark-border rounded focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                    <label htmlFor="ip_whitelist" className="text-sm text-light-text dark:text-dark-text">
                      启用IP白名单
                    </label>
                  </div>
                </div>

                {settings.security.ip_whitelist_enabled && (
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      IP白名单（每行一个IP）
                    </label>
                    <textarea
                      value={settings.security.ip_whitelist}
                      onChange={(e) => updateSetting('security', 'ip_whitelist', e.target.value)}
                      rows={4}
                      placeholder="192.168.1.1&#10;10.0.0.1"
                      className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                  </div>
                )}
              </div>
            )}

            {/* 通知设置 */}
            {activeSection === 'notification' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  通知设置
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="email_notifications"
                      checked={settings.notification.email_notifications}
                      onChange={(e) => updateSetting('notification', 'email_notifications', e.target.checked)}
                      className="w-4 h-4 text-light-accent dark:text-dark-accent bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border dark:border-dark-border rounded focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                    <label htmlFor="email_notifications" className="text-sm text-light-text dark:text-dark-text">
                      启用邮件通知
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="new_user_notification"
                      checked={settings.notification.new_user_notification}
                      onChange={(e) => updateSetting('notification', 'new_user_notification', e.target.checked)}
                      className="w-4 h-4 text-light-accent dark:text-dark-accent bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border dark:border-dark-border rounded focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                    <label htmlFor="new_user_notification" className="text-sm text-light-text dark:text-dark-text">
                      新用户注册通知
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="new_novel_notification"
                      checked={settings.notification.new_novel_notification}
                      onChange={(e) => updateSetting('notification', 'new_novel_notification', e.target.checked)}
                      className="w-4 h-4 text-light-accent dark:text-dark-accent bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border dark:border-dark-border rounded focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                    <label htmlFor="new_novel_notification" className="text-sm text-light-text dark:text-dark-text">
                      新小说发布通知
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="system_alerts"
                      checked={settings.notification.system_alerts}
                      onChange={(e) => updateSetting('notification', 'system_alerts', e.target.checked)}
                      className="w-4 h-4 text-light-accent dark:text-dark-accent bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border dark:border-dark-border rounded focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                    <label htmlFor="system_alerts" className="text-sm text-light-text dark:text-dark-text">
                      系统警报通知
                    </label>
                  </div>
                </div>

                {settings.notification.email_notifications && (
                  <div className="space-y-4 pt-4 border-t border-light-border dark:border-dark-border">
                    <h5 className="font-medium text-light-text dark:text-dark-text">SMTP配置</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                          SMTP主机
                        </label>
                        <input
                          type="text"
                          value={settings.notification.smtp_host}
                          onChange={(e) => updateSetting('notification', 'smtp_host', e.target.value)}
                          placeholder="smtp.example.com"
                          className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                          SMTP端口
                        </label>
                        <input
                          type="number"
                          value={settings.notification.smtp_port}
                          onChange={(e) => updateSetting('notification', 'smtp_port', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                          用户名
                        </label>
                        <input
                          type="text"
                          value={settings.notification.smtp_username}
                          onChange={(e) => updateSetting('notification', 'smtp_username', e.target.value)}
                          className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                          密码
                        </label>
                        <input
                          type="password"
                          value={settings.notification.smtp_password}
                          onChange={(e) => updateSetting('notification', 'smtp_password', e.target.value)}
                          className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                        加密方式
                      </label>
                      <select
                        value={settings.notification.smtp_encryption}
                        onChange={(e) => updateSetting('notification', 'smtp_encryption', e.target.value)}
                        className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                      >
                        <option value="none">无</option>
                        <option value="tls">TLS</option>
                        <option value="ssl">SSL</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 内容设置 */}
            {activeSection === 'content' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  内容设置
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="novel_approval"
                      checked={settings.content.novel_approval_required}
                      onChange={(e) => updateSetting('content', 'novel_approval_required', e.target.checked)}
                      className="w-4 h-4 text-light-accent dark:text-dark-accent bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border dark:border-dark-border rounded focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                    <label htmlFor="novel_approval" className="text-sm text-light-text dark:text-dark-text">
                      小说发布需要审核
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="chapter_approval"
                      checked={settings.content.chapter_approval_required}
                      onChange={(e) => updateSetting('content', 'chapter_approval_required', e.target.checked)}
                      className="w-4 h-4 text-light-accent dark:text-dark-accent bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border dark:border-dark-border rounded focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                    <label htmlFor="chapter_approval" className="text-sm text-light-text dark:text-dark-text">
                      章节发布需要审核
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="comment_moderation"
                      checked={settings.content.comment_moderation}
                      onChange={(e) => updateSetting('content', 'comment_moderation', e.target.checked)}
                      className="w-4 h-4 text-light-accent dark:text-dark-accent bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border dark:border-dark-border rounded focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                    <label htmlFor="comment_moderation" className="text-sm text-light-text dark:text-dark-text">
                      评论需要审核
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="content_filter"
                      checked={settings.content.content_filter_enabled}
                      onChange={(e) => updateSetting('content', 'content_filter_enabled', e.target.checked)}
                      className="w-4 h-4 text-light-accent dark:text-dark-accent bg-light-bg-secondary dark:bg-dark-bg-secondary border-light-border dark:border-dark-border rounded focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                    <label htmlFor="content_filter" className="text-sm text-light-text dark:text-dark-text">
                      启用内容过滤
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                      最大上传大小（MB）
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={settings.content.max_upload_size}
                      onChange={(e) => updateSetting('content', 'max_upload_size', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                      允许的文件类型
                    </label>
                    <input
                      type="text"
                      value={settings.content.allowed_file_types}
                      onChange={(e) => updateSetting('content', 'allowed_file_types', e.target.value)}
                      placeholder="jpg,jpeg,png,gif"
                      className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

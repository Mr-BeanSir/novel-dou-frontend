'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  User,
  Shield,
  ShieldOff,
  Mail,
  Calendar,
  Settings,
  BookOpen
} from 'lucide-react';
import { AdminUser, AdminUserQuery } from '@/types/admin';
import { AdminService } from '@/services/admin';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import { useToast } from '@/providers/ToastProvider';
import { Pagination } from '@/components/ui/Pagination';

export function UserManagement() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  });

  // 查询参数
  const [query, setQuery] = useState<AdminUserQuery>({
    page: 1,
    per_page: 20,
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  // 筛选状态
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, [query]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AdminService.getUsers(query);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setQuery(prev => ({
      ...prev,
      search: searchTerm || undefined,
      page: 1
    }));
  };

  const handleFilterChange = (key: keyof AdminUserQuery, value: any) => {
    setQuery(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page }));
  };

  const handleToggleUserStatus = async (user: AdminUser) => {
    try {
      const updatedUser = await AdminService.toggleUserStatus(user.id);
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      showToast(
        updatedUser.is_active ? '用户已启用' : '用户已禁用',
        'success'
      );
    } catch (err) {
      console.error('Failed to toggle user status:', err);
      showToast('操作失败', 'error');
    }
  };

  const getUserGroupBadge = (user: AdminUser) => {
    const isAdmin = user.user_group?.name === '管理员' || user.user_group?.name === 'admin';
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${
        isAdmin
          ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
          : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
      }`}>
        {user.user_group?.name || '普通用户'}
      </span>
    );
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-light-text dark:text-dark-text">
          用户管理
        </h3>
        <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          共 {pagination.total} 个用户
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
              <input
                type="text"
                placeholder="搜索用户名或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white rounded-lg transition-colors"
            >
              搜索
            </button>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg dark:hover:bg-dark-bg transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>

        {/* 筛选选项 */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-light-border dark:border-dark-border">
            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                用户状态
              </label>
              <select
                value={query.is_active === undefined ? '' : query.is_active.toString()}
                onChange={(e) => handleFilterChange('is_active', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              >
                <option value="">全部状态</option>
                <option value="true">已启用</option>
                <option value="false">已禁用</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                排序方式
              </label>
              <select
                value={`${query.sort_by}-${query.sort_order}`}
                onChange={(e) => {
                  const [sort_by, sort_order] = e.target.value.split('-');
                  setQuery(prev => ({ ...prev, sort_by, sort_order: sort_order as 'asc' | 'desc', page: 1 }));
                }}
                className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              >
                <option value="created_at-desc">注册时间（新到旧）</option>
                <option value="created_at-asc">注册时间（旧到新）</option>
                <option value="name-asc">用户名（A-Z）</option>
                <option value="name-desc">用户名（Z-A）</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
                每页显示
              </label>
              <select
                value={query.per_page}
                onChange={(e) => handleFilterChange('per_page', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
              >
                <option value={10}>10 条</option>
                <option value={20}>20 条</option>
                <option value={50}>50 条</option>
                <option value={100}>100 条</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={loadUsers}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            重试
          </button>
        </div>
      )}

      {/* 用户列表 */}
      <div className="bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              暂无用户数据
            </p>
          </div>
        ) : (
          <>
            {/* 表格头部 */}
            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary px-6 py-3 border-b border-light-border dark:border-dark-border">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                <div className="col-span-3">用户信息</div>
                <div className="col-span-2">用户组</div>
                <div className="col-span-2">状态</div>
                <div className="col-span-2">统计</div>
                <div className="col-span-2">注册时间</div>
                <div className="col-span-1">操作</div>
              </div>
            </div>

            {/* 表格内容 */}
            <div className="divide-y divide-light-border dark:divide-dark-border">
              {users.map((user) => (
                <div key={user.id} className="px-6 py-4 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* 用户信息 */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-light-accent dark:bg-dark-accent rounded-full flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-light-text dark:text-dark-text truncate">
                            {user.name}
                          </h4>
                          <div className="flex items-center gap-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.email_verified_at && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded">
                              已验证
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 用户组 */}
                    <div className="col-span-2">
                      {getUserGroupBadge(user)}
                      {user.user_group?.description && (
                        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                          {user.user_group.description}
                        </p>
                      )}
                    </div>

                    {/* 状态 */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          user.is_active 
                            ? 'bg-green-500' 
                            : 'bg-red-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          user.is_active
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {user.is_active ? '活跃' : '禁用'}
                        </span>
                      </div>
                    </div>

                    {/* 统计 */}
                    <div className="col-span-2">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-light-text-secondary dark:text-dark-text-secondary" />
                          <span className="text-light-text-secondary dark:text-dark-text-secondary">小说:</span>
                          <span className="text-light-text dark:text-dark-text font-medium">
                            {user.novel_count || 0}
                          </span>
                        </div>
                        {user.permissions && user.permissions.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-light-text-secondary dark:text-dark-text-secondary" />
                            <span className="text-light-text-secondary dark:text-dark-text-secondary">权限:</span>
                            <span className="text-light-text dark:text-dark-text font-medium">
                              {user.permissions.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 注册时间 */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        {new Date(user.created_at).toLocaleTimeString()}
                      </p>
                    </div>

                    {/* 操作 */}
                    <div className="col-span-1">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleUserStatus(user)}
                          className={`p-1.5 rounded transition-colors ${
                            user.is_active
                              ? 'text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900'
                              : 'text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900'
                          }`}
                          title={user.is_active ? '禁用用户' : '启用用户'}
                        >
                          {user.is_active ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                        </button>

                        <button
                          className="p-1.5 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900 rounded transition-colors"
                          title="管理权限"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 分页 */}
      <Pagination
        pagination={{
          current_page: pagination.current_page,
          last_page: pagination.last_page,
          per_page: pagination.per_page,
          total: pagination.total,
          from: ((pagination.current_page - 1) * pagination.per_page) + 1,
          to: Math.min(pagination.current_page * pagination.per_page, pagination.total)
        }}
        onPageChange={handlePageChange}
        showQuickJump={true}
        className="mt-6 p-4 border-t border-light-border dark:border-dark-border"
      />
    </div>
  );
}

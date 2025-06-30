// 存储迁移工具 - 清理旧的 auth_token 存储

/**
 * 清理旧的 auth_token 存储，统一使用 Zustand 的 user-storage
 */
export function migrateAuthStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    // 检查是否有旧的 auth_token
    const oldToken = localStorage.getItem('auth_token');
    const userStorage = localStorage.getItem('user-storage');

    if (oldToken && !userStorage) {
      // 如果有旧 token 但没有新的存储，迁移数据
      console.log('Migrating auth storage from auth_token to user-storage');
      
      // 创建新的 user-storage 结构
      const newStorage = {
        state: {
          user: null,
          token: oldToken,
          isAuthenticated: true
        },
        version: 0
      };

      localStorage.setItem('user-storage', JSON.stringify(newStorage));
    }

    // 清理旧的 auth_token
    if (oldToken) {
      localStorage.removeItem('auth_token');
      console.log('Removed old auth_token from localStorage');
    }

    // 清理其他可能的旧存储
    const keysToRemove = ['refresh_token'];
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`Removed old ${key} from localStorage`);
      }
    });

  } catch (error) {
    console.error('Error during storage migration:', error);
  }
}

/**
 * 在应用启动时调用此函数进行存储迁移
 */
export function initStorageMigration(): void {
  // 只在客户端执行
  if (typeof window !== 'undefined') {
    migrateAuthStorage();
  }
}

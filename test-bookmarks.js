// 测试收藏 API 的简单脚本
async function testBookmarksAPI() {
  try {
    const response = await fetch('http://localhost:8000/api/novels/bookmarks?page=1&per_page=12', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 这里需要添加认证 token，你可以从浏览器的 localStorage 中获取
        // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    // 验证响应结构
    if (data.bookmarks && Array.isArray(data.bookmarks)) {
      console.log('✅ bookmarks 字段存在且为数组');
      console.log(`📚 收藏数量: ${data.bookmarks.length}`);
    } else {
      console.log('❌ bookmarks 字段不存在或不是数组');
    }

    if (data.pagination && typeof data.pagination === 'object') {
      console.log('✅ pagination 字段存在且为对象');
      console.log(`📄 分页信息: 第${data.pagination.current_page}页，共${data.pagination.total}条`);
    } else {
      console.log('❌ pagination 字段不存在或不是对象');
    }

  } catch (error) {
    console.error('❌ API 调用失败:', error.message);
  }
}

// 在浏览器控制台中运行
console.log('🧪 开始测试收藏 API...');
testBookmarksAPI();

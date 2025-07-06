import { redirect } from 'next/navigation';
import AuthorCard from '@/components/author/AuthorCard';
import { serverGet } from '@/lib/auth-server';
import { getServerUser } from '@/lib/auth-server';
import type { Novel } from '@/types/novel';

// 作者统计接口
interface AuthorStats {
  name: string;
  novel_count: number;
  total_word_count: number;
  total_view_count: number;
  total_bookmark_count: number;
  avg_rating: number;
  latest_novel?: {
    id: number;
    title: string;
    updated_at: string;
  };
  popular_novels: Array<{
    id: number;
    title: string;
    rating: string;
    view_count: number;
  }>;
}

// 服务端获取作者数据
async function getAuthorsData(): Promise<AuthorStats[]> {
  try {
    // 获取所有小说数据，用于聚合作者信息
    const response = await serverGet<{ novels: Novel[]; pagination: any }>('/novels?per_page=1000');
    const novels = response.novels;

    // 按作者聚合数据
    const authorMap = new Map<string, AuthorStats>();

    novels.forEach(novel => {
      const authorName = novel.author;
      
      if (!authorMap.has(authorName)) {
        authorMap.set(authorName, {
          name: authorName,
          novel_count: 0,
          total_word_count: 0,
          total_view_count: 0,
          total_bookmark_count: 0,
          avg_rating: 0,
          popular_novels: []
        });
      }

      const author = authorMap.get(authorName)!;
      author.novel_count++;
      author.total_word_count += novel.word_count;
      author.total_view_count += novel.view_count;
      author.total_bookmark_count += novel.bookmark_count;

      // 更新最新小说
      if (!author.latest_novel || new Date(novel.updated_at) > new Date(author.latest_novel.updated_at)) {
        author.latest_novel = {
          id: novel.id,
          title: novel.title,
          updated_at: novel.updated_at
        };
      }

      // 添加到热门小说列表
      author.popular_novels.push({
        id: novel.id,
        title: novel.title,
        rating: novel.rating,
        view_count: novel.view_count
      });
    });

    // 处理每个作者的数据
    const authors = Array.from(authorMap.values()).map(author => {
      // 计算平均评分
      const validRatings = author.popular_novels
        .map(novel => parseFloat(novel.rating))
        .filter(rating => rating > 0);
      
      author.avg_rating = validRatings.length > 0 
        ? validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length
        : 0;

      // 按评分和浏览量排序热门小说，只保留前3部
      author.popular_novels = author.popular_novels
        .sort((a, b) => {
          const ratingA = parseFloat(a.rating) || 0;
          const ratingB = parseFloat(b.rating) || 0;
          if (ratingA !== ratingB) {
            return ratingB - ratingA;
          }
          return b.view_count - a.view_count;
        })
        .slice(0, 3);

      return author;
    });

    // 按作品数量排序
    return authors.sort((a, b) => b.novel_count - a.novel_count);

  } catch (error) {
    console.error('Failed to fetch authors data:', error);
    return [];
  }
}

export default async function AuthorsPage() {
  // 服务端认证检查
  const user = await getServerUser();
  if (!user) {
    redirect('/login');
  }

  // 服务端获取数据
  const authors = await getAuthorsData();

  // 分组作者
  const prolificAuthors = authors.filter(author => author.novel_count >= 5);
  const activeAuthors = authors.filter(author => author.novel_count >= 2 && author.novel_count < 5);
  const newAuthors = authors.filter(author => author.novel_count === 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 页面头部 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-theme-text mb-4
                       bg-gradient-to-r from-theme-text to-theme-accent bg-clip-text">
          作者大厅
        </h1>
        <p className="text-lg md:text-xl text-theme-text-secondary max-w-3xl mx-auto leading-relaxed">
          发现优秀的小说作者，探索他们的精彩作品
        </p>
      </div>

      {/* 统计信息 */}
      <div className="bg-[#F9F3D2] border border-[#E5D5B7] rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-theme-accent mb-2">
              {authors.length}
            </div>
            <div className="text-theme-text-secondary">位作者</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {prolificAuthors.length}
            </div>
            <div className="text-theme-text-secondary">多产作者</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {activeAuthors.length}
            </div>
            <div className="text-theme-text-secondary">活跃作者</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {newAuthors.length}
            </div>
            <div className="text-theme-text-secondary">新人作者</div>
          </div>
        </div>
      </div>

      {/* 作者内容 */}
      <div className="space-y-12">
        {authors.length > 0 ? (
          <>
            {/* 多产作者 */}
            {prolificAuthors.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-theme-text mb-2 flex items-center gap-2">
                      <span className="text-green-600">🏆</span>
                      多产作者
                    </h2>
                    <p className="text-theme-text-secondary">拥有5部及以上作品的资深作者</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {prolificAuthors.map((author) => (
                    <AuthorCard key={author.name} author={author} />
                  ))}
                </div>
              </section>
            )}

            {/* 活跃作者 */}
            {activeAuthors.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-theme-text mb-2 flex items-center gap-2">
                      <span className="text-blue-600">✨</span>
                      活跃作者
                    </h2>
                    <p className="text-theme-text-secondary">拥有2-4部作品的活跃作者</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {activeAuthors.map((author) => (
                    <AuthorCard key={author.name} author={author} />
                  ))}
                </div>
              </section>
            )}

            {/* 新人作者 */}
            {newAuthors.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-theme-text mb-2 flex items-center gap-2">
                      <span className="text-purple-600">🌟</span>
                      新人作者
                    </h2>
                    <p className="text-theme-text-secondary">刚开始创作的新人作者</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {newAuthors.slice(0, 12).map((author) => (
                    <AuthorCard key={author.name} author={author} />
                  ))}
                </div>
                {newAuthors.length > 12 && (
                  <div className="text-center mt-6">
                    <p className="text-theme-text-secondary">
                      还有 {newAuthors.length - 12} 位新人作者...
                    </p>
                  </div>
                )}
              </section>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">✍️</div>
            <h3 className="text-xl font-bold text-theme-text mb-2">暂无作者</h3>
            <p className="text-theme-text-secondary">
              目前还没有注册的作者
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

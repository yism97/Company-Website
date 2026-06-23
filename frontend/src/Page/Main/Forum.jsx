import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        // 최근 5개만 슬라이스해서 표시
        setPosts(response.data.slice(0, 5));
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'Notice': return '공지';
      case 'News': return '업무';
      case 'Update': return 'A/S';
      default: return category;
    }
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-28 lg:py-0 max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            업무 게시판
          </h2>
        </div>

        <div className="flex justify-end mb-4">
          <Link
            to="/board"
            className="px-5 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center gap-2 border border-gray-200"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            전체보기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              로딩 중...
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              최근 게시물이 없습니다.
            </div>
          ) : (
            posts.map((post) => {
              const attachmentCount = (post.attachments?.length || 0) + (post.images?.length || 0);
              return (
                <Link
                  key={post._id}
                  to={`/board/${post._id}`}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="block border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-colors duration-300"
                >
                  <div className="p-6 flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2.5 mb-3">
                        <span className="w-fit rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600">
                          {getCategoryLabel(post.category)}
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          {post.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{post.author?.username || '관리자'}</span>
                        <span className="text-gray-300">|</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {attachmentCount > 0 && (
                      <div className="shrink-0 text-sm text-blue-600 font-semibold flex items-center gap-1 bg-blue-50/50 px-2.5 py-1.5 rounded-lg border border-blue-100">
                        <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span>첨부 {attachmentCount}개</span>
                      </div>
                    )}
                    <div className="ml-4 shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;

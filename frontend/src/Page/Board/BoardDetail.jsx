import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
        alert('게시글을 불러올 수 없습니다.');
        navigate('/board');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'Notice': return '공지';
      case 'News': return '업무';
      case 'Update': return 'A/S';
      default: return category;
    }
  };

  if (loading) return <div className="py-40 text-center text-gray-500">로딩 중...</div>;
  if (!post) return null;

  return (
    <main className="bg-white">
      <section className="container mx-auto max-w-5xl px-4 py-28">
        {/* 상단 헤더 영역 */}
        <div className="mb-8 border-b border-gray-100 pb-8">
          <button
            onClick={() => navigate('/board')}
            className="mt-6 mb-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-blue-700 sm:w-auto"
          >
            뒤로가기
          </button>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">
              {getCategoryLabel(post.category)}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-950 lg:text-4xl">
            {post.title}
          </h1>
          
          <div className="mt-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
              {(post.author?.username || '관')[0]}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">{post.author?.username || '관리자'}</p>
              <p className="text-xs text-gray-500">작성자</p>
            </div>
          </div>
        </div>

        {/* 본문 영역 */}
        <div className="prose prose-slate max-w-none mb-12 min-h-[300px] whitespace-pre-wrap text-lg leading-relaxed text-slate-800">
          {post.content}
        </div>

        {/* 이미지 갤러리 */}
        {post.images && post.images.length > 0 && (
          <div className="mb-12">
            <h3 className="mb-4 text-lg font-bold text-slate-950">첨부 이미지</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {post.images.map((img, idx) => (
                <div key={idx} className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                  <img 
                    src={img.url.startsWith('http') ? img.url : `http://localhost:3000${img.url}`} 
                    alt={img.name} 
                    className="h-64 w-full object-cover transition hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 첨부파일 리스트 (이미지 포함 모든 파일) */}
        {((post.attachments && post.attachments.length > 0) || (post.images && post.images.length > 0)) && (
          <div className="rounded-xl border border-gray-100 bg-slate-50 p-6">
            <h3 className="mb-4 text-lg font-bold text-slate-950">첨부파일 다운로드</h3>
            <div className="flex flex-col gap-2">
              {/* 모든 파일(이미지 + 기타파일)을 합쳐서 표시 */}
              {[...(post.images || []), ...(post.attachments || [])].map((file, idx) => {
                // 파일명만 추출 (예: /uploads/123.jpg -> 123.jpg)
                const fileNameOnly = file.url.split('/').pop();
                
                return (
                  <a
                    key={idx}
                    href={`http://localhost:3000/api/posts/download/${fileNameOnly}`}
                    download={file.name}
                    className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 transition hover:border-blue-600 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3 text-left">
                      {file.url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      <span className="text-sm font-medium text-slate-700">{file.name}</span>
                    </div>
                    <span className="text-xs font-bold text-blue-600">다운로드</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default BoardDetail;

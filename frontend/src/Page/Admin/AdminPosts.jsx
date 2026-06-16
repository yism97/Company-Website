import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체 분류');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('게시글 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 이 게시글을 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/posts/${id}`, { withCredentials: true });
      setPosts(posts.filter(post => post._id !== id));
      alert('삭제되었습니다.');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  // 검색 및 필터링 로직
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.author?.username || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '전체 분류' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 페이지네이션 로직
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);

  const maxPageButtons = 5;
  const startPage = Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
  const pageNumbers = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, index) => startPage + index
  );

  const previousPageGroup = Math.max(startPage - maxPageButtons, 1);
  const nextPageGroup = Math.min(startPage + maxPageButtons, totalPages);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase text-blue-600">Admin</p>
            <h1 className="text-3xl font-bold text-slate-950">게시글 관리</h1>
          </div>
          <button
            onClick={() => navigate('/admin/create-post')}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 md:w-auto"
          >
            새 글 작성
          </button>
        </div>

        {/* 검색창 및 분류 필터 */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="제목 또는 작성자 검색"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-600 shadow-sm"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-600 shadow-sm md:w-48"
          >
            <option value="전체 분류">전체 분류</option>
            <option value="Notice">공지사항</option>
            <option value="News">뉴스</option>
            <option value="Update">업데이트</option>
          </select>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500">로딩 중...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-20 text-center shadow-sm">
            <p className="text-gray-500">검색 결과가 없거나 작성된 게시글이 없습니다.</p>
          </div>
        ) : (
          <>
            {/* 모바일 화면용 카드 리스트 */}
            <div className="grid gap-4 md:hidden">
              {currentPosts.map((post) => (
                <div key={post._id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="mb-4 font-bold text-slate-900">{post.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/edit-post/${post._id}`)}
                      className="flex-1 rounded-lg border border-blue-600 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="flex-1 rounded-lg border border-red-600 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 데스크탑 화면용 테이블 */}
            <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-sm font-semibold text-slate-700">
                  <tr>
                    <th className="px-6 py-4">카테고리</th>
                    <th className="px-6 py-4">제목</th>
                    <th className="px-6 py-4">작성일</th>
                    <th className="px-6 py-4 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentPosts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{post.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/admin/edit-post/${post._id}`)}
                          className="mr-3 text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-sm font-semibold text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(previousPageGroup)}
                disabled={startPage === 1}
                className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-gray-100 disabled:opacity-40"
              >
                이전
              </button>
              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`h-10 w-10 rounded-lg border text-sm font-semibold transition ${
                    currentPage === num
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-200 bg-white text-slate-700 hover:bg-gray-100'
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(nextPageGroup)}
                disabled={endPage === totalPages || totalPages === 0}
                className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-gray-100 disabled:opacity-40"
              >
                다음
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default AdminPosts;

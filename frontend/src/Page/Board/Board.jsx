import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Board = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체 분류');

  useEffect(() => {
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
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (post.author?.username || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '전체 분류' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  
  const maxPageButtons = 5;
  const startPage = Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
  const pageNumbers = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, index) => startPage + index,
  );

  const previousPageGroup = Math.max(startPage - maxPageButtons, 1);
  const nextPageGroup = Math.min(startPage + maxPageButtons, totalPages);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'Notice': return '공지';
      case 'News': return '업무';
      case 'Update': return 'A/S';
      default: return category;
    }
  };

  return (
    <main className="bg-white">
      <section className="container mx-auto max-w-7xl px-4 py-28">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-blue-600">
              Work Board
            </p>
            <h1 className="mb-5 text-4xl font-bold text-slate-950 lg:text-5xl">
              업무 게시판
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
              관리자 페이지에서 작성된 공지사항 및 업무 자료를 확인하실 수 있습니다.
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-3 rounded-xl border border-gray-100 bg-slate-50 p-4 md:grid-cols-[100px_1fr_120px_140px] md:px-6 md:py-4">
          <select 
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-gray-200 bg-white px-2 py-3 text-sm outline-none transition focus:border-blue-600"
          >
            <option value="전체 분류">전체 분류</option>
            <option value="Notice">공지사항</option>
            <option value="News">뉴스</option>
            <option value="Update">업데이트</option>
          </select>
          <input
            type="search"
            placeholder="제목, 작성자 검색"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-600 md:col-span-3"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
          <div className="hidden grid-cols-[100px_1fr_120px_140px] border-b border-gray-100 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-600 md:grid">
            <span>분류</span>
            <span>제목</span>
            <span>작성자</span>
            <span>작성일</span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-500">게시글을 불러오는 중입니다...</div>
          ) : currentPosts.length === 0 ? (
            <div className="py-20 text-center text-gray-500">등록된 게시글이 없습니다.</div>
          ) : (
            currentPosts.map((post) => (
              <article
                key={post._id}
                onClick={() => navigate(`/board/${post._id}`)}
                className="grid gap-3 border-b border-gray-100 px-6 py-5 last:border-b-0 hover:bg-blue-50 md:grid-cols-[100px_1fr_120px_140px] md:items-center cursor-pointer"
              >
                <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">
                  {getCategoryLabel(post.category)}
                </span>
                <h2 className="font-semibold text-slate-950">{post.title}</h2>
                <span className="text-sm text-gray-600">{post.author?.username || '관리자'}</span>
                <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
              </article>
            ))
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>페이지당 게시글</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 outline-none transition focus:border-blue-600"
            >
              <option value={5}>5개</option>
              <option value={10}>10개</option>
              <option value={20}>20개</option>
            </select>
          </div>

          {totalPages > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(previousPageGroup)}
                disabled={startPage === 1}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                이전
              </button>

              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`h-10 w-10 rounded-lg border text-sm font-semibold transition ${
                    currentPage === pageNumber
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-200 bg-white text-slate-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage(nextPageGroup)}
                disabled={endPage === totalPages || totalPages === 0}
                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Board;

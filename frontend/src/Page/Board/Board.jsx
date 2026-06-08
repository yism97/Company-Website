import { useState } from 'react';

const posts = [
  {
    id: 'notice-001',
    category: '공지',
    title: '태양광 설비 점검 일정 안내',
    author: '관리자',
    createdAt: '2026-05-20',
    views: 128,
    files: 1,
  },
  {
    id: 'project-001',
    category: '업무',
    title: '신규 현장 실사 자료 요청',
    author: '운영팀',
    createdAt: '2026-05-18',
    views: 86,
    files: 2,
  },
  {
    id: 'support-001',
    category: 'A/S',
    title: 'PCS 유지보수 체크리스트 공유',
    author: '기술팀',
    createdAt: '2026-05-15',
    views: 64,
    files: 0,
  },
];

const Board = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);
  const maxPageButtons = 5;
  const startPage =
    Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );
  const previousPageGroup = Math.max(startPage - maxPageButtons, 1);
  const nextPageGroup = Math.min(startPage + maxPageButtons, totalPages);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
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
              공지, 현장 업무, 유지보수 자료를 관리하는 게시판 뼈대입니다. 이후
              MongoDB와 연결하면 목록, 상세, 작성, 첨부파일 기능을 확장할 수
              있습니다.
            </p>
          </div>
          <button
            type="button"
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-blue-700 lg:w-auto"
          >
            글쓰기
          </button>
        </div>

        <div className="mb-6 grid gap-4 rounded-xl border border-gray-100 bg-slate-50 p-4 md:grid-cols-[1fr_160px_120px]">
          <input
            type="search"
            placeholder="제목, 작성자 검색"
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
          />
          <select className="rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-600">
            <option>전체 분류</option>
            <option>공지</option>
            <option>업무</option>
            <option>A/S</option>
          </select>
          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-gray-100"
          >
            검색
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
          <div className="hidden grid-cols-[90px_1fr_120px_140px_90px_90px] border-b border-gray-100 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-600 md:grid">
            <span>분류</span>
            <span>제목</span>
            <span>작성자</span>
            <span>작성일</span>
            <span>조회</span>
            <span>첨부</span>
          </div>

          {currentPosts.map((post) => (
            <article
              key={post.id}
              className="grid gap-3 border-b border-gray-100 px-6 py-5 last:border-b-0 hover:bg-blue-50 md:grid-cols-[90px_1fr_120px_140px_90px_90px] md:items-center"
            >
              <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">
                {post.category}
              </span>
              <h2 className="font-semibold text-slate-950">{post.title}</h2>
              <span className="text-sm text-gray-600">{post.author}</span>
              <span className="text-sm text-gray-500">{post.createdAt}</span>
              <span className="text-sm text-gray-500">{post.views}</span>
              <span className="text-sm text-gray-500">{post.files}</span>
            </article>
          ))}
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
              disabled={endPage === totalPages}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Board;

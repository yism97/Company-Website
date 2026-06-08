const AdminPosts = () => {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase text-blue-600">
              Admin
            </p>
            <h1 className="text-3xl font-bold text-slate-950">
              게시글 관리
            </h1>
          </div>
          <button
            type="button"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 md:w-auto"
          >
            새 글 작성
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-base font-semibold text-slate-800">
            관리자 게시글 관리 화면입니다.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            게시글 목록, 작성, 수정, 삭제 기능을 이 화면에 연결하면 됩니다.
          </p>
        </div>
      </section>
    </main>
  );
};

export default AdminPosts;

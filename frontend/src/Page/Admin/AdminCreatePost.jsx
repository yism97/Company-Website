import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminCreatePost = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Notice');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('content', content);
    
    // 파일들을 타입(이미지 여부)에 따라 분류하여 추가
    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          formData.append('images', file);
        } else {
          formData.append('attachments', file);
        }
      });
    }

    try {
      await axios.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      alert('게시글이 성공적으로 작성되었습니다.');
      navigate('/admin/posts');
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-4xl">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <p className="mb-2 text-sm font-bold uppercase text-blue-600">Admin</p>
          <h1 className="text-3xl font-bold text-slate-950">새 게시글 작성</h1>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              placeholder="게시글 제목을 입력하세요"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            >
              <option value="Notice">공지사항</option>
              <option value="News">업무</option>
              <option value="Update">A/S</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm font-semibold text-slate-700">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="10"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              placeholder="내용을 입력하세요"
              required
            ></textarea>
          </div>

          {/* 파일 업로드 섹션 (이미지 및 파일 통합) */}
          <div className="mb-8">
            <div className="rounded-lg border border-dashed border-gray-300 p-6 transition hover:border-blue-400 bg-slate-50">
              <label className="mb-2 block text-sm font-bold text-slate-700">📎 파일 및 이미지 첨부</label>
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-2 text-xs text-gray-400">
                선택된 파일: {files.length}개 (이미지는 자동으로 본문에, 일반 파일은 첨부파일로 분류됩니다.)
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/posts')}
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-slate-600 transition hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? '게시글 등록 중...' : '게시글 등록'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default AdminCreatePost;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminEditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Notice');
  const [content, setContent] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${id}`);
        const { title, category, content, images, attachments } = response.data;
        setTitle(title);
        setCategory(category);
        setContent(content);
        setExistingImages(images || []);
        setExistingAttachments(attachments || []);
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
        alert('게시글을 불러올 수 없습니다.');
        navigate('/admin/posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleRemoveExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleRemoveExistingAttachment = (index) => {
    setExistingAttachments(existingAttachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('content', content);
    formData.append('existingImages', JSON.stringify(existingImages));
    formData.append('existingAttachments', JSON.stringify(existingAttachments));

    if (newFiles.length > 0) {
      Array.from(newFiles).forEach((file) => {
        if (file.type.startsWith('image/')) {
          formData.append('images', file);
        } else {
          formData.append('attachments', file);
        }
      });
    }

    try {
      await axios.put(`/api/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      alert('게시글이 수정되었습니다.');
      navigate('/admin/posts');
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 text-center">로딩 중...</div>;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-4xl">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <p className="mb-2 text-sm font-bold uppercase text-blue-600">Admin</p>
          <h1 className="text-3xl font-bold text-slate-950">게시글 수정</h1>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
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
              <option value="News">뉴스</option>
              <option value="Update">업데이트</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm font-semibold text-slate-700">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="10"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              required
            ></textarea>
          </div>

          {/* 기존 이미지 관리 */}
          {existingImages.length > 0 && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">기존 이미지</label>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {existingImages.map((img, idx) => (
                  <div key={idx} className="relative group overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <img 
                      src={img.url.startsWith('http') ? img.url : `http://localhost:3000${img.url}`} 
                      alt={img.name} 
                      className="h-24 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(idx)}
                      className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 기존 첨부파일 관리 */}
          {existingAttachments.length > 0 && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">기존 첨부파일</label>
              <div className="flex flex-col gap-2">
                {existingAttachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-gray-200 bg-slate-50 px-4 py-2">
                    <span className="text-sm text-slate-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingAttachment(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 새 파일 업로드 */}
          <div className="mb-8">
            <div className="rounded-lg border border-dashed border-gray-300 p-6 transition hover:border-blue-400 bg-slate-50">
              <label className="mb-2 block text-sm font-bold text-slate-700">📎 새 파일 및 이미지 추가</label>
              <input
                type="file"
                multiple
                onChange={(e) => setNewFiles(e.target.files)}
                className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-2 text-xs text-gray-400">
                선택된 새 파일: {newFiles.length}개
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/posts')}
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-slate-600 hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-400 transition"
            >
              {saving ? '수정 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default AdminEditPost;

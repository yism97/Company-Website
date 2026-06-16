import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체 상태');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('/api/contacts', { withCredentials: true });
      setContacts(response.data);
    } catch (error) {
      console.error('문의 목록 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (id, currentReadStatus) => {
    if (currentReadStatus) return;
    try {
      await axios.patch(`/api/contacts/${id}/read`, {}, { withCredentials: true });
      setContacts(contacts.map(c => c._id === id ? { ...c, isRead: true } : c));
    } catch (error) {
      console.error('읽음 처리 실패:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/contacts/${id}`, { withCredentials: true });
      setContacts(contacts.filter(c => c._id !== id));
    } catch (error) {
      console.error('문의 삭제 실패:', error);
    }
  };

  // 검색 및 필터 로직
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === '전체 상태' ||
      (filterStatus === '읽음' && contact.isRead) ||
      (filterStatus === '안읽음' && !contact.isRead);

    return matchesSearch && matchesStatus;
  });

  // 페이지네이션 로직
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);

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
        <div className="mb-8 border-b border-gray-200 pb-6">
          <p className="mb-2 text-sm font-bold uppercase text-blue-600">Admin</p>
          <h1 className="text-3xl font-bold text-slate-950">문의 관리</h1>
        </div>

        {/* 검색창 및 필터 */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
          <input
            type="text"
            placeholder="제목, 이름, 이메일 검색"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-600 shadow-sm"
          />
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-600 shadow-sm md:w-48"
          >
            <option value="전체 상태">전체 상태</option>
            <option value="읽음">읽음</option>
            <option value="안읽음">안읽음</option>
          </select>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500">로딩 중...</div>
        ) : filteredContacts.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-20 text-center shadow-sm">
            <p className="text-gray-500">검색 결과가 없거나 도착한 문의가 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {currentContacts.map((contact) => (
                <div
                  key={contact._id}
                  className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all ${
                    !contact.isRead ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-900">{contact.subject}</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="font-semibold text-slate-700">{contact.name}</span> ({contact.email}) <br className="md:hidden" />
                        <span className="hidden md:inline"> • </span>
                        {new Date(contact.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex w-full gap-2 md:w-auto">
                      {!contact.isRead && (
                        <button
                          onClick={() => handleToggleRead(contact._id, contact.isRead)}
                          className="flex-1 rounded-md bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 md:flex-none"
                        >
                          읽음 표시
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(contact._id)}
                        className="flex-1 rounded-md bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 md:flex-none"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4 text-slate-700 whitespace-pre-wrap text-sm md:text-base">
                    {contact.message}
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(previousPageGroup)}
                disabled={startPage === 1}
                className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-gray-100 disabled:opacity-40"
              >
                이전
              </button>
              {pageNumbers.map((num) => (
                <button
                  key={num}
                  type="button"
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
                type="button"
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

export default AdminContacts;

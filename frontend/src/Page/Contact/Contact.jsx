const contactInfo = [
  { label: '전화', value: '02-1234-5678' },
  { label: '이메일', value: 'sunfuture@company.com' },
  { label: '주소', value: '서울특별시 강남구 삼성동 123번지' },
  { label: '운영시간', value: '평일 09:00 - 18:00' },
];

const Contact = () => {
  return (
    <main className="min-h-screen bg-white">
      <section className="container mx-auto max-w-7xl px-4 py-28">
        <div className="mb-14 max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-blue-600">
            Contact
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-950 lg:text-5xl">
            문의하기
          </h1>
          <p className="text-lg leading-relaxed text-gray-600">
            태양광 설비, 전력 변환 장치, 유지보수와 관련된 문의를 보내주시면
            담당자가 확인 후 연락드립니다.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          <form className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="block">
                <label
                  htmlFor="contact-name"
                  className="mb-2 block font-semibold text-slate-800"
                >
                  이름
                </label>
                <input
                  id="contact-name"
                  type="text"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-600"
                  placeholder="홍길동"
                />
              </div>
              <div className="block">
                <label
                  htmlFor="contact-phone"
                  className="mb-2 block font-semibold text-slate-800"
                >
                  연락처
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-600"
                  placeholder="010-0000-0000"
                />
              </div>
              <div className="block md:col-span-2">
                <label
                  htmlFor="contact-email"
                  className="mb-2 block font-semibold text-slate-800"
                >
                  이메일
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-600"
                  placeholder="name@example.com"
                />
              </div>
              <div className="block md:col-span-2">
                <label
                  htmlFor="contact-type"
                  className="mb-2 block font-semibold text-slate-800"
                >
                  문의 유형
                </label>
                <select
                  id="contact-type"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
                >
                  <option>태양광 설비 상담</option>
                  <option>PCS / UPS 문의</option>
                  <option>유지보수 문의</option>
                  <option>기타 문의</option>
                </select>
              </div>
              <div className="block md:col-span-2">
                <label
                  htmlFor="contact-message"
                  className="mb-2 block font-semibold text-slate-800"
                >
                  문의 내용
                </label>
                <textarea
                  id="contact-message"
                  rows="7"
                  className="h-40 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-600"
                  placeholder="문의 내용을 입력해주세요."
                />
              </div>
            </div>
            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-blue-700 sm:w-auto"
            >
              문의 보내기
            </button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-xl border border-gray-100 bg-slate-50 p-6">
              <h2 className="mb-5 text-2xl font-bold text-slate-950">
                연락처 정보
              </h2>
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.label}>
                    <p className="text-sm font-bold text-blue-600">
                      {item.label}
                    </p>
                    <p className="text-lg font-semibold text-slate-800">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex aspect-4/3 items-center justify-center rounded-xl border border-gray-100 bg-slate-100 text-sm font-semibold text-slate-400">
              <iframe
                title="삼성동 근처 지도"
                src="https://www.google.com/maps?q=%EC%82%BC%EC%84%B1%EB%8F%99%20%EC%84%9C%EC%9A%B8&output=embed"
                className="h-80 w-full border-0 lg:h-96"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Contact;

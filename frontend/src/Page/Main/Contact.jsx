import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="bg-white py-20 lg:py-48">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 text-center mb-4">
            문의하기
          </h2>
          <p className="text-gray-600 text-lg">
            궁금한 점이 있으신가요? 언제든 문의해주세요.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            {
              title: '전화 문의',
              info: '02-1234-5678',
              subInfo: '평일 09:00 - 18:00',
            },
            {
              title: '이메일 문의',
              info: 'sunfuture@company.com',
              subInfo: '24시간 접수 가능',
            },
            {
              title: '위치',
              info: '서울특별시 강남구',
              subInfo: '삼성동 123번지',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-1">{item.info}</p>
              <p className="text-gray-500 text-sm">{item.subInfo}</p>
            </div>
          ))}
        </div>
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-xl shadow-lg">
            <iframe
              title="삼성동 근처 지도"
              src="https://www.google.com/maps?q=%EC%82%BC%EC%84%B1%EB%8F%99%20%EC%84%9C%EC%9A%B8&output=embed"
              className="h-80 w-full border-0 lg:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
        <div className="text-center">
          <Link
            to="/contact"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 ease-in-out hover:shadow-lg"
          >
            문의하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;

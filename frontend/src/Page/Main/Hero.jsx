import { Link } from 'react-router-dom';
import heroImage from '../../assets/hero.png';

const Hero = () => {
  return (
    <div className="relative min-h-[110vh] bg-linear-to-b from-gray-50 to-white pb-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 max-w-2xl lg:max-w-none text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-gray-900 leading-tight mb-6 lg:mb-12">
              태양광 설비 전문가와 함께
              <span className="block text-blue-600 mt-2 lg:mt-4">
                미래를 설계하세요.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 font-semibold mb-8 max-w-2xl whitespace-normal wrap-break-word">
              에너지 효율성을 높이고 환경을 보호하는 동시에
              <br className="hidden sm:block" />
              비용을 절감할 수있는 태양광 솔루션을 제공합니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/contact"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 text-lg shadow-lg hover:shadow-xl text-center"
              >
                상담 신청하기
              </Link>
              <Link
                to="/about"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-300 text-lg shadow-lg hover:shadow-xl text-center"
              >
                더 알아보기
              </Link>
            </div>
          </div>

          <div className="flex-1 flex w-full justify-center lg:justify-end">
            <div className="relative aspect-4/3 w-full max-w-2xl overflow-hidden rounded-2xl shadow-xl">
              <img
                src={heroImage}
                alt="태양광 설비 이미지"
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { number: '1,200+', label: '설치 완료' },
            { number: '500+', label: '고객 만족' },
            { number: '10+', label: '년 차 전문 경험' },
            { number: '24/7', label: '고객 지원' },
            { number: '98%', label: '고객 재계약률' },
            { number: '30%', label: '평균 전기요금 절감' },
            { number: 'A/S', label: '전문 유지보수' },
            { number: '100%', label: '맞춤형 설계' },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                {item.number}
              </div>
              <div className="text-gray-600 font-semibold">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;

import human1 from '../../assets/human1.png';
import human2 from '../../assets/human2.png';
import human3 from '../../assets/human3.png';

const leaders = [
  {
    name: '김선우',
    role: '대표이사',
    summary: '신재생 에너지 사업 전략과 글로벌 파트너십을 총괄합니다.',
    image: human1,
  },
  {
    name: '박지훈',
    role: '기술총괄',
    summary: '전력 변환 장치, PCS, UPS 기술 개발과 품질 고도화를 이끕니다.',
    image: human2,
  },
  {
    name: '이서연',
    role: '운영총괄',
    summary: '프로젝트 수행, 고객 지원, 유지보수 운영 체계를 관리합니다.',
    image: human3,
  },
];

const principles = [
  '현장 중심의 의사결정',
  '장기적인 고객 신뢰',
  '지속 가능한 기술 투자',
];

const LeaderShip = () => {
  return (
    <main className="bg-white">
      <section className="container mx-auto max-w-7xl px-4 py-28">
        <div className="mb-16 max-w-5xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-blue-600">
            Leadership
          </p>
          <h1 className="mb-6 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl xl:text-5xl">
            안정적인 에너지 솔루션을 이끄는 리더십
          </h1>
          <p className="text-lg leading-relaxed text-gray-600">
            Sunfuture 임원진은 기술 전문성과 현장 경험을 바탕으로 고객에게
            신뢰할 수 있는 전력 솔루션을 제공합니다.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {leaders.map((leader) => (
            <article
              key={leader.name}
              className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl"
            >
              <div className="aspect-4/3 bg-slate-50">
                <img
                  src={leader.image}
                  alt={`${leader.name} ${leader.role}`}
                  className="h-full w-full object-cover object-[center_20%]"
                />
              </div>
              <div className="p-6">
                <h2 className="mb-2 text-2xl font-bold text-slate-950">
                  {leader.name}
                </h2>
                <p className="mb-4 font-semibold text-blue-600">
                  {leader.role}
                </p>
                <p className="leading-relaxed text-gray-600">
                  {leader.summary}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="mb-10 text-center text-3xl font-bold text-slate-950">
            조직도
          </h2>
          <div className="mx-auto max-w-4xl">
            <div className="flex justify-center">
              <div className="w-full max-w-xs rounded-xl border border-blue-200 bg-white px-6 py-5 text-center shadow">
                <p className="text-sm font-semibold text-blue-600">
                  Chief Executive Officer
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">
                  대표이사
                </h3>
                <p className="mt-1 text-gray-600">김선우</p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-10 border-l border-blue-200" />
            </div>
            <div className="mx-auto hidden max-w-xl border-t border-blue-200 md:block" />

            <div className="-mt-px grid grid-cols-2 gap-3 sm:gap-6">
              <div className="rounded-xl border border-blue-200 bg-white px-3 py-4 text-center shadow sm:px-6 sm:py-5">
                <p className="text-sm font-semibold text-blue-600">
                  Technology Division
                </p>
                <h3 className="mt-2 text-lg font-bold text-slate-950 sm:text-xl">
                  기술총괄
                </h3>
                <p className="mt-1 text-gray-600">박지훈</p>
                <div className="mt-5 grid gap-2 sm:mt-6 sm:gap-3">
                  {['기술개발팀', '시공관리팀', '품질안전팀'].map((team) => (
                    <div
                      key={team}
                      className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-3 text-xs font-semibold text-slate-700 sm:px-4 sm:text-sm"
                    >
                      {team}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-blue-200 bg-white px-3 py-4 text-center shadow sm:px-6 sm:py-5">
                <p className="text-sm font-semibold text-blue-600">
                  Operations Division
                </p>
                <h3 className="mt-2 text-lg font-bold text-slate-950 sm:text-xl">
                  운영총괄
                </h3>
                <p className="mt-1 text-gray-600">이서연</p>
                <div className="mt-5 grid gap-2 sm:mt-6 sm:gap-3">
                  {['영업기획팀', '고객지원팀', '경영관리팀'].map((team) => (
                    <div
                      key={team}
                      className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-3 text-xs font-semibold text-slate-700 sm:px-4 sm:text-sm"
                    >
                      {team}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="mb-5 text-3xl font-bold text-slate-950">
              리더십 원칙
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              빠른 성장보다 오래 유지되는 품질을 우선합니다. 기술 검토, 안전성,
              유지보수까지 고려한 의사결정으로 프로젝트 완성도를 높입니다.
            </p>
          </div>
          <div className="grid gap-4">
            {principles.map((principle, index) => (
              <div
                key={principle}
                className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-lg font-semibold text-slate-800">
                  {principle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default LeaderShip;

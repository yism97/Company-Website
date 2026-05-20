import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { languages, translations } from '../../i18n/translations';

const defaultLanguage = 'ko';

const menuItems = [
  { path: '/', key: 'home' },
  { path: '/about', key: 'about' },
  { path: '/leadership', key: 'leadership' },
  { path: '/board', key: 'board' },
  { path: '/our-services', key: 'services' },
  { path: '/contact', key: 'contact' },
];

const getSavedLanguage = () => {
  const savedLanguage = localStorage.getItem('siteLanguage');

  return translations[savedLanguage] ? savedLanguage : defaultLanguage;
};

const MenuItem = ({ path, label, onClick }) => (
  <li>
    <Link
      to={path}
      className="rounded-sm transition hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
      onClick={onClick}
    >
      {label}
    </Link>
  </li>
);

const Navbar = () => {
  const [language, setLanguage] = useState(getSavedLanguage);
  const [isOpen, setIsOpen] = useState(false);

  const labels = translations[language] ?? translations[defaultLanguage];

  const closeMenu = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    localStorage.setItem('siteLanguage', language);
    window.dispatchEvent(
      new CustomEvent('siteLanguageChange', { detail: { language } }),
    );
  }, [language]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
        <Link
          to="/"
          className="shrink-0 text-xl font-extrabold tracking-normal text-slate-950"
          aria-label="ABC Company home"
        >
          SunFuture Company
        </Link>

        <ul className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
          {menuItems.map(({ path, key }) => (
            <MenuItem key={path} path={path} label={labels.nav[key]} />
          ))}
        </ul>

        <div
          className="hidden shrink-0 items-center rounded-full border border-slate-300 bg-slate-50 p-1 lg:flex"
          aria-label={labels.nav.language}
        >
          {languages.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                language === code
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-slate-300 text-slate-950 transition hover:border-blue-600 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-label={isOpen ? labels.nav.close : labels.nav.menu}
          aria-expanded={isOpen}
        >
          {isOpen ? <HiX aria-hidden="true" /> : <HiMenu aria-hidden="true" />}
        </button>
      </nav>

      {isOpen && (
        <div className="fixed bottom-0 right-0 top-0 z-50 h-dvh min-h-screen w-72 max-w-[85vw] overflow-y-auto border-l border-slate-200 bg-white px-6 py-5 text-slate-950 shadow-xl lg:hidden">
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold">ABC Company</span>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-slate-300 text-slate-950 transition hover:border-blue-600 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
              onClick={() => setIsOpen(false)}
              aria-label={labels.nav.close}
            >
              <HiX aria-hidden="true" />
            </button>
          </div>

          <ul className="mt-10 space-y-5 text-lg font-semibold text-slate-700">
            {menuItems.map(({ path, key }) => (
              <MenuItem
                key={path}
                path={path}
                label={labels.nav[key]}
                onClick={closeMenu}
              />
            ))}
          </ul>

          <div
            className="mt-8 flex items-center rounded-full border border-slate-300 bg-slate-50 p-1"
            aria-label={labels.nav.language}
          >
            {languages.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition ${
                  language === code
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

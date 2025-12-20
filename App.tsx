
import React, { useState, useRef } from 'react';
import { Search, Map, Coffee, ShoppingBag, Bed, Compass, X, Home } from 'lucide-react';
import { fetchCityGuide } from './services/gemini';
import { CityData } from './types';
import { Loading } from './components/Loading';
import { CategorySection } from './components/CategorySection';
import { ImagePlaceholder } from './components/ImagePlaceholder';

// Tailwind custom class for enhanced animations and clean UI
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseSubtle {
    0% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.05); opacity: 0.8; }
    100% { transform: scale(1); opacity: 0.5; }
  }
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
  }
  .animate-pulse-subtle {
    animation: pulseSubtle 4s ease-in-out infinite;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CityData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'attractions' | 'nearby' | 'hotels' | 'restaurants' | 'shopping'>('attractions');
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await fetchCityGuide(query);
      setData(result);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError("여행 정보를 찾을 수 없습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setQuery('');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { id: 'attractions', label: '필수 명소', icon: <Compass className="w-4 h-4" /> },
    { id: 'nearby', label: '근교 여행', icon: <Map className="w-4 h-4" /> },
    { id: 'hotels', label: '추천 숙소', icon: <Bed className="w-4 h-4" /> },
    { id: 'restaurants', label: '로컬 맛집', icon: <Coffee className="w-4 h-4" /> },
    { id: 'shopping', label: '쇼핑', icon: <ShoppingBag className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-screen font-sans text-primary watercolor-texture selection:bg-secondary/20 overflow-x-hidden">
      <style>{styles}</style>
      
      {/* Background Decorative Accents */}
      {!data && (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px] animate-pulse-subtle"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>
        </div>
      )}

      {/* Header / Hero Section */}
      <header className={`transition-all duration-700 ease-in-out ${data ? 'py-4 bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100' : 'min-h-screen flex flex-col justify-center'}`}>
        <div className="container mx-auto px-4 w-full max-w-6xl">
          
          {!data ? (
            /* Minimalist Centered Landing Page */
            <div className="max-w-4xl mx-auto space-y-12 animate-fade-in text-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/50 backdrop-blur-sm text-secondary rounded-full text-xs font-black tracking-[0.3em] uppercase mb-4 shadow-sm border border-secondary/10">
                  <Compass className="w-4 h-4" />
                  <span>Curated Travel Experience</span>
                </div>
                
                <h1 className="font-serif font-bold text-primary text-8xl md:text-[10rem] leading-none tracking-tighter">
                  쉽네<br/>
                  <span className="text-secondary font-light italic">Travel</span>
                </h1>
                
                <p className="text-2xl md:text-3xl text-gray-500 font-serif leading-relaxed max-w-2xl mx-auto">
                  복잡한 계획은 걷어내고,<br/>
                  당신이 머물 <span className="text-primary font-bold decoration-wavy underline decoration-secondary/30 underline-offset-8">가장 아름다운 순간</span>만 골랐습니다.
                </p>
              </div>

              <div className="relative w-full max-w-2xl mx-auto group">
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="떠나고 싶은 도시를 입력하세요"
                    className="w-full px-12 py-8 rounded-[2.2rem] bg-white border border-gray-100 focus:border-secondary focus:outline-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] text-2xl placeholder:text-gray-300 transition-all font-serif text-center"
                    disabled={loading}
                  />
                  <button 
                    type="submit"
                    className="absolute right-4 top-4 bottom-4 px-10 bg-primary text-white rounded-[1.8rem] hover:bg-secondary transition-all flex items-center gap-3 font-bold shadow-xl active:scale-95 disabled:opacity-50"
                    disabled={loading}
                  >
                    <Search className="w-6 h-6" />
                    <span className="hidden md:inline text-lg">찾기</span>
                  </button>
                </form>
              </div>

              <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400 font-serif italic pt-4">
                <span className="not-italic font-black text-gray-200 uppercase tracking-widest text-[10px]">Spotlight Cities:</span>
                <button onClick={() => setQuery('Paris')} className="hover:text-secondary hover:underline underline-offset-8 decoration-wavy transition-all">파리</button>
                <button onClick={() => setQuery('Kyoto')} className="hover:text-secondary hover:underline underline-offset-8 decoration-wavy transition-all">교토</button>
                <button onClick={() => setQuery('Jeju')} className="hover:text-secondary hover:underline underline-offset-8 decoration-wavy transition-all">제주</button>
              </div>
            </div>
          ) : (
            /* Sticky Header Search State */
            <div className="flex items-center gap-4">
              <button 
                onClick={handleReset}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="bg-secondary text-white p-2.5 rounded-xl shadow-lg transform rotate-3">
                   <Compass className="w-6 h-6" />
                </div>
                <h1 className="font-serif font-bold text-primary text-2xl hidden sm:block">
                  쉽네 <span className="text-secondary font-light">Travel</span>
                </h1>
              </button>

              <div className="flex-1 flex items-center gap-2">
                <form onSubmit={handleSearch} className="relative flex-1 group max-w-md mx-auto">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="도시 검색..."
                    className="w-full px-6 py-3 rounded-full bg-gray-50 border border-gray-100 focus:bg-white focus:border-secondary focus:outline-none shadow-sm transition-all text-sm font-serif"
                    disabled={loading}
                  />
                  <button 
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-secondary text-white rounded-full hover:bg-orange-600 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>

                <button 
                  onClick={handleReset}
                  className="p-3 bg-gray-50 text-gray-300 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-all border border-gray-100"
                  title="홈으로"
                >
                  <Home className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main ref={resultsRef} className="container mx-auto px-4 py-8 max-w-6xl pb-24">
        {loading && <Loading />}
        
        {error && (
          <div className="text-center p-16 bg-white rounded-[3rem] text-red-600 border border-red-100 max-w-xl mx-auto animate-fade-in shadow-2xl">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <X className="w-10 h-10" />
            </div>
            <p className="font-serif text-2xl mb-8 leading-relaxed font-bold">{error}</p>
            <button 
              onClick={handleReset}
              className="px-10 py-4 bg-primary text-white rounded-2xl text-lg font-bold shadow-xl hover:bg-primary/90 transition-all active:scale-95"
            >
              처음으로 돌아가기
            </button>
          </div>
        )}

        {data && !loading && (
          <div className="animate-fade-in space-y-20">
            
            {/* Landing Hero Image Section */}
            <div className="bg-white p-4 rounded-[3.5rem] shadow-2xl border border-gray-100/50 transform -rotate-1 hover:rotate-0 transition-all duration-1000 overflow-hidden">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center p-12">
                 <div className="order-2 lg:order-1 space-y-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="h-[2px] w-12 bg-secondary"></div>
                         <span className="text-secondary font-black tracking-[0.3em] text-[10px] uppercase">Curated by AI</span>
                      </div>
                      <h2 className="text-6xl md:text-8xl font-serif font-bold text-primary leading-tight">
                        <span className="text-secondary decoration-wavy underline decoration-8 underline-offset-[12px]">{data.cityName}</span>
                        <br/>
                        시선의 끝
                      </h2>
                    </div>
                    <p className="text-2xl text-gray-600 leading-relaxed font-serif border-l-[12px] border-secondary/10 pl-8 italic">
                      {data.intro}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                      {['ARCHITECTURE', 'MUSEUMS', 'CAFE CULTURE'].map(tag => (
                        <span key={tag} className="px-5 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 tracking-widest border border-gray-100 uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                 </div>
                 <div className="order-1 lg:order-2 relative">
                    <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-[16px] border-white ring-1 ring-black/5 rotate-2 hover:rotate-0 transition-transform duration-700">
                      <ImagePlaceholder 
                        prompt={data.landingImagePrompt} 
                        alt={`${data.cityName} 사진`} 
                        autoGenerate={true} 
                      />
                    </div>
                    {/* Artistic Accent */}
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/10 rounded-full -z-10 blur-2xl"></div>
                 </div>
               </div>
            </div>

            {/* Sticky Navigation Tabs */}
            <div className="sticky top-20 z-40 bg-paper/90 backdrop-blur-2xl py-8 border-b border-gray-100/50">
              <div className="flex overflow-x-auto pb-2 gap-4 md:justify-center no-scrollbar px-6">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id as any)}
                    className={`
                      flex items-center gap-4 px-8 py-4 rounded-[1.5rem] text-sm font-black transition-all whitespace-nowrap tracking-wide
                      ${activeTab === cat.id 
                        ? 'bg-primary text-white shadow-2xl scale-110 -rotate-2' 
                        : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'}
                    `}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Content Grid */}
            <div className="min-h-[800px] px-4">
              {activeTab === 'attractions' && (
                <CategorySection 
                  title="필수 명소 : 반드시 머물러야 할 곳" 
                  items={data.attractions}
                  cityName={data.cityName}
                  icon={<Compass className="w-8 h-8" />}
                />
              )}
              {activeTab === 'nearby' && (
                <CategorySection 
                  title="근교 여행 : 한 걸음 더 멀리" 
                  items={data.nearby}
                  cityName={data.cityName}
                  icon={<Map className="w-8 h-8" />} 
                />
              )}
              {activeTab === 'hotels' && (
                <CategorySection 
                  title="추천 숙소 : 완벽한 휴식의 공간" 
                  items={data.hotels}
                  cityName={data.cityName}
                  icon={<Bed className="w-8 h-8" />}
                />
              )}
              {activeTab === 'restaurants' && (
                <CategorySection 
                  title="로컬 맛집 : 잊지 못할 한 끼" 
                  items={data.restaurants}
                  cityName={data.cityName}
                  icon={<Coffee className="w-8 h-8" />} 
                />
              )}
              {activeTab === 'shopping' && (
                <CategorySection 
                  title="쇼핑 스팟 : 당신의 취향을 담다" 
                  items={data.shopping}
                  cityName={data.cityName}
                  icon={<ShoppingBag className="w-8 h-8" />} 
                />
              )}
            </div>

            {/* Bottom Floating Action */}
            <div className="flex justify-center pt-20 pb-12">
               <button 
                 onClick={handleReset}
                 className="group flex items-center gap-4 px-12 py-6 bg-primary text-white rounded-[2.5rem] hover:bg-secondary hover:shadow-[0_20px_50px_rgba(230,126,34,0.3)] transition-all shadow-2xl active:scale-95 border border-white/20"
               >
                 <Home className="w-6 h-6 group-hover:animate-bounce" />
                 <span className="font-black text-lg tracking-wider">새로운 모험 시작하기</span>
               </button>
            </div>

          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white py-32 border-t border-gray-50">
        <div className="container mx-auto px-4 text-center">
          <button 
            onClick={handleReset} 
            className="font-serif text-6xl font-bold mb-10 hover:text-secondary transition-colors"
          >
            쉽네 <span className="font-light italic text-secondary">Travel</span>
          </button>
          <div className="w-20 h-[2px] bg-secondary/20 mx-auto mb-10"></div>
          <p className="text-gray-400 text-2xl font-serif italic max-w-xl mx-auto mb-16 leading-relaxed">
            "가장 단순한 것이 가장 아름답다."<br/>
            복잡한 여행 계획은 잊으세요.<br/>
            당신의 발걸음이 머무는 곳이 바로 당신의 세계가 됩니다.
          </p>
          <div className="flex justify-center gap-12 mb-16 text-gray-200">
            <Map className="w-8 h-8 hover:text-primary transition-colors cursor-pointer" />
            <Compass className="w-8 h-8 text-secondary/40 hover:text-secondary transition-colors cursor-pointer" />
            <ShoppingBag className="w-8 h-8 hover:text-primary transition-colors cursor-pointer" />
          </div>
          <div className="text-gray-200 text-[10px] font-black tracking-[0.6em] uppercase">
            Designed by Shipne AI & Google Gemini
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

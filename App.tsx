
import React, { useState, useRef, useEffect } from 'react';
import { Search, Map, Coffee, ShoppingBag, Bed, Compass, Star } from 'lucide-react';
import { fetchCityGuide } from './services/gemini.ts';
import { CityData } from './types.ts';
import { Loading } from './components/Loading.tsx';
import { CategorySection } from './components/CategorySection.tsx';
import { ImagePlaceholder } from './components/ImagePlaceholder.tsx';

const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .glass-nav {
    background: rgba(253, 251, 247, 0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(44, 62, 80, 0.05);
  }
  .text-gradient {
    background: linear-gradient(135deg, #2C3E50 0%, #E67E22 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  
  /* 배경 제거 및 하단 배치 캐릭터 스타일 */
  .character-bottom {
    mask-image: linear-gradient(to top, black 80%, transparent 100%);
    -webkit-mask-image: linear-gradient(to top, black 80%, transparent 100%);
    filter: drop-shadow(0 10px 30px rgba(0,0,0,0.1));
  }
`;

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CityData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'attractions' | 'nearby' | 'hotels' | 'restaurants' | 'shopping'>('attractions');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async (e: React.FormEvent | string) => {
    const searchTerm = typeof e === 'string' ? e : query;
    if (typeof e !== 'string') e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await fetchCityGuide(searchTerm);
      setData(result);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setError("도시 정보를 불러오는데 실패했습니다.");
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
    <div className="min-h-screen font-sans text-primary watercolor-texture pb-12 overflow-x-hidden">
      <style>{styles}</style>
      
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${isScrolled || data ? 'glass-nav py-3' : 'py-8'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <button onClick={handleReset} className="flex items-center gap-2 group">
            <div className={`p-1.5 rounded-xl transition-colors ${isScrolled || data ? 'bg-secondary' : 'bg-primary'} text-white shadow-lg`}>
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-serif font-black text-xl md:text-2xl tracking-tighter">
              쉽네 <span className="text-secondary font-light">Travel</span>
            </span>
          </button>
        </div>
      </nav>

      {!data && (
        <main className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
          {/* 하단 배치 캐릭터 이미지 (배경 제거 일러스트 스타일) */}
          <div className="absolute bottom-[-20px] md:bottom-[-40px] right-[5%] md:right-[15%] w-[300px] sm:w-[400px] md:w-[550px] z-10 animate-float pointer-events-none select-none">
            <img 
              src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=1000" 
              alt="Traveler" 
              className="w-full h-auto object-contain character-bottom opacity-90"
            />
          </div>

          <section className="relative z-20 px-6 text-center space-y-10 animate-fade-in-up">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/40 backdrop-blur-md text-secondary rounded-full text-[10px] font-black tracking-widest uppercase border border-secondary/10 shadow-sm">
                <Star className="w-3 h-3 fill-secondary" />
                <span>AI Travel Curator</span>
              </div>
              
              <h1 className="font-serif font-black text-primary text-5xl sm:text-7xl md:text-9xl leading-[0.9] tracking-tighter">
                여행이 가장<br/>
                <span className="text-gradient font-light italic">쉬워지는 순간</span>
              </h1>
              
              <p className="text-sm md:text-2xl text-gray-400 font-serif leading-relaxed italic max-w-2xl mx-auto opacity-80">
                "도시 이름만 알려주세요. <br className="md:hidden"/> 당신과 캐릭터가 함께할 특별한 지도를 그립니다."
              </p>
            </div>

            <div className="relative w-full max-w-xl mx-auto group">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <div className="absolute left-6 text-gray-300">
                  <Search className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="어느 도시로 떠날까요?"
                  className="w-full pl-16 pr-24 py-5 md:py-7 rounded-full bg-white border-0 focus:ring-4 focus:ring-secondary/10 outline-none shadow-2xl text-lg md:text-2xl font-serif text-primary"
                  disabled={loading}
                />
                <button 
                  type="submit"
                  className="absolute right-3 px-8 py-3 md:py-4 bg-primary text-white rounded-full hover:bg-secondary transition-all font-black shadow-lg disabled:opacity-50 active:scale-95"
                  disabled={loading}
                >
                  <span className="text-lg md:text-xl font-sans tracking-tight lowercase">go</span>
                </button>
              </form>
            </div>
          </section>
        </main>
      )}

      {data && (
        <main ref={resultsRef} className="container mx-auto px-6 py-32 max-w-6xl">
          <div className="animate-fade-in-up space-y-16">
            <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl border border-gray-50 overflow-hidden relative">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                 <div className="space-y-8 order-2 lg:order-1">
                    <div className="inline-block px-4 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-black tracking-widest uppercase">Travel Guide</div>
                    <h2 className="text-5xl md:text-8xl font-serif font-black text-primary tracking-tighter leading-none">{data.cityName}</h2>
                    <p className="text-lg md:text-2xl text-gray-500 leading-relaxed font-serif border-l-8 border-secondary/10 pl-8 italic">{data.intro}</p>
                 </div>
                 <div className="order-1 lg:order-2">
                    <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white">
                      <ImagePlaceholder prompt={data.landingImagePrompt} alt={data.cityName} autoGenerate={true} />
                    </div>
                 </div>
               </div>
            </div>

            <div className="sticky top-20 z-[50] py-4">
              <div className="bg-white/70 backdrop-blur-2xl p-1.5 rounded-2xl shadow-xl border border-white/50 flex overflow-x-auto gap-1.5 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id as any)}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-black transition-all whitespace-nowrap ${activeTab === cat.id ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-24">
              {activeTab === 'attractions' && <CategorySection title="꼭 가봐야 할 명소" items={data.attractions} cityName={data.cityName} icon={<Compass className="w-6 h-6" />} />}
              {activeTab === 'nearby' && <CategorySection title="함께 가면 좋은 근교" items={data.nearby} cityName={data.cityName} icon={<Map className="w-6 h-6" />} />}
              {activeTab === 'hotels' && <CategorySection title="추천 감성 숙소" items={data.hotels} cityName={data.cityName} icon={<Bed className="w-6 h-6" />} />}
              {activeTab === 'restaurants' && <CategorySection title="검증된 로컬 맛집" items={data.restaurants} cityName={data.cityName} icon={<Coffee className="w-6 h-6" />} />}
              {activeTab === 'shopping' && <CategorySection title="쇼핑 & 기념품 스팟" items={data.shopping} cityName={data.cityName} icon={<ShoppingBag className="w-6 h-6" />} />}
            </div>
          </div>
        </main>
      )}

      {loading && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-xl flex items-center justify-center">
          <Loading message="AI가 당신의 여행을 큐레이팅 중입니다..." />
        </div>
      )}
    </div>
  );
}

export default App;

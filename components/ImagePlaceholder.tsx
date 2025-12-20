import React, { useState } from 'react';
import { Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import { generateImage } from '../services/gemini';

interface Props {
  prompt: string;
  alt: string;
  autoGenerate?: boolean;
}

export const ImagePlaceholder: React.FC<Props> = ({ prompt, alt, autoGenerate = false }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(autoGenerate);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    let mounted = true;
    if (autoGenerate && !imageUrl) {
      handleGenerate();
    }
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGenerate, prompt]);

  const handleGenerate = async () => {
    if (imageUrl) return;
    setLoading(true);
    setError(false);
    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (imageUrl) {
    return (
      <div className="relative w-full aspect-video overflow-hidden rounded-lg shadow-inner bg-gray-100 group">
        <img 
          src={imageUrl} 
          alt={alt} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105" 
          onLoad={() => setLoading(false)}
        />
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-paper border-2 border-dashed border-primary/10 rounded-lg flex flex-col items-center justify-center p-4 text-center transition-all">
      {loading ? (
        <div className="flex flex-col items-center gap-3 text-secondary/60">
          <div className="relative">
            <Loader2 className="w-8 h-8 animate-spin" />
            <div className="absolute inset-0 animate-pulse bg-secondary/10 rounded-full blur-xl"></div>
          </div>
          <span className="text-[10px] font-serif uppercase tracking-[0.2em] animate-pulse">현장 사진 불러오는 중</span>
        </div>
      ) : error ? (
        <button 
          onClick={handleGenerate}
          className="flex flex-col items-center gap-2 text-red-400 hover:text-red-500 transition-colors"
        >
          <RefreshCw className="w-8 h-8" />
          <span className="text-xs">다시 시도</span>
        </button>
      ) : (
        <button 
          onClick={handleGenerate}
          className="group flex flex-col items-center gap-3 text-primary/30 hover:text-secondary transition-colors"
        >
          <div className="p-3 rounded-full bg-primary/5 group-hover:bg-secondary/10 transition-colors">
            <ImageIcon className="w-6 h-6" />
          </div>
          <span className="text-xs font-serif uppercase tracking-widest">사진 보기</span>
        </button>
      )}
    </div>
  );
};

import React from 'react';
import { TravelItem } from '../types.ts';
import { ImagePlaceholder } from './ImagePlaceholder.tsx';
import { MapPin } from 'lucide-react';

interface Props {
  title: string;
  items: TravelItem[];
  cityName: string;
  icon?: React.ReactNode;
}

export const CategorySection: React.FC<Props> = ({ title, items, cityName, icon }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-10 animate-fade-in">
      <div className="flex items-center gap-2 mb-6 border-b border-primary/5 pb-2">
        {icon && <div className="text-secondary">{icon}</div>}
        <h2 className="text-xl md:text-2xl font-serif font-bold text-primary">{title}</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-50 flex flex-col">
            <div className="p-1">
              <ImagePlaceholder prompt={item.imagePrompt} alt={item.name} autoGenerate={true} />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-base font-bold text-primary font-serif mb-2 leading-snug">{item.name}</h3>
              <p className="text-xs text-gray-500 font-sans leading-relaxed mb-4 flex-1">{item.description}</p>
              <div className="pt-3 border-t border-gray-50">
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + cityName)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-secondary hover:underline font-bold text-[10px]"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Google Maps 보기</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

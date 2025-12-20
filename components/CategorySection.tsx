import React from 'react';
import { TravelItem } from '../types';
import { ImagePlaceholder } from './ImagePlaceholder';
import { MapPin, Star } from 'lucide-react';

interface Props {
  title: string;
  items: TravelItem[];
  cityName: string;
  icon?: React.ReactNode;
}

export const CategorySection: React.FC<Props> = ({ title, items, cityName, icon }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-12 animate-fade-in">
      <div className="flex items-center gap-3 mb-6 border-b-2 border-primary/10 pb-3">
        {icon && <div className="text-secondary">{icon}</div>}
        <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
        <span className="text-sm text-gray-400 font-sans ml-auto">{items.length}곳</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((item, index) => {
          // 구글 지도 검색 URL 생성 (API 키 불필요)
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + cityName)}`;
          
          return (
            <div 
              key={index} 
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col"
            >
              <div className="p-1">
                <ImagePlaceholder 
                  prompt={item.imagePrompt} 
                  alt={item.name} 
                  autoGenerate={true} 
                />
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-primary font-serif leading-tight group-hover:text-secondary transition-colors">
                    {item.name}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-600 font-sans leading-relaxed mb-4 flex-1">
                  {item.description}
                </p>
                
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <a 
                    href={googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-secondary transition-colors group/link"
                  >
                    <MapPin className="w-3 h-3 group-hover/link:animate-bounce" />
                    <span className="font-medium">지도 보기</span>
                  </a>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>4.0+</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
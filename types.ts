export interface TravelItem {
  name: string;
  description: string;
  imagePrompt: string;
}

export interface CityData {
  cityName: string;
  landingImagePrompt: string;
  intro: string;
  attractions: TravelItem[];
  nearby: TravelItem[];
  hotels: TravelItem[];
  restaurants: TravelItem[];
  shopping: TravelItem[];
}

export interface GeneratedImage {
  url: string;
  isLoading: boolean;
}
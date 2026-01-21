
import { GoogleGenAI, Type } from "@google/genai";
import { CityData } from "../types.ts";

const cityDataSchema = {
  type: Type.OBJECT,
  properties: {
    cityName: { type: Type.STRING },
    landingImagePrompt: { type: Type.STRING },
    intro: { type: Type.STRING },
    attractions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          imagePrompt: { type: Type.STRING }
        },
        required: ["name", "description", "imagePrompt"]
      }
    },
    nearby: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, imagePrompt: { type: Type.STRING } }, required: ["name", "description", "imagePrompt"] } },
    hotels: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, imagePrompt: { type: Type.STRING } }, required: ["name", "description", "imagePrompt"] } },
    restaurants: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, imagePrompt: { type: Type.STRING } }, required: ["name", "description", "imagePrompt"] } },
    shopping: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, imagePrompt: { type: Type.STRING } }, required: ["name", "description", "imagePrompt"] } }
  },
  required: ["cityName", "landingImagePrompt", "intro", "attractions", "nearby", "hotels", "restaurants", "shopping"]
};

export const fetchCityGuide = async (city: string): Promise<CityData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `[역할]: 여행 큐레이터. [도시]: ${city}. 위 양식에 맞춰 실사 이미지 프롬프트(영어)와 한글 정보를 포함한 JSON을 생성해줘.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: 'application/json', responseSchema: cityDataSchema }
  });

  return JSON.parse(response.text) as CityData;
};

export const generateImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Image error");
};

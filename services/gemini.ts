
import { GoogleGenAI, Type } from "@google/genai";
import { CityData } from "../types";

// Always use named parameter for apiKey and use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the schema for structured JSON output
const cityDataSchema = {
  type: Type.OBJECT,
  properties: {
    cityName: { type: Type.STRING },
    landingImagePrompt: { 
      type: Type.STRING, 
      description: "A description for a high-quality, photorealistic travel photograph capturing the city's essence (in English)." 
    },
    intro: { 
      type: Type.STRING, 
      description: "A 3-sentence summary of history and charm in Korean." 
    },
    attractions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          imagePrompt: { type: Type.STRING, description: "Prompt to generate a photorealistic image of this specific place (in English)." }
        },
        required: ["name", "description", "imagePrompt"]
      }
    },
    nearby: {
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
    hotels: {
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
    restaurants: {
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
    shopping: {
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
    }
  },
  required: ["cityName", "landingImagePrompt", "intro", "attractions", "nearby", "hotels", "restaurants", "shopping"]
};

export const fetchCityGuide = async (city: string): Promise<CityData> => {
  const prompt = `
    [역할]: 당신은 여행 전문 큐레이터이자 "쉽네 travel" 앱의 콘텐츠 제작자입니다.
    [요청]: 사용자가 입력한 도시(${city})에 대한 정보를 다음 형식에 맞춰 JSON으로 생성해 주세요.

    1. 랜딩 화면 이미지 묘사 (landingImagePrompt):
       - 해당 도시의 랜드마크나 분위기를 담은 고화질의 '실사 사진(photorealistic travel photography)' 스타일 이미지를 묘사하는 문장을 *영어*로 작성해줘 (이미지 생성 모델용).

    2. 도시 소개 및 역사 (intro):
       - 해당 지역의 핵심 역사와 매력을 3문장 내외로 요약해줘 (*한국어*).

    3. 리스트 작성 (반드시 구글 평점과 합리적 가격을 고려, *한국어*):
       - 유명 관광지 10곳 (attractions): 설명 포함
       - 주변 인근 도시/지역 명소 5곳 (nearby)
       - 구글 평점 4.0 이상, 가성비 좋은 호텔 10곳 (hotels)
       - 현지인이 인정하는 맛집 10곳 (restaurants)
       - 주요 쇼핑 스팟 (shopping): 시장, 백화점, 대형마트 각 1개 이상 포함

    4. 이미지 삽입 지침 (imagePrompt):
       - 각 추천 장소의 실제 모습을 생생하게 담은 고화질 사진 생성 프롬프트를 *영어*로 작성해줘 (예: photorealistic, 4k, detailed).
  `;

  try {
    // Select gemini-3-flash-preview for basic text tasks/structured output as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: cityDataSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");
    return JSON.parse(text) as CityData;
  } catch (error) {
    console.error("Error fetching city guide:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    // Use gemini-2.5-flash-image for general image generation tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1",
        }
      }
    });

    // Extracting image part from response parts as per SDK usage
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data generated");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateDescription = async (files: File[]): Promise<string> => {
  if (files.length === 0) throw new Error("No files provided");

  const imageParts = await Promise.all(files.map(fileToGenerativePart));
  
  const prompt = "Создай продающее описание для этой квартиры. Не слишком длинное. На выходе ты должен отдать ТОЛЬКО описание квартиры. Без форматирования: жирного шрифта, заголовка и прочего, только просто описание. Перечисления использовать можно";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        ...imageParts,
        { text: prompt }
      ]
    }
  });

  return response.text || "Не удалось сгенерировать описание.";
};

export const generateRoomStaging = async (file: File): Promise<string | null> => {
  const imagePart = await fileToGenerativePart(file);
  // Using gemini-2.5-flash-image for image editing/generation
  const prompt = "Furnish this room with basic furniture. Do not change walls, windows, or camera angle. Keep the original structure exactly as is, just add furniture.";

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        imagePart,
        { text: prompt }
      ]
    }
  });

  // Extract image from response
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const generate3DFloorPlan = async (file: File): Promise<string | null> => {
  const imagePart = await fileToGenerativePart(file);
  const prompt = "Convert this residential floor plan into an isometric, photo-realistic 3D rendering of the house.";

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        imagePart,
        { text: prompt }
      ]
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

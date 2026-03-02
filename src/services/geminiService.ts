import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Course, Quiz } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generateCourseStructure = async (topic: string): Promise<Course> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a detailed educational course curriculum for: ${topic}. Structure it as a JSON object.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
          lessons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                content: { type: Type.STRING, description: 'A short overview of what will be learned.' },
                duration: { type: Type.STRING, description: 'Estimated time, e.g., 15 mins' }
              },
              required: ['id', 'title', 'content', 'duration']
            }
          }
        },
        required: ['id', 'title', 'description', 'category', 'difficulty', 'lessons']
      }
    }
  });

  return JSON.parse(response.text || '{}') as Course;
};

export const generateLessonContent = async (courseTitle: string, lessonTitle: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a comprehensive, engaging, and easy-to-understand educational lesson about "${lessonTitle}" as part of a "${courseTitle}" course. Use Markdown formatting. Include key takeaways and a practical example.`,
  });
  return response.text || "Failed to generate content.";
};

export const generateVisualAid = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A high-quality educational illustration for a textbook about: ${prompt}. Cinematic, clean, instructional style.` }]
    },
    config: {
      imageConfig: { aspectRatio: "16:9" }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return '';
};

export const generateQuiz = async (lessonTitle: string, lessonContent: string): Promise<Quiz> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a 3-5 question multiple-choice quiz based on this lesson content: "${lessonTitle}". Content: ${lessonContent.substring(0, 2000)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  minItems: 4,
                  maxItems: 4
                },
                correctAnswerIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              },
              required: ['question', 'options', 'correctAnswerIndex', 'explanation']
            }
          }
        },
        required: ['questions']
      }
    }
  });

  const data = JSON.parse(response.text || '{"questions": []}');
  return { lessonId: '', ...data };
};

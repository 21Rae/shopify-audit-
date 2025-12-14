import { GoogleGenAI } from "@google/genai";
import { AuditResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeStore = async (url: string): Promise<AuditResult> => {
  try {
    const prompt = `
      You are an expert E-commerce Conversion Rate Optimization (CRO) auditor specializing in Shopify stores.
      
      Perform a simulated audit for the online store at this URL: ${url}
      
      Since you cannot browse the live site in real-time like a browser, use the 'googleSearch' tool to find the most recent information, cache details, customer reviews, social media presence, and any public analyses of this store to infer its current state, design quality, and user experience. If specific details are missing, infer them based on standard e-commerce best practices for a store in this niche.

      Analyze the following 5 key areas:
      1. First Impressions & Design (Hero section, branding, visual hierarchy)
      2. User Experience & Navigation (Menu structure, search, mobile friendliness)
      3. Product Presentation (Images, descriptions, pricing clarity, reviews)
      4. Marketing & Social Proof (Popups, urgency, trust badges, social media links)
      5. Checkout & Trust (Payment options, policies, security indicators)

      You MUST return the result as a strictly valid JSON object. Do not include markdown formatting (like \`\`\`json). Just the raw JSON string.
      
      The JSON structure must be:
      {
        "overallScore": number (0-100),
        "summary": "A concise executive summary of the store's performance (max 50 words).",
        "sections": [
          {
            "title": "Section Name (e.g., Design & Branding)",
            "score": number (0-100),
            "status": "good" | "warning" | "critical",
            "details": ["Specific observation 1", "Specific observation 2"]
          }
        ],
        "recommendations": ["Actionable tip 1", "Actionable tip 2", "Actionable tip 3"]
      }

      Be critical but constructive. If the store looks generic or has broken elements (based on search results), give it a lower score.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseSchema is not used here because it conflicts with googleSearch tool in some contexts, 
        // and we want the model to be flexible with its search synthesis before formatting.
      },
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    // Clean up markdown code fences if present
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const result: Omit<AuditResult, 'url'> = JSON.parse(cleanJson);
    
    return {
      ...result,
      url
    };

  } catch (error) {
    console.error("Audit failed:", error);
    throw new Error("Failed to analyze the store. Please check the URL and try again.");
  }
};

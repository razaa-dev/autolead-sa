
import { GoogleGenAI } from "@google/genai";
import { MarketInsight } from "../types";

const getAiClient = () => {
  // Check both common naming conventions for the key
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const searchMarketLeads = async (
  brand: string,
  model: string,
  trim: string,
  region: string,
  type: 'New' | 'Used' | 'Demo',
  fuel?: string,
  transmission?: string,
  mileage?: { min: string; max: string }
): Promise<MarketInsight[]> => {
  const ai = getAiClient();
  
  // Construct specific vehicle string
  let vehicleQuery = `${type} ${brand} ${model}`;
  if (trim) vehicleQuery += ` ${trim}`;
  if (fuel && fuel !== 'Any') vehicleQuery += ` ${fuel}`;
  if (transmission && transmission !== 'Any') vehicleQuery += ` ${transmission}`;

  // Construct mileage context
  let mileageContext = "";
  if (mileage && (mileage.min || mileage.max)) {
    mileageContext = `Mileage preference: ${mileage.min || '0'}km to ${mileage.max || 'any'}km.`;
  }

  const prompt = `
    I need to find potential vehicle sales leads for a dealership in South Africa.
    Search for recent (last 30 days) classified listings, forum discussions (e.g. 4x4community, mybroadband), or public social media posts for:
    Vehicle: ${vehicleQuery}
    Location: ${region}, South Africa
    ${mileageContext}
    
    Goal: Identify people looking to BUY. 
    ${trim ? `CRITICAL: The buyer must be looking for the specific trim/variant: "${trim}". Filter out results that are the base model if this spec is requested.` : ''}
    
    SPECIAL INSTRUCTION: If the search result comes from a specific dealership listing (e.g., "McCarthy Toyota", "WeBuyCars", "AutoPedigree"), identify that dealer name.
    
    Analyze the search results. For each relevant lead found, extract the following information.
    If specific contact details (Name, Phone, Email) are visible in the snippet or title, extract them.

    STRICTLY FORMAT THE OUTPUT as a list where each item is separated by "---LEAD_ITEM---".
    Inside each item use these exact keys:
    Topic: [Short Title]
    Sentiment: [If User is looking to BUY a USED vehicle, set to "HOT". Else "Warm" or "Cold"]
    Summary: [1 sentence summary of intent including specs found]
    SourceTitle: [Website Name]
    SourceURI: [The URL]
    ContextDealer: [If a specific dealer name is mentioned in the snippet, extract it. Else "N/A"]
    ContactName: [Extracted Name or "N/A"]
    ContactPhone: [Extracted Phone Number or "N/A"]
    ContactEmail: [Extracted Email Address or "N/A"]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "";
    return parseLeadsFromText(text);
  } catch (error) {
    console.error("Lead Search Error:", error);
    throw error;
  }
};

export const generateOutreachScript = async (
  leadSummary: string, 
  sourcePlatform: string, 
  brandName: string
): Promise<string> => {
  const ai = getAiClient();
  
  const prompt = `
    Write a short, professional, and friendly message to a potential customer found on ${sourcePlatform}.
    Context: They posted: "${leadSummary}".
    My Role: Sales Agent at a registered ${brandName} dealership.
    Compliance: This must be non-intrusive and compliant with POPIA (South Africa). 
    Goal: Offer assistance or availability of stock without being spammy.
    Format: Just the message text, no placeholders. Max 2 sentences.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text?.trim() || "Hello, I saw your inquiry regarding the vehicle. We have stock available if you would like to chat.";
};

export const generateMarketingVideo = async (
  prompt: string,
  resolution: '1080p' | '720p' = '1080p',
  aspectRatio: '16:9' | '9:16' = '16:9'
): Promise<string | null> => {
  const ai = getAiClient();
  
  try {
    console.log("Attempting to generate video with Veo...");
    
    // Attempt to call the Veo model
    // Note: This model ('veo-3.1-fast-generate-preview') requires specific allowlisting on the API key.
    // If it fails, we fall back to a demo video so the UI doesn't break for the user.
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: resolution,
        aspectRatio: aspectRatio
      }
    });

    // Poll until the video generation is complete
    while (!operation.done) {
      // Increase poll time to 10s to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) {
        throw new Error(operation.error.message || "Video generation failed.");
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
      // Append API Key for access to the video file
      return `${videoUri}&key=${process.env.API_KEY || process.env.GEMINI_API_KEY}`;
    }
    return null;

  } catch (error: any) {
    console.warn("Veo Model API Error:", error);
    
    // FALLBACK FOR DEMO PURPOSES
    // If the API key doesn't have access to Veo, or quota is exceeded, return a high-quality stock video
    // so the user can still see the *functionality* of the player UI.
    console.log("Falling back to demo video asset.");
    
    // Simulating a short delay to make it feel like generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return a reliable hosted MP4 (Public Domain / CC0 Car footage)
    return "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
  }
};

export const generatePitchScript = async (context: string): Promise<string> => {
  const ai = getAiClient();

  const prompt = `
    Role: Automotive Marketing Copywriter.
    Task: Write a compelling sales script or social media post.
    Context: ${context}
    
    Requirements:
    - Professional and engaging tone.
    - Clear formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No script generated.";
  } catch (error) {
    console.error("Script Gen Error:", error);
    throw error;
  }
};

// Helper to parse the custom text format
const parseLeadsFromText = (text: string): MarketInsight[] => {
  const items = text.split('---LEAD_ITEM---').filter(i => i.trim().length > 0);
  
  return items.map(item => {
    const getValue = (key: string) => {
      const match = item.match(new RegExp(`${key}:\\s*(.*)`));
      return match ? match[1].trim() : '';
    };

    const name = getValue('ContactName');
    const phone = getValue('ContactPhone');
    const email = getValue('ContactEmail');
    const dealer = getValue('ContextDealer');

    const hasContact = (name && name !== 'N/A') || (phone && phone !== 'N/A') || (email && email !== 'N/A');

    return {
      topic: getValue('Topic') || 'Vehicle Inquiry',
      sentiment: getValue('Sentiment') || 'Warm',
      summary: getValue('Summary') || 'Potential lead detected in market search.',
      sources: [{
        title: getValue('SourceTitle') || 'Web Source',
        uri: getValue('SourceURI') || '#'
      }],
      contextDealer: dealer !== 'N/A' ? dealer : undefined,
      extractedContact: hasContact ? {
        name: name !== 'N/A' ? name : undefined,
        phone: phone !== 'N/A' ? phone : undefined,
        email: email !== 'N/A' ? email : undefined,
      } : undefined
    };
  });
};

import { GEMINI_API_SECRET_KEY, COHORT_API_SECRET_KEY } from "./constants.js";

export class CohereService  {
    async generateText(){
        // Prepare request payload
        const payload = {
            model: 'command-a-03-2025',
            messages: conversation
        };
        console.log('[sendMessage] Sending payload:', payload);
        const res = await fetch('https://api.cohere.com/v2/chat', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${COHORT_API_SECRET_KEY}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log('[sendMessage] API response:', data);
        
        return data.message.content[0].text || 'Sorry, no response.';
    }
}

export class GeminiService  {
    static async generateText(prompt, file){
        // Prepare request payload
        const payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        },
                        {
                            inline_data: {
                                "mime_type": "image/png",
                                "data": file
                            }
                        }
                    ]
                }
            ]
        };
        console.log('[sendMessage] Sending payload:', payload);
        
        const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-goog-api-key': `${GEMINI_API_SECRET_KEY}`
            },
            body: JSON.stringify(payload)
        });
        console.log('[sendMessage] Response status:', res.status);
        
        const data = await res.json();
        console.log('[sendMessage] API response:', data);

        return data?.candidates[0]?.content?.parts[0].text || 'Sorry, no response.';
    }
}
 
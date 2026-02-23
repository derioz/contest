// src/lib/fivemanage.ts
/**
 * Uploads an image to the FiveManage API and returns the hosted URL.
 * Requires VITE_FIVEMANAGE_API_KEY environment variable.
 */

export async function uploadImageToFiveManage(file: File): Promise<string> {
    const apiKey = import.meta.env.VITE_FIVEMANAGE_API_KEY;
    if (!apiKey) {
        throw new Error('FiveManage API key is not configured.');
    }

    const formData = new FormData();
    // FiveManage expects the file in the "image" field
    formData.append('image', file);
    // Optional: add a neat filename or metadata if the API supports it, but standard is just standard image upload

    // NOTE: Depending on FiveManage docs, it could be 'file' or 'image' field, normally 'image' for their image upload endpoint.
    // Their standard endpoint: https://api.fivemanage.com/api/image

    try {
        const response = await fetch('https://api.fivemanage.com/api/image', {
            method: 'POST',
            headers: {
                'Authorization': apiKey,
                // Do NOT set Content-Type header here. 
                // fetch will automatically set it to multipart/form-data with the correct boundary when body is FormData.
            },
            body: formData,
        });

        if (!response.ok) {
            let errorMessage = 'Failed to upload image';
            const text = await response.text();
            try {
                const errorData = JSON.parse(text);
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // Not JSON, use HTML/Text snippet
                // If it's a huge HTML page, truncate it
                errorMessage = text.substring(0, 50) + '...' || errorMessage;
            }
            throw new Error(errorMessage);
        }

        const text = await response.text();
        try {
            const data = JSON.parse(text);
            return data.url || data.imageUrl; // Support either url or imageUrl
        } catch (e) {
            console.error('FiveManage API returned non-JSON:', text);
            throw new Error('Invalid response from image server.');
        }
    } catch (error) {
        console.error('FiveManage Upload Error:', error);
        throw error;
    }
}

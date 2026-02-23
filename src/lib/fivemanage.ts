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
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // Not JSON
                errorMessage = await response.text() || errorMessage;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data.url; // Assuming FiveManage returns { url: 'https://...' }
    } catch (error) {
        console.error('FiveManage Upload Error:', error);
        throw error;
    }
}

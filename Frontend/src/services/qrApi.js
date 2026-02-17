
const QR_API_URL = "https://api.qrserver.com/v1/read-qr-code/";

/**
 * Uploads an image file to the QR Decoder API and returns the decoded data.
 * @param {File} file - The image file containing the QR code.
 * @returns {Promise<Object>} - The decoded JSON data.
 */
export const decodeQRCode = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(QR_API_URL, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`QR API Error: ${response.status}`);
        }

        const data = await response.json();

        // The API returns an array: [{ type: "qrcode", symbol: [{ data: "...", error: null }] }]
        const symbol = data[0]?.symbol[0];

        if (symbol?.error) {
            throw new Error(symbol.error);
        }

        if (!symbol?.data) {
            throw new Error("No QR code found in the image.");
        }

        return symbol.data;
    } catch (error) {
        console.error("QR Decoding Failed:", error);
        throw error;
    }
};

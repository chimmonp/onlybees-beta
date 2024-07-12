export const generateReceiptId = () => {
    const date = new Date();
    const timestamp = date.getTime(); // Get current timestamp
    const uniqueId = Math.random().toString(36).substring(2, 10); // Generate a short unique ID

    // Combine timestamp and unique ID, ensuring it fits within 40 characters
    const receiptId = `receipt_${timestamp}_${uniqueId}`.substring(0, 40);

    return receiptId;
};
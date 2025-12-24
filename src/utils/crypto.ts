import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_DES_SECRET_KEY || 'kripto';

// Enforce secret key in production
if (!import.meta.env.VITE_DES_SECRET_KEY && import.meta.env.PROD) {
    throw new Error('VITE_DES_SECRET_KEY must be set in production environment');
}

/**
 * Encrypts a message using DES algorithm.
 * @param data The data string to encrypt.
 * @returns The encrypted string.
 */

/**
 * Encrypts a message using DES algorithm.
 * @param data The data string to encrypt.
 * @returns The encrypted string.
 */
export const encryptDES = (data: string): string => {
    if (!data) return '';
    try {
        return CryptoJS.DES.encrypt(data, SECRET_KEY).toString();
    } catch (e) {
        console.error("Encryption Error:", e);
        return '';
    }
};

/**
 * Decrypts a DES encrypted string.
 * @param cipherText The encrypted string to decrypt.
 * @param secretKey Optional secret key to use for decryption. Defaults to environment variable.
 * @returns The decrypted string (original data), or empty string if decryption fails.
 */
export const decryptDES = (cipherText: string, secretKey?: string): string => {
    if (!cipherText) return '';

    // Use provided key OR fallback to default system key ONLY if no key was provided.
    // If user explicitly provides a key (even a wrong one), we MUST use it and fail if it's wrong.
    const keyToUse = secretKey || SECRET_KEY;

    try {
        const bytes = CryptoJS.DES.decrypt(cipherText, keyToUse);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        // Basic validation: if decryption yields empty string, it failed
        if (!originalText) return '';

        return originalText;
    } catch (error) {
        // console.error("Decryption failed:", error);
        return '';
    }
};

import { ethers } from 'ethers';

/**
 * Generate a hash using SHA-256.
 * @param data - The data to be hashed.
 * @returns A promise that resolves to the hash string.
 */
export const generateHash = async (data: string): Promise<string> => {
  const hash = ethers.utils.sha256(ethers.utils.toUtf8Bytes(data));
  return hash;
};

/**
 * Sign a message using the user's wallet.
 * @param message - The message to be signed.
 * @param signer - The ethers.js signer object.
 * @returns A promise that resolves to the signature string.
 */
export const signMessage = async (message: string, signer: ethers.Signer): Promise<string> => {
  const signature = await signer.signMessage(message);
  return signature;
};

/**
 * Verify a message signature.
 * @param message - The original message.
 * @param signature - The signature to be verified.
 * @param address - The signer's address.
 * @returns A boolean indicating if the signature is valid.
 */
export const verifySignature = (message: string, signature: string, address: string): boolean => {
  const signerAddress = ethers.utils.verifyMessage(message, signature);
  return signerAddress === address;
};

import { ethers } from "ethers";

/**
 * Format an Ethereum address to a shorter version.
 * @param address - The Ethereum address to format.
 * @returns A formatted address string.
 */
export const formatAddress = (address: string): string => {
    if (!ethers.utils.isAddress(address)) {
      throw new Error('Invalid Ethereum address');
    }
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  /**
   * Format a number as a currency string.
   * @param amount - The amount to format.
   * @param decimals - The number of decimal places (default is 2).
   * @returns A formatted currency string.
   */
  export const formatCurrency = (amount: number, decimals: number = 2): string => {
    return amount.toFixed(decimals).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };
  
  /**
   * Format a timestamp to a human-readable date string.
   * @param timestamp - The timestamp to format.
   * @returns A formatted date string.
   */
  export const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
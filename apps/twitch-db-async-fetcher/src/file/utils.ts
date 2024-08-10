import fs from 'fs';
import path from 'path';

export const ensureDirectoryExists = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  };
  
export const getCurrentDateParts = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return { year, month, day };
  };

export function getTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}/${now.toISOString().replace(/[-:.]/g, '')}.json`;
}


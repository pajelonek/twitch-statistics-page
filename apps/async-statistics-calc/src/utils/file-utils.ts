import * as fs from 'fs';

export async function readJsonFile<T>(filePath: string): Promise<T> {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data) as T;
}


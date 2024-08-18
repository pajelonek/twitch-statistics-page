import * as fs from 'fs';
import * as path from 'path';

async function main() {
    console.log("Calculating statistics...");
    const directoryPath = path.join(__dirname, './test_data');
    readAllFilesInDirectory(directoryPath);
    console.log("Task completed!");
}

async function readAllFilesInDirectory(directoryPath: string): Promise<void> {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directoryPath, file);

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error("Error getting file stats:", err);
                    return;
                }

                if (stats.isFile()) {
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error("Error reading file:", err);
                            return;
                        }
                        console.log(`File: ${file}`);
                        console.log(data);
                        console.log('-----------------------------------');
                    });
                } else if (stats.isDirectory()) {
                    readAllFilesInDirectory(filePath);
                }
            });
        });
    });
}
main();
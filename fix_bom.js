const fs = require('fs');
const path = require('path');

function removeBomFromDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            removeBomFromDir(filePath);
        } else if (filePath.endsWith('.java')) {
            const buffer = fs.readFileSync(filePath);
            if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
                console.log(`Removing BOM from: ${filePath}`);
                const newBuffer = buffer.slice(3);
                fs.writeFileSync(filePath, newBuffer);
            }
        }
    });
}

const targetDir = String.raw`c:\Users\Oguzhan\Desktop\Repositories\ApplyFollow\backend\src`;
console.log(`Scanning ${targetDir}...`);
removeBomFromDir(targetDir);
console.log('Done.');

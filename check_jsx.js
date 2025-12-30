
const fs = require('fs');

const content = fs.readFileSync('src/App.jsx', 'utf8');
const lines = content.split('\n');

let currentComponent = null;
let attributes = new Set();

lines.forEach((line, index) => {
    // Very simplified regex for component start
    const componentStartMatch = line.match(/<([A-Z][a-zA-Z0-9]*)/);
    if (componentStartMatch) {
        currentComponent = componentStartMatch[1];
        attributes = new Set();
    }

    if (currentComponent) {
        // Find attributes like name={value} or name="value" or name
        const attrMatches = line.matchAll(/\s+([a-zA-Z0-9]+)=/g);
        for (const match of attrMatches) {
            const attrName = match[1];
            if (attributes.has(attrName)) {
                console.log(`Duplicate attribute ${attrName} in component ${currentComponent} at line ${index + 1}`);
            }
            attributes.add(attrName);
        }

        if (line.includes('/>') || line.includes('</' + currentComponent)) {
            currentComponent = null;
        }
    }
});

const { parse } = require("path");

function parseLineItems(str) {
    const items = str.split("$");

    // Parse items
    let parsed = items.map(item => {
        const match = item.match(/^(.*)\s+q(\d+)$/i);

        if (!match) {
            return { desc: "", qnt: "" };
        }

        return {
            desc: match[1].trim(),
            qnt: match[2]
        };
    });

    // Ensure at least 7 items
    while (parsed.length < 7) {
        parsed.push({ desc: "", qnt: "" });
    }

    return parsed;
}


console.log(parseLineItems("Charging card q48$net cart q9"));
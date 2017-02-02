#!/usr/bin/env node

"use strict";

const fs = require("fs");
const readline = require("readline");

(() => {
    const input = process.argv[2];
    const output = process.argv[3];

    if (!input || !output) {
        console.log("Usage: geojson-report <input> <output>");
        return;
    }

    const outStream = fs.createWriteStream(output);
    const lineReader = readline.createInterface({
        input: fs.createReadStream(input),
    });

    lineReader.on("line", (line) => {
        const feature = JSON.parse(line);
        outStream.write(`${feature.properties["@type"]} ${feature.properties["@id"]}\n`);
        outStream.write(`${feature.properties["@validation"]}\n`);
    });
})();

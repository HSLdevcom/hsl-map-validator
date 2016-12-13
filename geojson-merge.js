#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const merge = require("geojson-merge");

function match(value) {
    return new Promise((resolve, reject) => {
        glob(value, (error, files) => {
            if(error) {
                reject(error);
            } else {
                resolve(files);
            }
        });
    });
}

/**
 * Merges one or more files with geojson object on each line into one file / feature collection
 * @param {string[]} inputs
 * @param {string} output
 */
function mergeFiles(inputs, output) {
    const geojsons = inputs
        .map(input => fs.readFileSync(path.join(__dirname, input), "utf8"))
        .map(content => content.split("\n"))
        .reduce((prev, cur) => [...prev, ...cur])
        .filter(line => !!(line.trim()))
        .map(line => JSON.parse(line));

    const featureCollection = merge(geojsons);
    fs.writeFileSync(path.join(__dirname, output), JSON.stringify(featureCollection));
}

(() => {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log("Usage: geojson-merge <inputs> <output>");
        return;
    }

    const inputArgs = args.slice(0, args.length - 1);
    const output = args[args.length - 1];

    Promise.all(inputArgs.map(arg => match(arg))).then(inputArrays => {
        const inputs = inputArrays.reduce((prev, cur) => [...prev, ...cur]);
        mergeFiles(inputs, output);
    });
})();

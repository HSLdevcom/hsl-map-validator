"use strict";

const pixelMatcher = require("./matching/pixelmatch");
const defaultOptions = require("./config.js")

const area = {
    ...defaultOptions.area,
    ...process.env.ZOOM && { zoom: Number(process.env.ZOOM) },
    ...process.env.SIZE && { size: Number(process.env.SIZE) },
    ...process.env.AREA_XYZ && { xyz: JSON.parse(process.env.AREA_XYZ), bbox: null },
    ...process.env.AREA_BBOX &&  { bbox: JSON.parse(process.env.AREA_BBOX), xyz: null },
}
const threshold = {
    ...defaultOptions.threshold,
    ...process.env.PIXELS_CRITICAL && { pixelsCritical: Number(process.env.PIXELS_CRITICAL) },
    ...process.env.COLOR_THRESHOLD && { colorThreshold: Number(process.env.COLOR_THRESHOLD) }
}

const options = {
    ...defaultOptions,
    ...process.env.TILE_URL1 && { url1: process.env.TILE_URL1},
    ...process.env.TILE_URL2 && { url2: process.env.TILE_URL2},
    area,
    threshold,
};

pixelMatcher(options);

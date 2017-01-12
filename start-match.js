"use strict";

const pixelMatcher = require("./matching/pixelmatch");

const options = {
	url1: process.env.TILE_URL1 || "https://api.digitransit.fi/map/v1/hsl-map",
    url2: process.env.TILE_URL2 || "https://dev-api.digitransit.fi/map/v1/hsl-map",
    area: {
    	zoom: Number(process.env.ZOOM) || 14,
	    size:  Number(process.env.SIZE) || 256,
    },
    threshold: {
    	pixelsCritical: Number(process.env.PIXELS_CRITICAL) || 1000,
    	colorThreshold: Number(process.env.COLOR_THRESHOLD) || 0.1,
    },
};

if (process.env.AREA_XYZ) options.area.xyz = JSON.parse(process.env.AREA_XYZ);
else options.area.bbox = process.env.AREA_BBOX ? JSON.parse(process.env.AREA_BBOX) : [24.2578125,59.86136748351594,25.551452636718746,60.5153990545698];

pixelMatcher(options);

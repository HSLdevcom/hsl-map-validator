"use strict";

const urlMap = "https://api.digitransit.fi/map/v1/hsl-map";
const urlMapDev = "https://dev-api.digitransit.fi/map/v1/hsl-map";
const urlRouting = "http://api.digitransit.fi/routing/v1/routers/hsl/inspector/tile/traversal";
const urlRoutingDev = "http://dev-api.digitransit.fi/routing/v1/routers/hsl/inspector/tile/traversal";
const hslAreaBbox = [24.2578125, 59.86136748351594, 25.551452636718746, 60.5153990545698];
const routingAreaXyz = { minX: 74615, minY: 37936, maxX: 74618, maxY: 37940 };
const pixelMatcher = require("./matching/pixelmatch");

const options = {
	url1: urlRouting,
    url2: urlRoutingDev,
    area: {
    	zoom: 17,
	    xyz: routingAreaXyz,
	    size: 256,
    },
    threshold: {
    	pixelsCritical: 1000,
    	colorThreshold: 0.1,
    },
};

pixelMatcher(options);

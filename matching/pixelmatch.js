"use strict"

const fs = require("fs");
const PNG = require("pngjs").PNG;
const SphericalMercator = require("sphericalmercator");
const pixelmatch = require("pixelmatch");
const request = require("request");
const ncp = require('ncp').ncp;
let tileCounter = 0;

function getTiles(xyz, options) {
	const tilesTotal = (xyz.maxX - (xyz.minX - 1)) * (xyz.maxY - (xyz.minY -1));
	tileCounter = 0;
	console.log(`${tilesTotal} tiles to compare`)

	for (let x = xyz.minX; x <= xyz.maxX; x++) {
		for (let y = xyz.minY; y <= xyz.maxY; y++ ) {
			compareTiles(
				`${options.url1}/${options.area.zoom}/${x}/${y}.png`, 
				`${options.url2}/${options.area.zoom}/${x}/${y}.png`,
				options.zoom, x, y, options.threshold, tilesTotal
			)
		}
	}
}

function compareTiles(tile1, tile2, zoom, x, y, threshold, tilesTotal) {
	let filesRead = 0;
	let png1 = request.get(tile1).pipe(new PNG());
	let png2 = request.get(tile2).pipe(new PNG());
	let img1 = png1.on("parsed", doneReading);
	let img2 = png2.on("parsed", doneReading);
	png1.on("error", (error) => console.log(error, `Could not perform match for tile ${tile1}, continuing matching`))
	png2.on("error", (error) => console.log(error, `Could not perform match for tile ${tile2}, continuing matching`))

	function doneReading() {
		if (++filesRead < 2) return;
		    const diff = new PNG({ width: img1.width, height: img1.height });
		    const unmatchedPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: threshold.colorThreshold});
		    diff.pack().pipe(fs.createWriteStream(`export/matching/diff/diff-${zoom}-${x}-${y}.png`).on("close", () => {
                filesRead = 0;
                tileCounter ++;
                console.log(`Performed tile match: ${tileCounter} of ${tilesTotal}`);
			}));
	    if (unmatchedPixels > threshold.pixelsCritical) {
	    	ncp(`export/matching/diff/diff-${zoom}-${x}-${y}.png`, `export/matching/critical/diff-${zoom}-${x}-${y}.png`, function (err) {
				if (err) return console.error(err);
			});
	    }
	}
}

module.exports = function(options) {
    let xyz;
	if (options.area.xyz) {
		xyz = {
			minX: options.area.xyz[0],
			minY: options.area.xyz[1],
			maxX: options.area.xyz[2],
			maxY: options.area.xyz[3],
		};
	} else {
		const merc = new SphericalMercator({
		    size: options.area.size,
		});
		xyz = merc.xyz(options.area.bbox, options.area.zoom);
	}	
	getTiles(xyz, options);
};

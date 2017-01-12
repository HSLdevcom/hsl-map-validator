"use strict"

const fs = require("fs");
const PNG = require("pngjs").PNG;
const SphericalMercator = require("sphericalmercator");
const pixelmatch = require("pixelmatch");
const request = require("request");
const ncp = require('ncp').ncp;
let tileCounter = 0;
let tilesTotal = 0;

/**
 * Gets all tiles within the defined range and runs tile comparison for each pair of tiles
 * @param  {Object} xyz     Defines range of tiles to include (xyz format)
 * @param  {Object} options Options used for comparison
 * @return {Promise}        Promise containing the function for comparing all tiles within the collection
 */
function getTiles(xyz, options) {
	return new Promise((resolve) => {
		let promises = [];
		for (let x = xyz.minX; x <= xyz.maxX; x++) {
			for (let y = xyz.minY; y <= xyz.maxY; y++ ) {
				var promise = compareTiles(
					`${options.url1}/${options.area.zoom}/${x}/${y}.png`, 
					`${options.url2}/${options.area.zoom}/${x}/${y}.png`,
					options.zoom, x, y, options.threshold, tilesTotal
				);
				promises.push(promise);
			}
		}
		Promise.all(promises).then(() => resolve());
	});
}

/**
 * Runs pixelmatch comparison bewtween two tiles of the same area
 * @param  {String} tile1      Url from which the first tile is fetched
 * @param  {String} tile2      Url from which the second tile is fetched
 * @param  {Number} zoom       Zoom level for tile comparison
 * @param  {Number} x          The horizontal order number of the tile
 * @param  {Numner} y          The vertical order number of the tile
 * @param  {Number} threshold  Threshold values used in the comparison
 * @return {Promise}           Promise containing the comparison function
 */
function compareTiles(tile1, tile2, zoom, x, y, threshold) {
	return new Promise((resolve) => {
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
                resolve();
			}));
		    if (unmatchedPixels > threshold.pixelsCritical) {
		    	ncp(`export/matching/diff/diff-${zoom}-${x}-${y}.png`, `export/matching/critical/diff-${zoom}-${x}-${y}.png`, function (err) {
					if (err) return console.error(err);
				});
		    }
		}
	});
}

/**
 * Splits collection of tiles into smaller collections
 * @param  {Number} interval  Number of horizontal and vertical tiles in smaller collection
 * @param  {Object} xyz       Defines range of tiles to include (xyz format)
 * @return {Array}            Array of smaller tile collections defined in xyz format
 */
function splitArea(interval, xyz) {
	let xyzSets = [];
	for (let x = xyz.minX; x <= xyz.maxX; x = x + interval) {
		for (let y = xyz.minY; y <= xyz.maxY; y = y + interval) {
			let xyzSet = {
				minX: x,
				minY: y,
				maxX: Math.min(xyz.maxX, (x + interval - 1)),
				maxY: Math.min(xyz.maxY, (y + interval - 1)),
			};
			xyzSets.push(xyzSet);
		}
	}
	return xyzSets;
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
	tileCounter = 0;
	tilesTotal = (xyz.maxX - (xyz.minX - 1)) * (xyz.maxY - (xyz.minY -1));
	const xyzSets = splitArea(10, xyz);
	console.log(`${tilesTotal} tiles to compare`)
	
	xyzSets.reduce((prev, cur) => {
		return prev.then(() => getTiles(cur, options))
	}, new Promise((resolve) => resolve()));
};

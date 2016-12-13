"use strict";

const path = require("path");
const tileReduce = require("tile-reduce");
const extend = require("lodash/extend");

let totalCount = 0;

module.exports = function(opts, callback) {
    const options = extend(opts, { map: path.join(__dirname, "/map.js") });
    tileReduce(options)
        .on("reduce", (count) => {
            totalCount += count;
        })
        .on("end", () => {
            if (callback) callback(totalCount);
        });
};

HSL Map Validator
====================

## Install

Install dependencies

```
npm install
```

Fetch OSM QA Tiles
```
npm run import
```

## Run

Run validator

```
node start
```

Merge results into one GeoJSON
```
node geojson-merge export/*.geojson export/all.geojson
```

## Scripts

Run pixelmatch

```
node start-match

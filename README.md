HSL Map Validator
====================

# Validators

## Run in Docker container

More info on installing Docker: https://docs.docker.com/engine/installation/

### Build

```
docker build -t hsl-map-validator .
```

### Run

```
docker run -d -p 127.0.0.1:3000:8080 hsl-map-validator
```


## Run without Docker

### Install

Install dependencies

```
npm install
```

Fetch OSM QA Tiles
```
npm run import
```

### Run

Run validator

```
node start
```

Merge results into one GeoJSON
```
node geojson-merge export/*.geojson export/all.geojson
```



# Matching

## Run in Docker container

### Build

```
docker build -t hsl-map-validator-match -f matching.dockerfile .
```

The default ENV variables can be overwritten at build time, by passing build arguments. This allows e.g. different tilesets to be compared, or a different zoom level to be used.

Example:
```
docker build -t hsl-map-validator-match -f matching.dockerfile \
--build-arg TILE_URL1=http://api.digitransit.fi/routing/v1/routers/hsl/inspector/tile/traversal \
--build-arg TILE_URL2=http://dev-api.digitransit.fi/routing/v1/routers/hsl/inspector/tile/traversal \
--build-arg ZOOM=17 \
--build-arg AREA_XYZ=[74615,37936,74618,37940] .
```

### Run

```
docker run -d -p 127.0.0.1:3000:8080 hsl-map-validator-match
```


## Run without Docker

### Install

Install dependencies

```
npm install
```

### Run

Run matching

```
node start-match
```
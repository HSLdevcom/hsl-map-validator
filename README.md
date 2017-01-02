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
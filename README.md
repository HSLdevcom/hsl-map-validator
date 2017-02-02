HSL Map Validator
====================

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

Generate OSM QA tiles (see `Dockerfile`)

### Run

Run validator

```
node start
```

Merge results into one GeoJSON
```
node geojson-merge export/*.geojson export/all.geojson
```

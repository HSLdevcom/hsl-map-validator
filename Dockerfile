FROM node:6

ENV PORT=8080
ENV WORK /opt/mapvalidator

RUN echo "deb http://http.debian.net/debian testing main" >> /etc/apt/sources.list

RUN \
  apt-get update && \
  apt-get install -yq build-essential libsqlite3-dev zlib1g-dev && \
  apt-get install -yq -t testing libstdc++6

# Create app directory
RUN mkdir -p ${WORK}
WORKDIR ${WORK}

RUN mkdir mason && \
  curl -sSfL https://github.com/mapbox/mason/archive/v0.5.0.tar.gz | \
  tar --gunzip --extract --strip-components=1 --directory=./mason && \
  ./mason/mason install minjur latest && \
  ./mason/mason link minjur latest

RUN mkdir tippecanoe && \
  curl -sSfL https://github.com/mapbox/tippecanoe/archive/1.16.3.tar.gz | \
  tar --gunzip --extract --strip-components=1 --directory=./tippecanoe && \
  cd tippecanoe && make && make install

# Install app dependencies
COPY package.json ${WORK}
RUN npm install

# Copy app source
COPY . ${WORK}

# Fetch OSM & Generate QA tiles
RUN \
  curl -sSfL https://dev.hsl.fi/osm.hsl/hsl.osm.pbf > import/osm.pbf && \
  curl -sSfL https://dev.hsl.fi/osm.hsl/hsl_20161216T110302Z.osm.pbf > import/osm.base.pbf && \
  ./mason_packages/.link/bin/minjur import/osm.pbf | tippecanoe -l osm -Z 14 -o import/osm.mbtiles && \
  ./mason_packages/.link/bin/minjur import/osm.base.pbf | tippecanoe -l osm -Z 14 -o import/osm.base.mbtiles

# Run validators
RUN node start && \
  node geojson-merge export/features.geojson export/featureCollection.geojson

EXPOSE ${PORT}

# Start server that serves validation results
ENTRYPOINT cd ${WORK}/export && \
  exec python -m SimpleHTTPServer ${PORT}


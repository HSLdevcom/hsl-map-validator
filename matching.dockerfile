FROM node:6

# Arguments can be set on build, otherwise defaults are used
ARG TILE_URL1=https://api.digitransit.fi/map/v1/hsl-map
ARG TILE_URL2=https://dev-api.digitransit.fi/map/v1/hsl-map
ARG AREA_BBOX=[24.2578125,59.86136748351594,25.551452636718746,60.5153990545698]
ARG AREA_XYZ
ARG ZOOM=14
ARG SIZE=512
ARG PIXELS_CRITICAL
ARG COLOR_THRESHOLD

ENV TILE_URL1 ${TILE_URL1}
ENV TILE_URL2 ${TILE_URL2}
ENV AREA_BBOX ${AREA_BBOX}
ENV AREA_XYZ ${AREA_XYZ}
ENV ZOOM ${ZOOM}
ENV SIZE ${SIZE}
ENV PIXELS_CRITICAL ${PIXELS_CRITICAL}
ENV COLOR_THRESHOLD ${COLOR_THRESHOLD}

ENV PORT=8080
ENV WORK /opt/mapvalidator

# Create app directory
RUN mkdir -p ${WORK}
WORKDIR ${WORK}

# Install app dependencies
COPY package.json ${WORK}
RUN npm install

# Copy app source
COPY . ${WORK}

EXPOSE ${PORT}

# Perform matching
RUN node start-match

# Start server that serves validation results
ENTRYPOINT cd ${WORK}/export/matching && \
  exec python -m SimpleHTTPServer ${PORT}


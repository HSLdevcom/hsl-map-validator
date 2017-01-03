FROM node:6

ENV PORT=8080
ENV WORK /opt/mapvalidator
ENV TILE_URL1 https://api.digitransit.fi/map/v1/hsl-map
ENV TILE_URL2 https://dev-api.digitransit.fi/map/v1/hsl-map
ENV AREA_BBOX [24.2578125,59.86136748351594,25.551452636718746,60.5153990545698]
# ENV AREA_XYZ
ENV ZOOM 14
ENV SIZE 512
# ENV PIXELS_CRITICAL
# ENV COLOR_THRESHOLD

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


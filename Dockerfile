FROM node:6

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

# Import finland mbtiles
RUN npm run import

EXPOSE ${PORT}

# Run validators
RUN node start && \
  node geojson-merge export/*.geojson export/all.geojson

# Start server that serves validation results
ENTRYPOINT cd ${WORK}/export && \
  exec python -m SimpleHTTPServer ${PORT}


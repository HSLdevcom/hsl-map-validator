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

EXPOSE ${PORT}

# Perform matching
RUN node start-match

# Start server that serves validation results
ENTRYPOINT cd ${WORK}/export/matching && \
  exec python -m SimpleHTTPServer ${PORT}


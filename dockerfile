FROM node:latest

# Create the directory
RUN mkdir -p /usr/src/sippybot
WORKDIR /usr/src/sippybot

# Copy and Install
COPY package.json /usr/src/sippybot
RUN npm install
COPY . /usr/src/sippybot

# Start
CMD ["node", "index.js"]
FROM node:latest

# Create the directory
RUN mkdir -p /usr/src/serverplusold
WORKDIR /usr/src/serverplusold

# Copy and Install
COPY package.json /usr/src/serverplusold
RUN npm install
COPY . /usr/src/serverplusold

# Start
CMD ["node", "index.js"]

FROM node:16-alpine

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

# Copy package.json and install dependencies
COPY package.json ./
RUN ls -a
RUN npm install

# Copy application files
COPY . .

# Copy the wait script
COPY await-db.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/await-db.sh

# Expose auth port
EXPOSE ${PORT}

# Command to run your application with wait script
CMD ["sh", "-c", "await-db.sh npm start"]
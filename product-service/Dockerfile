FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3003

# Copy wait-for-it.sh or your wait script
# COPY wait-for-it.sh /wait-for-it.sh
# RUN chmod +x /wait-for-it.sh

# Replace the default CMD with the wait-for-it logic
# ENTRYPOINT ["/wait-for-it.sh", "mysql:3306", "--"]

CMD ["npm","run","dev"]
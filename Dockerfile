FROM node:20.12.0-alpine3.19

WORKDIR /usr/src/app

COPY package.json package-lock.json turbo.json ./

COPY ./apps/user-app apps/user-app

COPY ./apps/bank-webhook apps/bank-webhook 

COPY packages ./packages

# Install dependencies
RUN npm install

# Can you add a script to the global package.json that does this?
RUN npm run prisma-generate

# Can you filter the build down to just one app?
RUN npm run build

CMD ["npm", "run", "start-user-app"]
This is my Dockerfile, update and modify by following informations:

rm -rf node_modules package-lock.json
npm install
npm run build


FROM node:20-slim

WORKDIR /usr/src/app

COPY . .
COPY package.json ./

EXPOSE 3000

CMD ["node", "build/index.js"]

informations application: node.js express. typescript 

{
  "name": "typescript-expressjs-web-app",
  "version": "1.0.0",
  "type": "module",
  "main": "build/index.js",
  "types": "build/index.js",
  "scripts": {
    "build": "rimraf ./build && tsc",
    "start:dev": "NODE_ENV=development nodemon --exec node --loader ts-node/esm src/index.ts",
    "start:stage": "nodemon --exec node --loader ts-node/esm src/index.ts",
    "start": "npm run build",
    "start:prod": "node build/index.js",
    "lint": "eslint . --ext .ts",
    "test": "jest"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^4.17.25",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.19.39",
    "@typescript-eslint/eslint-plugin": "^7.0.2",
    "@typescript-eslint/parser": "^7.0.2",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-jest": "^27.9.0",
    "eslint-plugin-prettier": "^5.1.3",
    "jest": "^29.7.0",
    "nodemon": "^3.1.0",
    "prettier": "^3.2.5",
    "rimraf": "^5.0.5",
    "run-script-os": "^1.1.6",
    "ts-jest": "^29.1.2",
    "ts-node": "^10.9.2",
    "tslib": "^2.6.2",
    "typescript": "^5.3.3"
  },
  "dependencies": {
    "axios": "^1.15.2",
    "cors": "^2.8.5",
    "dotenv": "^16.6.1",
    "express": "^4.18.2",
    "jose": "^6.2.2",
    "mongodb": "^6.12.0"
  }
}

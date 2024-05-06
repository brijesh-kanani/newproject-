FROM node:18 As build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps
# RUN npm install -g npm@latest
# RUN npm install
# RUN npm install

COPY . .

#RUN npm run build-prod
RUN npm run build

FROM nginx:stable-alpine
#FROM nginx:1.15.8-alpine

COPY --from=build /usr/src/app/dist/fuse /usr/share/nginx/html

# Move the default conf out of the way
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf_orig 
# Copy in your project's new nginx conf
#RUN cp default.conf /etc/nginx/conf.d/default.conf 
COPY default.conf /etc/nginx/conf.d/


RUN apk update
RUN apk upgrade
# Install curl
RUN apk add curl

EXPOSE 4200
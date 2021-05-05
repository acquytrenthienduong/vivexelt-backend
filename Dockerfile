FROM node:12

WORKDIR /vivexelt

ARG GIT_TOKEN=4951b2323723da7f051cd9618a1d273406c2634b

RUN echo $GIT_TOKEN

RUN git clone -b main https://${GITHUB_TOKEN}:x-oauth-basic@github.com/acquytrenthienduong/vivexelt-backend /vivexelt

RUN pwd

RUN ls -l --all

RUN cp /vivexelt/.env_prod /vivexelt/.env

RUN npm install

EXPOSE 3000

CMD [ "node", "app.js" 

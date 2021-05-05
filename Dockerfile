FROM node:12
WORKDIR /node-quanganh

ARG GIT_TOKEN=4951b2323723da7f051cd9618a1d273406c2634b

RUN echo $GIT_TOKEN

RUN git clone -b master https://${GITHUB_TOKEN}:x-oauth-basic@github.com/acquytrenthienduong/vivexelt-backend.git /node-quanganh

RUN cp /node-quanganh/.env_prod /node-quanganh/.env

RUN npm install

EXPOSE 8000

CMD [ "node", "app.js" ]
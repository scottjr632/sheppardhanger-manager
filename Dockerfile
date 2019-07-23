FROM node:alpine as frontend

RUN mkdir -p /shmanager/client
RUN mkdir -p /shmanager/app/dist

WORKDIR /shmanager

COPY ./client /shmanager/client

RUN npm --prefix client install
RUN npm --prefix client run build


FROM python:3.6.8-slim-stretch

RUN mkdir /shmanager

COPY ./requirements.txt /shmanager/requirements.txt

WORKDIR /shmanager

RUN pip3 install -r requirements.txt

COPY . /shmanager

COPY --from=frontend /shmanager/app/dist /shmanager/app/dist

ENTRYPOINT ["/shmanager/docker-entrypoint.sh"]

CMD ["startserver"]

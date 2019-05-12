FROM python:3.6.8-slim-stretch

RUN mkdir /shmanager
RUN mkdir /shmanager/client

RUN apt-get update
RUN apt-get install --assume-yes curl

COPY ./requirements.txt /shmanager/requirements.txt
COPY ./client/package.json /shmanager/client/package.json
COPY ./client/package-lock.json /shmanager/client/package-lock.json

WORKDIR /shmanager

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install --assume-yes build-essential nodejs 
RUN node --version
RUN npm --version

RUN pip3 install -r requirements.txt
RUN npm --prefix client install

COPY . /shmanager

# RUN npm --prefix client run build

ENTRYPOINT ["/shmanager/docker-entrypoint.sh"]

CMD [""]

FROM python:3.6.8-stretch

COPY . .

RUN pip3 install -r requirements.txt
RUN npm install ./client

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD [""]

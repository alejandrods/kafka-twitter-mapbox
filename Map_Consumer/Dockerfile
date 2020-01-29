# Dockerfile
FROM python:3.6

WORKDIR /usr/app

EXPOSE 9000

ADD ./requirements.txt ./
RUN pip install -r requirements.txt
RUN python -m textblob.download_corpora
ADD ./ ./

CMD ["python", "-u", "app.py"]

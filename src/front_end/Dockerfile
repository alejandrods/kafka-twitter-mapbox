# Dockerfile
FROM python:3.6

WORKDIR /usr/app

EXPOSE 8080

ADD ./requirements.txt ./
RUN pip install -r requirements.txt
ADD ./ ./

CMD ["python", "-u", "app.py"]

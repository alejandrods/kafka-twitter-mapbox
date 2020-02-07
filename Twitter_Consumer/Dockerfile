# Dockerfile
FROM python:3.6

WORKDIR /usr/app

EXPOSE 8080

ADD ./requirements.txt ./
RUN pip install -r requirements.txt
ADD ./ ./

CMD ["python", "-u", "app.py"]
#CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app

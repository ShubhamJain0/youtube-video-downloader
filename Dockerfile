#base-image
FROM python:3.10-alpine

# logs real-time output to terminal 
ENV PYTHONUNBUFFERED 1

#upgrade-pip
RUN python -m pip install --upgrade pip

RUN mkdir /code
WORKDIR /code

COPY ./requirements.txt /code/
#dependencies
RUN apk add --update --no-cache --virtual .tmp-build-deps \
		gcc libc-dev linux-headers postgresql-dev musl-dev zlib zlib-dev libffi-dev
RUN pip install -r requirements.txt

COPY . /code/

#user permissions
RUN adduser -D user
RUN chown -R user:user /code
RUN chmod -R 755 /code
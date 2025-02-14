FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY . /app/

EXPOSE 8107

CMD ["uvicorn", "friend:app", "--host", "0.0.0.0", "--port", "8107"]

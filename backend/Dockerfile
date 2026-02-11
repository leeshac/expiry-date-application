#a dockerfile is a script that contains a series of instructions on how to build a docker image

#use official Python image as base
FROM python:3.9-slim as base

#install system dependencies
#may need to adjust based on specific requirements
RUN apt-get update && \
    apt-get install -y build-essential gcc g++ libgl1 libglib2.0-0 tesseract-ocr && \
    rm -rf /var/lib/apt/lists/*

#set working directory inside container
WORKDIR /app

#copy requirements and install
COPY requirements.txt .

#run pip to install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

#copy backend code
COPY . .

#expose port FastAPI runs on TODO change if needed
EXPOSE 8000

#command to run FastAPI
CMD ["uvicorn", "expiry_api:app", "--host", "0.0.0.0", "--port", "8000"] 
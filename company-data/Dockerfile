FROM python:3.10-slim

WORKDIR /app

# Ensure we have build essentials if pandas/xgboost require compilation
RUN apt-get update && apt-get install -y gcc g++ libgomp1 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run with gunicorn instead of Flask dev server
ENV PORT=5001
EXPOSE 5001

CMD ["gunicorn", "--bind", "0.0.0.0:5001", "server:app", "--timeout", "120"]

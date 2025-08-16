#!/bin/bash

# Start script for Talk2Tables React Chatbot
# This script starts the React development server

echo "🚀 Starting Talk2Tables React Chatbot..."
echo "📍 Make sure the FastAPI server is running on localhost:8001"
echo ""

cd react-chatbot

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🌐 Starting React development server..."
echo "📖 The chatbot will open at: http://localhost:3000"
echo "🔗 It will connect to FastAPI at: http://localhost:8001"
echo ""
echo "⚡ To stop the server, press Ctrl+C"
echo ""

npm run dev
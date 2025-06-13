#!/bin/bash

# 🚀 Music Producer Suite - Quick Deploy Script

echo "🎵 Music Producer Suite - Deployment Script"
echo "=========================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building production version..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Go to vercel.com/dashboard"
echo "2. Find your project → Settings → Environment Variables"
echo "3. Add: VITE_GEMINI_API_KEY = your_google_gemini_api_key"
echo "4. Redeploy with: vercel --prod"
echo ""
echo "🎵 Your Music Producer Suite is now live!"
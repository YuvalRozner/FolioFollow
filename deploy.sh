#!/bin/bash
# FolioFollow — Deploy to Firebase Hosting
# Run this from the project root: ./deploy.sh

set -e

echo "🔨 Building frontend..."
cd frontend
npm run build
cd ..

echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "✅ Done! Your app is live at:"
echo "   https://foliofollow.web.app"
echo "   https://foliofollow.firebaseapp.com"

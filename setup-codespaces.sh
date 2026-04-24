#!/bin/bash

# Setup script for GitHub Codespaces CORS configuration

echo "🔍 Detecting Codespaces environment..."

# Get Codespaces name
CODESPACE_NAME="${CODESPACE_NAME:-unknown}"
CODESPACES_ENVIRONMENT="${CODESPACES_ENVIRONMENT:-unknown}"

if [ "$CODESPACE_NAME" = "unknown" ]; then
    echo "⚠️  Could not auto-detect Codespace name."
    echo ""
    echo "📋 Manual Setup:"
    echo "1. Go to VS Code Ports tab (bottom panel)"
    echo "2. Find port 8000 → Copy 'Forwarded Address'"
    echo "3. Find port 5173 → Copy 'Forwarded Address'"
    echo ""
    echo "Then update manually:"
    echo "  frontend/.env.local:  VITE_API_URL=<your-backend-url>"
    echo "  backend/app.py:       allow_origins list"
    exit 1
fi

# Construct URLs
BACKEND_URL="https://${CODESPACE_NAME}-8000.app.github.dev"
FRONTEND_URL="https://${CODESPACE_NAME}-5173.app.github.dev"

echo "✅ Detected Codespace: $CODESPACE_NAME"
echo ""
echo "🔗 Generated URLs:"
echo "   Backend:  $BACKEND_URL"
echo "   Frontend: $FRONTEND_URL"
echo ""

# Update .env.local
ENV_FILE="frontend/.env.local"
if [ -f "$ENV_FILE" ]; then
    sed -i "s|VITE_API_URL=.*|VITE_API_URL=$BACKEND_URL|" "$ENV_FILE"
    echo "✅ Updated $ENV_FILE"
    cat "$ENV_FILE"
else
    echo "⚠️  $ENV_FILE not found"
fi

echo ""
echo "📝 Next steps:"
echo "1. Update backend/app.py allow_origins list:"
echo "   Add: \"$FRONTEND_URL\""
echo ""
echo "2. Make port 8000 Public:"
echo "   Ports tab → right-click port 8000 → Port Visibility → Public"
echo ""
echo "3. Restart backend and frontend services"

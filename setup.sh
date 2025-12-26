#!/bin/bash

# Refill Setup Script
# This script helps you set up your development environment

set -e

echo "🚀 Refill Setup Script"
echo "======================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${BLUE}Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js is not installed. Please install Node.js 18+ from https://nodejs.org${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION} found${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}npm is not installed. Please install npm${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm ${NPM_VERSION} found${NC}"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cat > .env << EOL
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000

# Environment
EXPO_PUBLIC_ENV=development

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EOL
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo ""
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "📱 Next steps:"
echo "  1. Start the development server:"
echo "     ${BLUE}npm start${NC}"
echo ""
echo "  2. Run on specific platform:"
echo "     ${BLUE}npm run ios${NC}     - iOS Simulator (macOS only)"
echo "     ${BLUE}npm run android${NC}  - Android Emulator"
echo "     ${BLUE}npm run web${NC}     - Web browser"
echo ""
echo "  3. Scan QR code with Expo Go app (iOS/Android)"
echo ""
echo "📚 Documentation:"
echo "  - README.md - Project overview"
echo "  - DEVELOPMENT.md - Development guide"
echo ""
echo "Happy coding! 🎉"





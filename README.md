# 🛒 AI SmartCart

A voice-activated shopping list application powered by AI that allows users to manage their shopping lists through natural speech commands and discover products through intelligent recommendations.

**🌐 Live Demo:** [https://ai-smart-cart.vercel.app/](https://ai-smart-cart.vercel.app/)

## ✨ Features

### 🎤 Voice-Activated Commands
- **Natural Language Processing**: Uses Gemini AI for intelligent command parsing
- **Add Items**: "Add milk", "I need 2 bananas", "Get me some bread"
- **Remove Items**: "Remove apples", "Delete the milk"
- **Search Products**: "Find organic apples", "Search for toothpaste under $5"
- **Fallback Support**: Regex-based parsing when Gemini API is unavailable

### 🔍 Advanced Search & Filtering
- **Item Search**: Find products by name, brand, or description
- **Price Range Filtering**: "Find toothpaste under $5", "Search items less than $10"
- **Brand Filtering**: "Find Nike shoes", "Search for LiveZ products"
- **Category & Tag Filtering**: "Find organic apples", "Search for fresh fruit"
- **Smart Suggestions**: Personalized product recommendations

### 🧠 Intelligent Recommendations
- **Similarity Algorithm**: Finds similar products based on category, tags, brand, and price
- **Context-Aware Suggestions**: Different recommendations for search vs. cart additions
- **Smart Filtering**: Excludes items already in cart
- **Trending Products**: Shows popular items on app load

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic theme switching
- **Real-time Updates**: Live transcript and instant feedback
- **Interactive Cards**: Beautiful product displays with hover effects
- **Voice Command Examples**: Built-in help and guidance

## 🏗️ Technical Architecture

### Frontend Stack
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Web Speech API** - Browser-based speech recognition

### AI Integration
- **Google Gemini API** - Natural language processing
- **Fallback Parser** - Regex-based command parsing
- **Smart Recommendations** - Custom similarity algorithm

### Data Management
- **Local Storage** - Persistent shopping list
- **Mock Data** - 200+ realistic product entries
- **State Management** - React hooks and context

## 📁 Project Structure

```
AI SmartCart/
├── public/
│   └── audio-processor.js          # Audio processing utilities
├── src/
│   ├── assets/
│   │   └── mockProducts.json       # Product database (200+ items)
│   ├── components/
│   │   ├── MicButton.jsx           # Voice input button component
│   │   ├── ProductSuggestions.jsx  # Recommendation display component
│   │   ├── SearchResults.jsx       # Search results display
│   │   ├── ShoppingList.jsx        # Shopping list management
│   │   └── Transcript.jsx          # Live transcript display
│   ├── hooks/
│   │   └── useSpeechRecognition.js # Speech recognition logic
│   ├── services/
│   │   ├── gemini.js               # AI command parsing
│   │   ├── recommendations.js      # Product recommendation engine
│   │   └── search.js               # Search and filtering logic
│   ├── utils/
│   │   ├── categories.js           # Product categorization
│   │   ├── commands.js             # Command parsing utilities
│   │   └── storage.js              # Local storage helpers
│   ├── App.jsx                     # Main application component
│   ├── index.css                   # Global styles
│   └── main.jsx                    # Application entry point
├── vercel.json                     # Vercel deployment config
├── .vercelignore                   # Vercel ignore file
├── package.json                    # Dependencies and scripts
└── README.md                       # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern browser with Web Speech API support

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/ai-smart-cart.git
cd ai-smart-cart
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file
echo "VITE_GEMINI_API_KEY=your_gemini_api_key_here" > .env
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

### Deployment

The application is deployed on Vercel and automatically updates on code changes.

**Deploy to Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variable
vercel env add VITE_GEMINI_API_KEY
```

## 🎯 Usage Guide

### Voice Commands

#### Adding Items
- "Add milk"
- "I need 2 bananas"
- "Get me some bread"
- "Add 3 bottles of water"

#### Removing Items
- "Remove apples"
- "Delete the milk"
- "Take out the bread"

#### Searching Products
- "Find apples"
- "Search for bread"
- "Show me milk"
- "Find organic apples"
- "Search toothpaste under $5"
- "Find Nike shoes"

### Features Overview

1. **Voice Input**: Click the microphone button and speak naturally
2. **Search Products**: Use voice commands to find products with filters
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Manage List**: Use +/- buttons to adjust quantities
5. **Get Suggestions**: View personalized recommendations
6. **Toggle Suggestions**: Show/hide recommendations as needed

## 🔧 Configuration

### Environment Variables
- `VITE_GEMINI_API_KEY`: Your Google Gemini API key for enhanced AI features

### Customization
- **Product Data**: Modify `src/assets/mockProducts.json` to add/update products
- **Categories**: Update `src/utils/categories.js` for new product categories
- **Styling**: Customize `src/index.css` and component styles

## 🧪 Testing

### Manual Testing
1. Test voice commands in different browsers
2. Verify search functionality with various queries
3. Check recommendation accuracy
4. Test responsive design on different screen sizes

### Browser Compatibility
- Chrome 25+
- Firefox 44+
- Safari 14.1+
- Edge 79+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini API** for natural language processing
- **Web Speech API** for browser-based speech recognition
- **Tailwind CSS** for utility-first styling
- **Vite** for fast development and building
- **Vercel** for seamless deployment

## 📞 Support

For support, email arihant.singh0907@gmail.com or create an issue in the repository.

---

**Built with ❤️ using React, AI, and modern web technologies**

[Live Demo](https://ai-smart-cart.vercel.app/) | [GitHub Repository](https://github.com/your-username/ai-smart-cart) | [Documentation](https://github.com/your-username/ai-smart-cart/wiki)

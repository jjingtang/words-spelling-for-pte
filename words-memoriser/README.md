# 🎯 Vocabulary Memorizer

A modern, interactive vocabulary learning application that helps you memorize English-Chinese word pairs through gamified spelling exercises with audio pronunciation.

![Vocabulary Memorizer Demo](https://img.shields.io/badge/Next.js-14.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 📁 **Excel File Upload**: Simply drag & drop your vocabulary Excel files
- 🎮 **Three Game Modes**: Length hint, first letter hint, or no hint challenge
- 🔊 **Audio Pronunciation**: Listen to correct English pronunciation using Google TTS
- 📊 **Progress Tracking**: Detailed statistics on your learning performance
- 🎯 **Error Analysis**: Focus on words you find most challenging
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast & Modern**: Built with Next.js 14 and React 18

## 🚀 Quick Start for Users

### 1. Access the Application
Visit the deployed application at: `https://your-app.vercel.app` (replace with your actual URL)

### 2. Prepare Your Vocabulary File
Create an Excel file (.xlsx or .xls) with this format:

| English | Chinese |
|---------|---------|
| hello   | 你好    |
| world   | 世界    |
| book    | 书      |
| computer| 电脑    |

**Requirements:**
- Column A: English words
- Column B: Chinese translations
- First row can be headers (will be automatically skipped)
- Supports both .xlsx and .xls formats

### 3. Upload and Play
1. **Upload**: Drag your Excel file to the upload area or click to browse
2. **Choose Mode**: Select your preferred difficulty level
3. **Listen**: Click the play button to hear pronunciation
4. **Type**: Enter the English word for the Chinese character shown
5. **Learn**: Track your progress and focus on challenging words

### 4. Game Modes

| Mode | Description | Difficulty |
|------|-------------|------------|
| 🔢 **Length Hint** | Shows number of letters | ⭐ Easy |
| 🅰️ **First Letter** | Shows the first letter | ⭐⭐ Medium |
| 🎯 **No Hint** | No assistance provided | ⭐⭐⭐ Hard |

### 5. Track Your Progress
- View detailed error statistics
- See which words need more practice
- Monitor your improvement over time
- Sort data by error rate, attempts, or other metrics

## 🛠️ Developer Setup

### Prerequisites
- **Node.js** 18.0 or later
- **npm** or **yarn** package manager
- **VS Code** (recommended) with extensions

### VS Code Extensions (Recommended)
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/vocab-memorizer.git
cd vocab-memorizer
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

3. **Run Development Server**
```bash
npm run dev
# or
yarn dev
```

4. **Open in Browser**
```
http://localhost:3000
```

### VS Code Setup

1. **Open Project in VS Code**
```bash
code .
```

2. **Install Recommended Extensions**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type: `Extensions: Show Recommended Extensions`
   - Install all recommended extensions

3. **Configure Settings** (Create `.vscode/settings.json`)
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    "cn\\(([^)]*)\\)"
  ]
}
```

4. **Debug Configuration** (Create `.vscode/launch.json`)
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

## 🏗️ Tech Stack

### Frontend
- **⚛️ React 18** - UI library for building interactive interfaces
- **🔷 TypeScript** - Type-safe JavaScript for better development experience
- **🎨 Tailwind CSS** - Utility-first CSS framework for rapid styling
- **🎭 Lucide React** - Beautiful, customizable SVG icons

### Backend
- **🚀 Next.js 14** - Full-stack React framework with App Router
- **🌐 API Routes** - Serverless functions for backend logic
- **📊 In-Memory Storage** - Simple data persistence (upgradeable to database)

### File Processing
- **📋 SheetJS (xlsx)** - Excel file parsing and processing
- **📄 Papaparse** - CSV parsing capabilities
- **📁 Multer** - File upload handling

### Audio & APIs
- **🔊 Google Translate TTS** - Text-to-speech for pronunciation
- **🌍 Free Dictionary API** - Backup pronunciation source
- **🎵 Web Audio API** - Browser audio playback

### Development Tools
- **📝 ESLint** - Code linting and quality checks
- **🎯 Prettier** - Code formatting
- **🔧 PostCSS** - CSS processing and optimization

### Deployment
- **☁️ Vercel** - Hosting and continuous deployment
- **🌐 CDN** - Global content delivery
- **📈 Analytics** - Performance monitoring

## 📁 Project Structure

```
vocab-memorizer/
├── 📁 src/
│   ├── 📁 app/                   # Next.js App Router
│   │   ├── 📁 api/              # API routes
│   │   │   ├── 📁 upload/       # File upload endpoint
│   │   │   ├── 📁 game-session/ # Game data tracking
│   │   │   └── 📁 error-stats/  # Statistics calculation
│   │   ├── 📄 globals.css       # Global styles
│   │   ├── 📄 layout.tsx        # Root layout
│   │   └── 📄 page.tsx          # Main page
│   ├── 📁 components/           # React components
│   │   ├── 📄 FileUpload.tsx    # File upload interface
│   │   ├── 📄 VocabularyGame.tsx # Game logic & UI
│   │   └── 📄 ErrorStats.tsx    # Statistics dashboard
│   ├── 📁 lib/                  # Utility functions
│   │   └── 📄 utils.ts          # Helper functions
│   └── 📁 types/                # TypeScript definitions
│       └── 📄 index.ts          # Type definitions
├── 📁 public/                   # Static assets
├── 📄 package.json              # Dependencies & scripts
├── 📄 tailwind.config.ts        # Tailwind configuration
├── 📄 tsconfig.json             # TypeScript configuration
└── 📄 README.md                 # This file
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint checks

# Additional Development
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
```

## 🌐 API Endpoints

### Upload Vocabulary
```http
POST /api/upload
Content-Type: multipart/form-data

# Body: Excel file with vocabulary data
# Returns: Parsed vocabulary array
```

### Save Game Session
```http
POST /api/game-session
Content-Type: application/json

{
  "vocabularyId": "string",
  "mode": "length" | "first-letter" | "no-hint",
  "userAnswer": "string",
  "correctAnswer": "string",
  "timeSpent": number
}
```

### Get Error Statistics
```http
POST /api/error-stats
Content-Type: application/json

{
  "vocabulary": Vocabulary[]
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Automatic deployment with every push

3. **Custom Domain** (Optional)
   - Add your custom domain in Vercel dashboard
   - Configure DNS settings

### Alternative Deployment Options

- **Netlify**: Connect GitHub repo for automatic deployment
- **Railway**: Deploy with `railway up`
- **AWS Amplify**: Connect repository for CI/CD
- **Docker**: Use provided Dockerfile for containerization

## 🧪 Testing

### Manual Testing Checklist

- [ ] ✅ Excel file upload works
- [ ] 🎮 All three game modes function correctly
- [ ] 🔊 Audio pronunciation plays
- [ ] 📊 Statistics are calculated accurately
- [ ] 📱 Responsive design on all devices
- [ ] 🌐 Cross-browser compatibility

### Automated Testing (Future Enhancement)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 🔒 Security Considerations

- ✅ **File Upload Validation**: Only Excel files accepted
- ✅ **File Size Limits**: Prevents oversized uploads
- ✅ **Input Sanitization**: User inputs are cleaned
- ✅ **CORS Protection**: Proper cross-origin handling
- ✅ **Rate Limiting**: Prevents API abuse (recommended for production)

## 🎯 Performance Optimizations

- **📦 Code Splitting**: Automatic with Next.js
- **🖼️ Image Optimization**: Next.js Image component
- **⚡ SSR/SSG**: Server-side rendering for faster loads
- **🗜️ Compression**: Gzip compression enabled
- **📱 PWA Ready**: Service worker support (optional)

## 🤝 Contributing

### Getting Started

1. **Fork the Repository**
2. **Create Feature Branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make Changes**
4. **Run Tests & Linting**
```bash
npm run lint
npm run type-check
```

5. **Commit Changes**
```bash
git commit -m "Add amazing feature"
```

6. **Push to Branch**
```bash
git push origin feature/amazing-feature
```

7. **Open Pull Request**

### Development Guidelines

- 📝 Write clear commit messages
- 🧪 Add tests for new features
- 📖 Update documentation
- 🎨 Follow existing code style
- 🔍 Test across different browsers

## 🐛 Troubleshooting

### Common Issues

**Module not found errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Audio not playing**
- Ensure HTTPS connection
- Check browser autoplay policies
- Test with user interaction first

**Excel file not parsing**
- Verify file format (.xlsx or .xls)
- Check column structure (A: English, B: Chinese)
- Ensure file isn't corrupted

**Build errors**
```bash
npm run lint --fix
npm run type-check
```

### Getting Help

- 📧 **Email**: jessiejingjingtang@gmail.com
- 💬 **Issues**: [GitHub Issues](https://github.com/jjingtang/words-spelling-for-pte)
- 📖 **Documentation**: [Wiki](https://github.com/jjingtang/words-spelling-for-pte)

## 🗺️ Roadmap

### Version 2.0 (Planned)
- [ ] 🗄️ **Database Integration** (PostgreSQL/MongoDB)
- [ ] 👤 **User Authentication** (NextAuth.js)
- [ ] 🧠 **Spaced Repetition Algorithm**
- [ ] 🌍 **Multiple Language Support**
- [ ] 📱 **PWA Support** for offline usage

### Version 2.1 (Future)
- [ ] 🎯 **AI-Powered Difficulty Adjustment**
- [ ] 🏆 **Gamification & Achievements**
- [ ] 👥 **Social Features & Leaderboards**
- [ ] 📈 **Advanced Analytics Dashboard**
- [ ] 🎙️ **Speech Recognition** for pronunciation practice

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Translate** for providing free TTS API
- **Vercel** for excellent hosting platform
- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for beautiful icons
- **SheetJS** for Excel processing capabilities

## 📊 Project Statistics

![GitHub stars](https://img.shields.io/github/stars/yourusername/vocab-memorizer)
![GitHub forks](https://img.shields.io/github/forks/yourusername/vocab-memorizer)
![GitHub issues](https://img.shields.io/github/issues/yourusername/vocab-memorizer)
![GitHub license](https://img.shields.io/github/license/yourusername/vocab-memorizer)

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

[⭐ Star this repo](https://github.com/yourusername/vocab-memorizer) | [🐛 Report Bug](https://github.com/yourusername/vocab-memorizer/issues) | [💡 Request Feature](https://github.com/yourusername/vocab-memorizer/issues)

</div>
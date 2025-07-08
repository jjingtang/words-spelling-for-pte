# 🎯 Words Spelling for PTE

A modern, interactive vocabulary learning application specifically designed for PTE (Pearson Test of English) preparation. Master English-Chinese word pairs through gamified spelling exercises with audio pronunciation to improve your PTE spelling accuracy.

![Words Spelling for PTE Demo](https://img.shields.io/badge/Next.js-14.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![PTE](https://img.shields.io/badge/PTE-Preparation-orange)

## ✨ Features

- 📁 **Excel File Upload**: Simply drag & drop your vocabulary Excel files
- 🎮 **Three Game Modes**: 
  - 📏 **Length Hint**: Shows the number of letters in the word
  - 🅰️ **First Letter**: Shows the first letter of the word  
  - 🎯 **No Hint**: Maximum challenge with no assistance
- 🔊 **Audio Pronunciation**: Listen to correct English pronunciation using Google TTS with fallback to browser speech synthesis
- 📊 **Live Progress Tracking**: Real-time statistics during gameplay
- 📈 **Detailed Analytics**: Comprehensive error analysis and learning insights
- 🎯 **Interactive Actions**: Submit answers, show correct spelling, or skip challenging words
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast & Modern**: Built with Next.js 14 and React 18
- 🧩 **Modular Architecture**: Clean, maintainable component structure
- 🎨 **Beautiful UI**: Modern design with smooth animations and transitions

## 🚀 Quick Start for Users

### 1. Access the Application
Visit the deployed application at: `https://words-spelling-for-pte.vercel.app/` (replace with your actual URL)

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

### 4. Game Modes & Features

| Mode | Description | Difficulty | Features |
|------|-------------|------------|----------|
| 📏 **Length Hint** | Shows number of letters | ⭐ Easy | Perfect for beginners |
| 🅰️ **First Letter** | Shows the first letter | ⭐⭐ Medium | Balanced challenge |
| 🎯 **No Hint** | No assistance provided | ⭐⭐⭐ Hard | Expert mode |

**Interactive Actions:**
- 🎵 **Listen**: Click to hear pronunciation
- ✅ **Submit**: Submit your answer
- 👁️ **Show**: Reveal correct spelling in a popup
- ⏭️ **Skip**: Move to next word (counts as skipped)

### 5. Track Your Progress
- **Live Statistics**: Correct, wrong, and skipped counts
- **Accuracy Rate**: Real-time percentage calculation
- **Detailed Analytics**: Comprehensive error analysis
- **Progress Bar**: Visual indication of completion
- **Learning Insights**: Focus on challenging words

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
git clone https://github.com/jjingtang/words-spelling-for-pte.git
cd words-spelling-for-pte
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

## 🏗️ Component Architecture

### **Modular Design Philosophy**
The application follows a modular component architecture for better maintainability, testability, and reusability:

### **📁 Component Organization**

#### **🎮 Game Mode Components** (`src/components/GameModes/`)
- **LengthHintMode.tsx**: Displays word length hints
- **FirstLetterMode.tsx**: Shows first letter hints  
- **NoHintMode.tsx**: No-hint challenge mode
- **Extensible**: Easy to add new game modes

#### **📊 Statistics Components** (`src/components/Stats/`)
- **GameStats.tsx**: Live game statistics with color-coded badges
- **StatBadge.tsx**: Reusable statistic display component
- **ProgressBar.tsx**: Visual progress indicator
- **ResultDisplay.tsx**: Answer result feedback

#### **⌨️ Input Components** (`src/components/GameInput/`)
- **GameInput.tsx**: Smart text input with focus management
- **ActionButtons.tsx**: Submit, Show, Skip action buttons
- **ShowAnswerModal.tsx**: Popup modal for revealing answers

#### **📈 Analytics Components** (`src/components/ErrorStats/`)
- **OverallStats.tsx**: Summary statistics dashboard
- **SortControls.tsx**: Data sorting interface
- **ErrorStatsTable.tsx**: Detailed statistics table
- **LoadingSpinner.tsx**: Loading state component

#### **🔊 Standalone Components**
- **AudioPlayer.tsx**: Multi-fallback audio pronunciation
- **FileUpload.tsx**: Drag & drop file upload interface

### **🔄 Component Communication**
- **Props-based**: Clean data flow between components
- **Event Callbacks**: Actions bubble up to parent components
- **Shared State**: Managed in main game orchestrator
- **API Integration**: Centralized in main components

## 🏗️ Tech Stack

### Frontend
- **⚛️ React 18** - UI library with latest features and performance improvements
- **🔷 TypeScript** - Type-safe JavaScript for better development experience
- **🎨 Tailwind CSS** - Utility-first CSS framework for rapid, consistent styling
- **🎭 Lucide React** - Beautiful, customizable SVG icons

### Backend
- **🚀 Next.js 14** - Full-stack React framework with App Router
- **🌐 API Routes** - Serverless functions for backend logic
- **📊 In-Memory Storage** - Simple data persistence (upgradeable to database)

### File Processing
- **📋 SheetJS (xlsx)** - Excel file parsing and processing
- **📄 Papaparse** - CSV parsing capabilities
- **📁 File Upload** - Drag & drop file handling

### Audio & APIs
- **🔊 Google Translate TTS** - Primary text-to-speech service
- **🎵 Web Speech API** - Browser fallback for pronunciation
- **🌍 Multiple Fallbacks** - Ensures audio always works

### Development Tools
- **📝 ESLint** - Code linting and quality checks
- **🎯 TypeScript** - Static type checking
- **🔧 PostCSS** - CSS processing and optimization

### Deployment
- **☁️ Vercel** - Hosting and continuous deployment
- **🌐 CDN** - Global content delivery
- **📈 Analytics** - Performance monitoring

## 📁 Project Structure

```
words-spelling-for-pte/
├── 📁 src/
│   ├── 📁 app/                          # Next.js App Router
│   │   ├── 📁 api/                     # API routes
│   │   │   ├── 📁 upload/              # File upload endpoint
│   │   │   ├── 📁 game-session/        # Game data tracking
│   │   │   └── 📁 error-stats/         # Statistics calculation
│   │   ├── 📄 globals.css              # Global styles
│   │   ├── 📄 layout.tsx               # Root layout
│   │   └── 📄 page.tsx                 # Main page
│   ├── 📁 components/                   # React components (modular structure)
│   │   ├── 📄 AudioPlayer.tsx          # Audio pronunciation component
│   │   ├── 📄 FileUpload.tsx           # File upload interface
│   │   ├── 📄 VocabularyGame.tsx       # Main game orchestrator
│   │   ├── 📄 ErrorStats.tsx           # Statistics dashboard
│   │   ├── 📁 GameModes/               # Game difficulty modes
│   │   │   ├── 📄 LengthHintMode.tsx   # Length hint mode
│   │   │   ├── 📄 FirstLetterMode.tsx  # First letter hint mode
│   │   │   ├── 📄 NoHintMode.tsx       # No hint mode
│   │   │   └── 📄 index.ts             # Mode exports
│   │   ├── 📁 Stats/                   # Statistics components
│   │   │   ├── 📄 GameStats.tsx        # Live game statistics
│   │   │   ├── 📄 StatBadge.tsx        # Individual stat badge
│   │   │   ├── 📄 ProgressBar.tsx      # Progress visualization
│   │   │   ├── 📄 ResultDisplay.tsx    # Answer results
│   │   │   └── 📄 index.ts             # Stats exports
│   │   ├── 📁 GameInput/               # Input and action components
│   │   │   ├── 📄 GameInput.tsx        # Text input field
│   │   │   ├── 📄 ActionButtons.tsx    # Submit/Show/Skip buttons
│   │   │   ├── 📄 ShowAnswerModal.tsx  # Answer popup modal
│   │   │   └── 📄 index.ts             # Input exports
│   │   └── 📁 ErrorStats/              # Detailed statistics
│   │       ├── 📄 OverallStats.tsx     # Summary statistics
│   │       ├── 📄 SortControls.tsx     # Sorting options
│   │       ├── 📄 ErrorStatsTable.tsx  # Statistics data table
│   │       ├── 📄 LoadingSpinner.tsx   # Loading state
│   │       └── 📄 index.ts             # ErrorStats exports
│   ├── 📁 lib/                         # Utility functions
│   │   └── 📄 utils.ts                 # Helper functions
│   └── 📁 types/                       # TypeScript definitions
│       └── 📄 index.ts                 # Type definitions
├── 📁 public/                          # Static assets
├── 📄 package.json                     # Dependencies & scripts
├── 📄 tailwind.config.ts               # Tailwind configuration
├── 📄 tsconfig.json                    # TypeScript configuration
├── 📄 next.config.ts                   # Next.js configuration
└── 📄 README.md                        # This file
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

- **📦 Code Splitting**: Automatic with Next.js App Router
- **🧩 Component Modularization**: Lazy loading of feature components  
- **🖼️ Image Optimization**: Next.js Image component
- **⚡ SSR/SSG**: Server-side rendering for faster loads
- **🗜️ Compression**: Gzip compression enabled
- **📱 PWA Ready**: Service worker support (optional)
- **🔄 Efficient Re-renders**: Optimized React component updates
- **📊 Bundle Analysis**: Webpack bundle optimization

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

- 📝 Write clear, descriptive commit messages
- 🧪 Add tests for new features and components
- 📖 Update documentation for any API or component changes
- 🎨 Follow existing code style and component patterns
- 🔍 Test across different browsers and devices
- 🧩 Keep components modular and single-purpose
- 📊 Consider performance impact of new features

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
- 💬 **Issues**: [GitHub Issues](https://github.com/jjingtang/words-spelling-for-pte/issues)
- 📖 **Documentation**: [Wiki](https://github.com/jjingtang/words-spelling-for-pte/wiki)

## 🗺️ Roadmap

### Version 2.0 (Planned)
- [ ] 🗄️ **Database Integration** (PostgreSQL/MongoDB)
- [ ] 👤 **User Authentication** (NextAuth.js)
- [ ] 🧠 **Spaced Repetition Algorithm**
- [ ] 🌍 **Multiple Language Support**
- [ ] 📱 **PWA Support** for offline usage
- [ ] 🎨 **Custom Themes** and personalization
- [ ] 📝 **PTE-Specific Features** (Academic word lists, scoring simulation)

### Version 2.1 (Future)
- [ ] 🎯 **AI-Powered Difficulty Adjustment**
- [ ] 🏆 **Gamification & Achievements**
- [ ] 👥 **Social Features & Leaderboards**
- [ ] 📈 **Advanced Analytics Dashboard**
- [ ] 🎙️ **Speech Recognition** for pronunciation practice
- [ ] 📊 **Learning Path Recommendations**
- [ ] 🔄 **Import from Multiple Sources** (Google Sheets, CSV, etc.)
- [ ] 📱 **Mobile App** (React Native)
- [ ] 📋 **PTE Test Simulation Mode**

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Translate** for providing free TTS API
- **Vercel** for excellent hosting platform
- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for beautiful icons
- **SheetJS** for Excel processing capabilities
- **PTE Academic** test format inspiration
- **Open source community** for continuous inspiration and support

## 📊 Project Statistics

![GitHub stars](https://img.shields.io/github/stars/jjingtang/words-spelling-for-pte)
![GitHub forks](https://img.shields.io/github/forks/jjingtang/words-spelling-for-pte)
![GitHub issues](https://img.shields.io/github/issues/jjingtang/words-spelling-for-pte)
![GitHub license](https://img.shields.io/github/license/jjingtang/words-spelling-for-pte)

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

[⭐ Star this repo](https://github.com/jjingtang/words-spelling-for-pte) | [🐛 Report Bug](https://github.com/jjingtang/words-spelling-for-pte/issues) | [💡 Request Feature](https://github.com/jjingtang/words-spelling-for-pte/issues)

</div>
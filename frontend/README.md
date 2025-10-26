# 🚀 AI-Powered Job Search Platform

A modern, intelligent job search platform built with Next.js that leverages AI to match candidates with their dream jobs. The platform offers CV analysis, AI-powered job matching, and natural language job search capabilities.

## ✨ Features

### 🎯 CV Analysis & Job Matching
- Upload your CV and get personalized job recommendations
- AI-powered matching algorithm analyzes your skills and experience
- Match percentage scoring for each job opportunity
- Skill gap analysis (matching skills vs. missing skills)
- Filter jobs by location, type, level, and category

### 🤖 AI Job Search
- Natural language job search interface
- Describe your ideal position in everyday language
- Real-time job results with smart filtering
- Example searches to help you get started
- Advanced sorting options (Best Match, Highest Salary, Most Recent)

### 📊 Job Dashboard
- Comprehensive job listing grid
- Active filters bar with one-click removal
- Statistics: total jobs found and average match percentage
- Responsive 2-column grid layout for optimal viewing
- Smooth animations and transitions

### 🎨 Modern UI/UX
- Dark/Light theme support
- Smooth animations powered by Framer Motion
- Responsive design for all screen sizes
- Toast notifications for user feedback
- Custom hamster wheel loading animation
- Clean and intuitive interface

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **UI Library**: [React 18+](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: Custom components built with Radix UI primitives
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: Axios
- **Font**: Source Sans Pro

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── cv/                 # CV analysis page
│   │   ├── job-match/          # Job matching page
│   │   ├── ai-job-search/      # AI-powered search page
│   │   ├── dashboard/          # Job dashboard page
│   │   ├── welcome/            # Landing page
│   │   ├── layout.js           # Root layout with providers
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── cv/                 # CV analysis components
│   │   ├── job-match/          # Job matching components
│   │   ├── ai-job-search/      # AI search components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── home/               # Home page components
│   │   ├── common/             # Shared components
│   │   └── ui/                 # UI primitives
│   ├── api/                    # API service layer
│   │   ├── apiClient.js        # Axios client configuration
│   │   ├── cvAnalysisService.js
│   │   └── superlinkedService.js
│   ├── lib/                    # Utility libraries
│   └── utils/                  # Helper functions
├── public/                     # Static assets
│   └── assets/
│       ├── fonts/
│       └── images/
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Llamallience/frontend.git
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=your_api_base_url
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Available Pages

- **`/welcome`** - Landing page with platform overview
- **`/cv`** - CV analysis and job matching
- **`/job-match`** - Browse matched jobs based on CV
- **`/ai-job-search`** - Natural language job search
- **`/dashboard`** - Comprehensive job listings

## 📦 Key Components

### CV Analysis
- `CvUploadForm` - File upload with drag & drop
- `CvAnalysis` - Analysis results display
- `CvResultsCard` - Individual job result cards

### Job Matching
- `CvUploadForm2` - Enhanced upload form
- `JobMatchResults` - Grid of matched jobs
- `JobMatchCard` - Detailed job card with match percentage
- `JobFilterBar` - Advanced filtering interface

### AI Job Search
- `JobSearchDashboard` - Main search interface
- `JobSearchHeader` - Search input with examples
- `JobResultsSection` - Results with filters and sorting
- `ExampleSearches` - Quick start search suggestions

### Common Components
- `Navbar` - Navigation bar with theme toggle
- `PageContainer` - Consistent page wrapper
- `Toast` - Notification system

## 🎨 Theming

The application supports both light and dark themes. Theme preference is persisted across sessions.

```jsx
// Toggle theme programmatically
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();
setTheme("dark"); // or "light"
```

## 🔧 API Integration

API services are centralized in the `src/api/` directory:

```javascript
import { analyzeCV, searchJobsSuperlinked } from "@/api";

// Analyze CV
const result = await analyzeCV(formData);

// Search jobs with natural language
const jobs = await searchJobsSuperlinked(query);
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

## 🧪 Code Quality

- Clean code architecture
- Component-based structure
- Reusable UI primitives
- Consistent error handling with toast notifications
- Performance optimized with `useMemo` and `useCallback`
- Proper React key usage for lists
- AnimatePresence for smooth transitions

## 🚀 Build & Deploy

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Deploy on Vercel:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Llamallience/frontend)

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📄 License

This project is part of an academic submission.

## 👥 Contributors

- **Llamallience Team** - Development & Design

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment tools
- Open source community for UI components and libraries

---

Built with ❤️ using Next.js and React

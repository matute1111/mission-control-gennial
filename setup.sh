#!/bin/bash
# Mission Control - Gennial Studios
# Run this inside the cloned repo: bash setup.sh

set -e

echo "Setting up Mission Control..."

# 1. Package.json
cat > package.json << 'PKGEOF'
{
  "name": "mission-control-gennial",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.49.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.460.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "typescript": "^5.6.3",
    "vite": "^6.0.1"
  }
}
PKGEOF

# 2. Configs
cat > vite.config.ts << 'VEOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
VEOF

cat > tailwind.config.js << 'TWEOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
TWEOF

cat > postcss.config.js << 'PCEOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
PCEOF

cat > tsconfig.json << 'TSEOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "paths": { "@/*": ["./src/*"] },
    "baseUrl": "."
  },
  "include": ["src"]
}
TSEOF

cat > vercel.json << 'VJEOF'
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
VJEOF

# 3. index.html
cat > index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mission Control | Gennial Studios</title>
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
HTMLEOF

# 4. .env files
cat > .env << 'ENVEOF'
VITE_SUPABASE_URL=https://zyyebbeqofkhsanhwerk.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_BkiycYUysm0dvSIzE-efVQ_onBRqF69
ENVEOF

cat > .env.example << 'ENVXEOF'
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
ENVXEOF

# 5. .gitignore
cat > .gitignore << 'GIEOF'
node_modules
dist
.env
.env.local
*.local
GIEOF

# 6. Source files
mkdir -p src/lib

cat > src/main.tsx << 'MAINEOF'
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
MAINEOF

cat > src/index.css << 'CSSEOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: "DM Sans", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
CSSEOF

cat > src/lib/supabase.ts << 'SUPEOF'
import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, key)
SUPEOF

cat > src/lib/utils.ts << 'UTILEOF'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ago = (d: string) => {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (s < 60) return "ahora"
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  return `${Math.floor(s / 86400)}d`
}
UTILEOF

# 7. Types
cat > src/types.ts << 'TYPEOF'
export type Page = "dashboard" | "projects" | "tasks" | "proposals" | "activity"

export type User = {
  email: string
  name: string
  role: string
} | null

export interface Project {
  id: string
  name: string
  description: string
  status: string
  phase: string
  priority: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  project_id: string
  title: string
  description: string
  status: string
  priority: string
  assigned_to: string
  result: string
  blocked_reason: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Proposal {
  id: string
  title: string
  description: string
  category: string
  proposed_by: string
  status: string
  review_note: string
  reviewed_by: string
  created_at: string
}

export interface Activity {
  id: string
  agent: string
  action: string
  reasoning: string
  result: string
  created_at: string
}

export const USERS: Record<string, { name: string; role: string; pass: string }> = {
  "matias@gennial.ai": { name: "Matias", role: "Chief AI Officer", pass: "gennial2026" },
  "adrian@gennial.ai": { name: "Adrian", role: "CEO", pass: "gennial2026" },
}

export const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  done: "bg-emerald-100 text-emerald-800",
  approved: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  assigned: "bg-violet-100 text-violet-800",
  review: "bg-violet-100 text-violet-800",
  blocked: "bg-red-100 text-red-800",
  failed: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800",
  critical: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-stone-100 text-stone-600",
  kimi: "bg-yellow-100 text-yellow-800",
  matias: "bg-blue-100 text-blue-800",
  adrian: "bg-violet-100 text-violet-800",
  system: "bg-stone-100 text-stone-600",
  paused: "bg-stone-100 text-stone-600",
  cancelled: "bg-stone-100 text-stone-600",
}
TYPEOF

echo "Setup complete. Run: npm install && npm run dev"
echo "Then push to GitHub and import in Vercel."

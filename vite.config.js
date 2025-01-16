import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base: '/BudgetTracker/',
  base: '/',
  plugins: [react()],
})


// firbase use budgettracker-phme
// firebase deploy

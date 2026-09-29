import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Plugin to automatically mock missing Base44 backend functions and entities during build
function mockBase44BackendPlugin() {
  return {
    name: 'mock-base44-backend',
    resolveId(source) {
      if (
        source.includes('/functions/') || 
        source.startsWith('@/functions/') ||
        source.includes('/entities/') ||
        source.startsWith('@/entities/')
      ) {
        return '\0virtual:' + source;
      }
      return null;
    },
    load(id) {
      if (id.startsWith('\0virtual:')) {
        // Return dummy mock entities and functions
        return `
          const dummyEntity = {
            list: async () => [],
            get: async () => ({}),
            create: async (data) => data,
            update: async (id, data) => data,
            delete: async () => true,
          };

          export default async function mockFunction(...args) {
            console.log("Mocked function executed:", args);
            return { success: true, data: [] };
          }

          export const processArticleSubmission = mockFunction;
          export const ensureMasterAdmin = mockFunction;
          export const getGitHubCommits = mockFunction;
          export const BlogPost = dummyEntity;
          export const ArticleSubmission = dummyEntity;
          export const SocialPost = dummyEntity;
        `;
      }
      return null;
    }
  };
}

export default defineConfig({
  plugins: [react(), mockBase44BackendPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
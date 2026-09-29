import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function mockBase44BackendPlugin() {
  const base44Folders = ['functions', 'entities', 'integrations', 'api'];

  return {
    name: 'mock-base44-backend',
    resolveId(source) {
      const isBase44Import = base44Folders.some(folder => 
        source.includes(`/${folder}/`) || 
        source.startsWith(`@/${folder}/`) ||
        source.endsWith(`/${folder}`)
      );

      if (isBase44Import) {
        return '\0virtual:' + source;
      }
      return null;
    },
    load(id) {
      if (id.startsWith('\0virtual:')) {
        return `
          const mockFn = async () => ({ success: true, data: [] });
          const dummyEntity = new Proxy(mockFn, {
            get: (target, prop) => {
              if (prop === 'then') return undefined;
              return mockFn;
            }
          });

          export default dummyEntity;

          // Export proxy for any destructuring / named imports
          export const processArticleSubmission = mockFn;
          export const ensureMasterAdmin = mockFn;
          export const getGitHubCommits = mockFn;
          export const submitTestimonial = mockFn;
          export const BlogPost = dummyEntity;
          export const ArticleSubmission = dummyEntity;
          export const SocialPost = dummyEntity;
          export const Core = dummyEntity;

          // Fallback proxy handler for unhandled named exports
          export const __esModule = true;
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

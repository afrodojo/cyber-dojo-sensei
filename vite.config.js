import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Plugin to automatically mock missing Base44 backend services during build
function mockBase44BackendPlugin() {
  const base44Folders = ['functions', 'entities', 'integrations', 'api'];

  return {
    name: 'mock-base44-backend',
    resolveId(source) {
      // Check if import starts with /src/ or @/ followed by any known Base44 system folder
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
        // Return a flexible proxy that responds safely to any function or entity method call
        return `
          const createProxy = () => new Proxy(() => {}, {
            get: (target, prop) => {
              if (prop === 'then') return undefined; // Avoid broken async/await promises
              return createProxy();
            },
            apply: async () => ({ success: true, data: [] })
          });

          const mockObject = createProxy();

          export default mockObject;
          export const processArticleSubmission = mockObject;
          export const ensureMasterAdmin = mockObject;
          export const getGitHubCommits = mockObject;
          export const BlogPost = mockObject;
          export const ArticleSubmission = mockObject;
          export const SocialPost = mockObject;
          export const Core = mockObject;
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
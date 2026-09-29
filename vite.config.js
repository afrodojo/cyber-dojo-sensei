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
          const createProxy = () => new Proxy(() => {}, {
            get: (target, prop) => {
              if (prop === 'then') return undefined;
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

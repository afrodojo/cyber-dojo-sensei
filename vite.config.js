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
          
          const universalProxy = new Proxy(mockFn, {
            get: (target, prop) => {
              if (prop === 'then') return undefined;
              if (prop === '__esModule') return true;
              return universalProxy;
            },
            apply: async () => ({ success: true, data: [] })
          });

          // Default export
          export default universalProxy;

          // Universal proxy fallback for named destructuring
          export const __esModule = true;
          
          // Fallback proxy handler proxying any named exports
          module.exports = universalProxy;
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
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});

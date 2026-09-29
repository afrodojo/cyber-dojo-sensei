import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function mockBase44BackendPlugin() {
  const base44Folders = ['functions', 'entities', 'integrations', 'api'];

  return {
    name: 'mock-base44-backend',
    enforce: 'pre',
    transform(code, id) {
      // Intercept source files and rewrite named imports from Base44 paths into default imports
      const hasBase44Import = base44Folders.some(folder => id.includes(`/src/${folder}/`));
      
      // Match import statements referencing base44 folders and convert them to default proxy imports
      if (code.includes('/functions/') || code.includes('/entities/') || code.includes('/integrations/') || code.includes('/api/')) {
        const transformedCode = code.replace(
          /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]*(?:functions|entities|integrations|api)[^'"]*)['"]/g,
          (match, imports, source) => {
            const vars = imports.split(',').map(i => i.trim().split(/\s+as\s+/)[0]);
            const assignments = vars.map(v => `const ${v} = mockProxy;`).join(' ');
            return `import mockProxy from '${source}'; ${assignments}`;
          }
        );
        return { code: transformedCode, map: null };
      }
      return null;
    },
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

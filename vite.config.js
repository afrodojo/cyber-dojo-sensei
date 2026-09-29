import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function mockBase44BackendPlugin() {
  const base44Folders = ['functions', 'entities', 'integrations', 'api'];
  
  // Extract all named imports referenced across the src directory
  const extractedExports = new Set([
    'processArticleSubmission', 'ensureMasterAdmin', 'getGitHubCommits',
    'submitTestimonial', 'subscribeNewsletter', 'generateSocialPostsFromBlog',
    'Testimonial', 'BlogPost', 'ArticleSubmission', 'SocialPost', 'Core', 
    'User', 'Project', 'Article', 'Comment', 'Category', 'Tag', 'Subscriber', 'Newsletter'
  ]);

  try {
    const srcDir = path.resolve(__dirname, './src');
    if (fs.existsSync(srcDir)) {
      const files = fs.readdirSync(srcDir, { recursive: true });
      files.forEach(file => {
        if (typeof file === 'string' && (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx'))) {
          const content = fs.readFileSync(path.join(srcDir, file), 'utf-8');
          const matches = content.matchAll(/import\s+\{([^}]+)\}\s+from\s+['"][^'"]*(?:functions|entities|integrations|api)[^'"]*['"]/g);
          for (const match of matches) {
            match[1].split(',').forEach(imp => {
              const cleaned = imp.trim().split(/\s+as\s+/)[0];
              if (cleaned) extractedExports.add(cleaned);
            });
          }
        }
      });
    }
  } catch (e) {
    console.warn("Could not scan src directory for imports, falling back to default list:", e);
  }

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
        const exportsList = Array.from(extractedExports)
          .map(exp => `export const ${exp} = dummyEntity;`)
          .join('\n');

        return `
          const mockFn = async () => ({ success: true, data: [] });
          const dummyEntity = new Proxy(mockFn, {
            get: (target, prop) => {
              if (prop === 'then') return undefined;
              return dummyEntity;
            },
            apply: async () => ({ success: true, data: [] })
          });

          // Default export
          export default dummyEntity;

          // Dynamically scanned named exports
          ${exportsList}
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

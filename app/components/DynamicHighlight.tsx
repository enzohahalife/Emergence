'use client';

import { memo, useState, useEffect } from 'react';

interface DynamicHighlightProps {
  code: string;
  language: string;
  className?: string;
}

const DynamicHighlight = memo(function DynamicHighlight({
  code,
  language,
  className = ''
}: DynamicHighlightProps) {
  const [highlightedCode, setHighlightedCode] = useState(code);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHighlighter = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 动态导入 highlight.js 核心库
        const { default: hljs } = await import('highlight.js/lib/core');

        // 尝试加载特定语言，如果失败则使用通用高亮
        try {
          const langModule = await import(`highlight.js/lib/languages/${language}`);
          hljs.registerLanguage(language, langModule.default);

          const result = hljs.highlight(code, { language });
          setHighlightedCode(result.value);
        } catch (langError) {
          console.warn(`Language ${language} not found, using auto-detection`);

          // 加载一些常用语言作为后备
          const commonLanguages = ['javascript', 'typescript', 'python', 'css', 'html'];

          for (const lang of commonLanguages) {
            try {
              const langModule = await import(`highlight.js/lib/languages/${lang}`);
              hljs.registerLanguage(lang, langModule.default);
            } catch {
              // 忽略加载失败的语言
            }
          }

          const result = hljs.highlightAuto(code);
          setHighlightedCode(result.value);
        }
      } catch (error) {
        console.error('Failed to load syntax highlighter:', error);
        setError('语法高亮加载失败');
        setHighlightedCode(code); // 降级到纯文本
      } finally {
        setIsLoading(false);
      }
    };

    loadHighlighter();
  }, [code, language]);

  if (isLoading) {
    return (
      <pre className={className}>
        <code>{code}</code>
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          fontSize: '12px',
          color: '#666'
        }}>
          加载语法高亮...
        </div>
      </pre>
    );
  }

  if (error) {
    return (
      <pre className={className}>
        <code>{code}</code>
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          fontSize: '12px',
          color: '#f56565'
        }}>
          {error}
        </div>
      </pre>
    );
  }

  return (
    <pre className={className}>
      <code
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
        style={{ position: 'relative' }}
      />
    </pre>
  );
});

export default DynamicHighlight;
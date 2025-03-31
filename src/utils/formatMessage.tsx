import { marked } from 'marked';

export const formatMessage = (content: string): string => {
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  return marked.parse(content, { async: false }) as string;
};

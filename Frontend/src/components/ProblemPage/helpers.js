export const langMap = {
  cpp: 'cpp',
  java: 'java',
  javascript: 'javascript'
};

export const getLanguageForMonaco = (lang) => {
  switch (lang) {
    case 'javascript': return 'javascript';
    case 'java': return 'java';
    case 'cpp': return 'cpp';
    default: return 'javascript';
  }
};

export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 'text-green-500';
    case 'medium': return 'text-yellow-500';
    case 'hard': return 'text-red-500';
    default: return 'text-gray-500';
  }
};
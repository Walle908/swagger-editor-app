import { TeamMember } from '@/types/aboutPageTypes';

export type techStackType = {
  stackName: string;
  stackUrl: string;
};

export const skillsList = [
  'JavaScript',
  'TypeScript',
  'Git, GitHub (clone, add, commit, push, pull, merge, rebase, pull request flow)',
  'NPM, Webpack',
  'CSS3 / HTML5',
  'Chrome DevTools, Figma',
];

export const techStack: techStackType[] = [
  { stackName: 'Next.js', stackUrl: 'https://nextjs.org/' },
  { stackName: 'React', stackUrl: 'https://react.dev/' },
  { stackName: 'React DOM', stackUrl: 'https://www.npmjs.com/package/react-dom' },
  { stackName: 'TypeScript', stackUrl: 'https://www.typescriptlang.org/' },
  {
    stackName: 'Zustand',
    stackUrl: 'https://zustand.docs.pmnd.rs/learn/getting-started/introduction',
  },
  { stackName: 'SCSS', stackUrl: 'https://sass-lang.com/' },
  { stackName: 'React Hook Form', stackUrl: 'https://react-hook-form.com/' },
  { stackName: 'Zod', stackUrl: 'https://zod.dev/' },
  { stackName: 'Next-intl', stackUrl: 'https://next-intl.dev/' },
  { stackName: 'Vitest', stackUrl: 'https://vitest.dev/' },
  {
    stackName: 'React Testing Library',
    stackUrl: 'https://testing-library.com/docs/react-testing-library/intro/',
  },
  { stackName: 'JSDOM', stackUrl: 'https://jsdom.org/' },
  { stackName: 'V8 Coverage', stackUrl: 'https://vitest.dev/guide/coverage' },
  { stackName: 'Husky', stackUrl: 'https://typicode.github.io/husky/get-started.html' },
  { stackName: 'Lint-staged', stackUrl: 'https://github.com/lint-staged/lint-staged' },
  { stackName: 'Commitlint', stackUrl: 'https://commitlint.js.org/' },
  {
    stackName: 'Validate Branch Name',
    stackUrl: 'https://www.npmjs.com/package/validate-branch-name',
  },
  { stackName: 'ESLint', stackUrl: 'https://eslint.org/' },
  { stackName: 'Prettier', stackUrl: 'https://prettier.io/' },
];

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    role: 'Frontend Developer',
    github: 'https://github.com/YuliaEnik',
    image: 'https://avatars.githubusercontent.com/u/70852362?v=4',
  },
  {
    id: 2,
    role: 'Frontend Developer',
    github: 'https://github.com/Walle908',
    image: 'https://avatars.githubusercontent.com/u/230425554?v=4',
  },
  {
    id: 3,
    role: 'Frontend Developer',
    github: 'https://github.com/karinavd',
    image: 'https://avatars.githubusercontent.com/u/151913440?v=4',
  },
];

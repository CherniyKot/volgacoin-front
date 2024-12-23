import type { ComponentType, JSX } from 'react';

import { ClickerPage } from '@/pages/ClickerPage/ClickerPage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: ClickerPage },
];

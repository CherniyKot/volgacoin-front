import { Section, Cell, TabsList } from '@telegram-apps/telegram-ui';
import { useState, type FC } from 'react';

import { Page } from '@/components/Page.tsx';
import { ClickerSubpage } from './subpages/Clicker';
import { RatingSubpage } from './subpages/Rating';

const tabs = [
  { id: 1, text: "Clicker", Page: () => <ClickerSubpage /> },
  { id: 2, text: "Rating", Page: () => <RatingSubpage /> }]

export const ClickerPage: FC = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0].id);
  return (
    <Page back={false}>
        <Section
          header="Volgacoin - накликай на Волгу"
        >
        {tabs.find((e) => e.id == currentTab)?.Page()}
          <TabsList>
            {tabs.map(({ id, text }) =>
              <TabsList.Item
                key={id}
                selected={id === currentTab}
                onClick={() => setCurrentTab(id)}>
                {text}
              </TabsList.Item>)}
          </TabsList>
        </Section>
    </Page>
  );
};

'use client';

type DetailPageTabsProps = {
  tabs: string[];
  value: string;
  onPress: (tab: string) => void;
};

export const DetailPageTabs = ({ tabs, value, onPress }: DetailPageTabsProps) => {
  return (
    <div className={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab === value;
        return (
          <button
            key={tab}
            onClick={() => onPress(tab)}
            className={isActive ? styles.activeTab : styles.inactiveTab}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

const styles = {
  container: `
    bg-white
    flex items-center gap-1
    border-b border-gray-200
    mb-4
    px-1
    pt-2
  `,
  activeTab: `
    px-4 py-2
    text-sm font-medium text-blue-600
    border-b-2 border-blue-600
    border-t-0 border-l-0 border-r-0
    transition-colors
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    rounded-t
    bg-transparent
    cursor-pointer
    -mb-px
  `,
  inactiveTab: `
    px-4 py-2
    text-sm font-medium text-gray-600
    hover:text-gray-900
    border-b-2 border-transparent
    border-t-0 border-l-0 border-r-0
    transition-colors
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    rounded-t
    bg-transparent
    cursor-pointer
    -mb-px
  `,
};

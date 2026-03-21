export type AppLayoutBreadcrumbMenuItem = {
  label: string;
  onSelect: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
};

export type AppLayoutBreadcrumb = {
  label: string;
  href?: string;
  onSelect?: () => void;
  menuItems?: AppLayoutBreadcrumbMenuItem[];
  isPendingSelection?: boolean;
};

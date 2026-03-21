'use client';

type IconProps = {
  className?: string;
};

export const BoldIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z"
      />
    </svg>
  );
};

export const ItalicIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z" fill="currentColor" />
    </svg>
  );
};

export const StrikethroughIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.117H3v-2h18v2h-3.846zm-4.078-3H7.629a4.086 4.086 0 0 1-.481-.522C6.716 9.92 6.5 9.246 6.5 8.452c0-1.236.466-2.287 1.397-3.153C8.83 4.433 10.271 4 12.222 4c1.471 0 2.879.328 4.222.984v2.152c-1.2-.687-2.515-1.03-3.946-1.03-2.48 0-3.719.782-3.719 2.346 0 .42.218.786.654 1.099.436.313.974.562 1.613.75.62.18 1.297.414 2.03.699z"
      />
    </svg>
  );
};

export const LinkIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z"
      />
    </svg>
  );
};

export const UnlinkIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M17 17h5v2h-3v3h-2v-5zM7 7H2V5h3V2h2v5zm11.364 8.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z"
      />
    </svg>
  );
};

export const CodeIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M23 12l-7.071 7.071-1.414-1.414L20.172 12l-5.657-5.657 1.414-1.414L23 12zM3.828 12l5.657 5.657-1.414 1.414L1 12l7.071-7.071 1.414 1.414L3.828 12z"
      />
    </svg>
  );
};

export const ClearMarksIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M12.651 14.065L11.605 20H9.574l1.35-7.661-7.41-7.41L4.93 3.515 20.485 19.07l-1.414 1.414-6.42-6.42zm-.878-6.535l.27-1.53h-1.8l-2-2H20v2h-5.927L13.5 9.257 11.773 7.53z"
      />
    </svg>
  );
};

export const EraserIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M8.586 8.858l-4.95 4.95 5.194 5.194H10V19h1.172l3.778-3.778-6.364-6.364zM10 7.444l6.364 6.364 2.828-2.829-6.364-6.364L10 7.444zM14 19h7v2h-9l-3.998.002-6.487-6.487a1 1 0 0 1 0-1.414L12.12 2.494a1 1 0 0 1 1.415 0l7.778 7.778a1 1 0 0 1 0 1.414L14 19z"
      />
    </svg>
  );
};

export const HeadingOneIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0H24V24H0z" />
      <path fill="currentColor" d="M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16zm8-12v12h-2v-9.796l-2 .536V8.67L19.5 8H21z" />
    </svg>
  );
};

export const HeadingTwoIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0H24V24H0z" />
      <path
        fill="currentColor"
        d="M4 4v7h7V4h2v16h-2v-7H4v7H2V4h2zm14.5 4c2.071 0 3.75 1.679 3.75 3.75 0 .857-.288 1.648-.772 2.28l-.148.18L18.034 18H22v2h-7v-1.556l4.82-5.546c.268-.307.43-.709.43-1.148 0-.966-.784-1.75-1.75-1.75-.918 0-1.671.707-1.744 1.606l-.006.144h-2C14.75 9.679 16.429 8 18.5 8z"
      />
    </svg>
  );
};

export const UnorderedListIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
      />
    </svg>
  );
};

export const OrderedListIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
      />
    </svg>
  );
};

export const CodeBlockIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5H4zm16 7l-3.536 3.536-1.414-1.415L17.172 12 15.05 9.879l1.414-1.415L20 12zM6.828 12l2.122 2.121-1.414 1.415L4 12l3.536-3.536L8.95 9.88 6.828 12zm4.416 5H9.116l3.64-10h2.128l-3.64 10z"
      />
    </svg>
  );
};

export const BlockQuoteIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="currentColor"
        d="M19.417 6.679C20.447 7.773 21 9 21 10.989c0 3.5-2.457 6.637-6.03 8.188l-.893-1.378c3.335-1.804 3.987-4.145 4.247-5.621-.537.278-1.24.375-1.929.311-1.804-.167-3.226-1.648-3.226-3.489a3.5 3.5 0 0 1 3.5-3.5c1.073 0 2.099.49 2.748 1.179zm-10 0C10.447 7.773 11 9 11 10.989c0 3.5-2.457 6.637-6.03 8.188l-.893-1.378c3.335-1.804 3.987-4.145 4.247-5.621-.537.278-1.24.375-1.929.311C4.591 12.322 3.17 10.841 3.17 9a3.5 3.5 0 0 1 3.5-3.5c1.073 0 2.099.49 2.748 1.179z"
      />
    </svg>
  );
};

export const SeparatorIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path fill="currentColor" d="M2 11h2v2H2v-2zm4 0h12v2H6v-2zm14 0h2v2h-2v-2z" />
    </svg>
  );
};

export const UndoIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path fill="currentColor" d="M5.828 7l2.536 2.536L6.95 10.95 2 6l4.95-4.95 1.414 1.414L5.828 5H13a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H5.828z" />
    </svg>
  );
};

export const RedoIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path fill="currentColor" d="M18.172 7H11a6 6 0 1 0 0 12h9v2h-9a8 8 0 1 1 0-16h7.172l-2.536-2.536L17.05 1.05 22 6l-4.95 4.95-1.414-1.414L18.172 7z" />
    </svg>
  );
};

export const FontColorIcon = (props: IconProps) => {
  const { className = '' } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path fill="currentColor" d="M15.246 14H8.754l-1.6 4H5l6-15h2l6 15h-2.154l-1.6-4zm-.8-2L12 5.885 9.554 12h4.892zM3 20h18v2H3v-2z" />
    </svg>
  );
};

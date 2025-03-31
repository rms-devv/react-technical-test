import { create } from 'zustand';

interface IssueState {
  issueUrl: string;
  setIssueUrl: (url: string) => void;
}

export const useIssueStore = create<IssueState>((set) => ({
  issueUrl: 'facebook/react/issues/7901',
  setIssueUrl: (url: string) => set({ issueUrl: url }),
}));

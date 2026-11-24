import React from 'react';

export interface CommandResponse {
  type: 'text' | 'component' | 'error' | 'ascii';
  content: string | React.ReactNode;
}

export interface HistoryItem {
  command: string;
  response: CommandResponse;
  timestamp: number;
}

export type Theme = 'classic' | 'amber' | 'cyan';

import React from 'react';

export interface CommandResponse {
  type: 'text' | 'component' | 'error' | 'ascii';
  content: string | React.ReactNode;
  component?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  githubUrl: string;
  demoUrl?: string;
  stats: { stars: number; forks: number };
  codeSnippet: string;
  performance: string;
  reviews: string[];
}

export interface Skill {
  name: string;
  level: number; // 1-100
  description: string;
  category: 'Engine' | 'Language' | 'Tool' | 'Graphics';
}

export interface HistoryItem {
  command: string;
  response: CommandResponse;
  timestamp: number;
}

export type Theme = 'classic' | 'amber' | 'cyan' | 'cyberpunk';
export type Layout = 'compact' | 'full';
export type FontStyle = 'modern' | 'retro';
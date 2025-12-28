import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

export interface User {
  name: string;
  role: string;
  avatar: string;
}

export interface StatCardProps {
  label: string;
  value: string;
  trend: number; // percentage
  trendLabel: string;
}

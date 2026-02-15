
export enum UserRole {
  ADMIN = 'ADMIN',
  EQUIPE = 'EQUIPE',
  CLIENTE = 'CLIENTE'
}

export enum ContentStatus {
  PENDENTE = 'PENDENTE',
  A_PRODUZIR = 'A_PRODUZIR',
  EM_PRODUCAO = 'EM_PRODUCAO',
  EM_REVISAO = 'EM_REVISAO',
  APROVADO = 'APROVADO',
  REPROVADO = 'REPROVADO',
  AJUSTES_SOLICITADOS = 'AJUSTES_SOLICITADOS',
  ENTREGUE = 'ENTREGUE'
}

export enum Priority {
  BAIXA = 'BAIXA',
  MEDIA = 'MÉDIA',
  ALTA = 'ALTA'
}

/* Fix: Added missing User interface used throughout the application */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  clientId?: string;
}

export interface ContentTarget {
  id: string;
  label: string; // Ex: "Flyers", "Vídeos Reels"
  count: number; // Meta mensal
}

export interface Client {
  id: string;
  name: string;
  sector: string;
  logo: string;
  active: boolean;
  targets: ContentTarget[];
}

/* Fix: Added missing ClientPackage interface for CreateClientModal */
export interface ClientPackage {
  videos: number;
  flyers: number;
  carousels: number;
  campaigns: number;
  total: number;
}

export interface ContentTask {
  id: string;
  clientId: string;
  title: string;
  briefing: string;
  format: string;
  channel: string;
  priority: Priority;
  status: ContentStatus;
  deadline: string; // ISO Date String
  assignedTo?: string;
  attachments: string[];
  links: string[];
  createdAt: string;
  reviewComment?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  timestamp: string;
}
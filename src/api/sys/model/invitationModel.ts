export interface InvitationParams {
  maxUses?: number;
  expireDays?: number;
}

export interface InvitationItem {
  id: number;
  code: string;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  createdAt: string;
  creatorId: number;
}

export type InvitationListResult = InvitationItem[];

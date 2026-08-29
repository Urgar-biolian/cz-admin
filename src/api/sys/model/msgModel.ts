export interface MessageParams {
  title: string;
  content: string;
}

export interface MessageItem {
  id: number;
  title: string;
  content: string;
}

export type MessageResultModel = MessageItem[];

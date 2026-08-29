import { defHttp } from "@/utils/http/axios";

export interface CommentParams {
  title?: string;
  content?: string;
  category?: string;
  isPinned?: boolean;
  isFeatured?: boolean;
}

export interface CommentResultModel {
  id: number;
  title?: string;
  category: string;
  content: string;
  tags?: string[];
  userId: number;
  isPinned: boolean;
  isFeatured: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  likeCount?: number;
  replyCount?: number;
  user?: {
    userId?: number;
    username: string;
    avatar?: string;
    role?: string;
    badge?: string;
    score?: number;
  };
  quote?: {
    id: number;
    content: string;
    userId: number;
    user?: {
      username: string;
      avatar?: string;
    };
  } | null;
  replies?: CommentResultModel[];
}

export interface CommentListResponse {
  data: CommentResultModel[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    sort: string;
    category: string;
  };
}

export interface CommentDetailResponse {
  data: CommentResultModel;
}

enum Api {
  Comment = "/comments",
}

export function getCommentListApi(params?: any) {
  return defHttp.get<CommentListResponse>(
    {
      url: Api.Comment,
      params,
    },
    {
      errorMessageMode: "none",
    },
  );
}

export function getCommentDetailApi(id: number) {
  return defHttp.get<CommentDetailResponse>(
    {
      url: `${Api.Comment}/${id}`,
    },
    {
      errorMessageMode: "none",
    },
  );
}

export function updateCommentApi(id: number, info: CommentParams) {
  return defHttp.patch<{ data: CommentResultModel }>(
    {
      url: `${Api.Comment}/${id}`,
      data: info,
    },
    {
      errorMessageMode: "message",
    },
  );
}

export function removeCommentApi(id: number) {
  return defHttp.delete(
    {
      url: `${Api.Comment}/${id}`,
    },
    {
      errorMessageMode: "message",
    },
  );
}

import { defHttp } from "@/utils/http/axios";
import { ContentTypeEnum } from "@/enums/httpEnum";
import { ErrorMessageMode } from "#/axios";

// 成就成员类型定义
export interface WinnerMember {
  sortOrder: number;
  user: {
    userId: number;
    username: string;
    avatar: string;
  } | null;
}

// 获奖者（成就）类型定义
export interface Winner {
  id: number;
  title: string;
  award: string;
  category: string;
  avatar: string;
  members: WinnerMember[];
  createdAt: string;
  updatedAt?: string;
}

// 创建成就DTO
export interface CreateWinnerDto {
  title: string;
  award: string;
  category?: string;
  avatar?: string;
  memberIds?: number[];
}

// 更新成就DTO
export interface UpdateWinnerDto {
  title?: string;
  award?: string;
  category?: string;
  avatar?: string;
  memberIds?: number[];
}

// 分页响应类型
export interface PageResponse<T> {
  winners: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 分页查询参数
export interface PageParams {
  page?: number;
  pageSize?: number;
  title?: string;
  award?: string;
}

// 批量删除参数
export interface BatchDeleteParams {
  ids: number[];
}

// 统计数据
export interface WinnerStats {
  totalWinners: number;
  awardStats: Array<{
    award: string;
    _count: { award: number };
  }>;
  titleStats: Array<{
    title: string;
    _count: { title: number };
  }>;
}

// API 路径枚举
enum Api {
  Winner = "/winners",
  WinnerPage = "/winners/page",
  WinnerStats = "/winners/stats",
  FilterAward = "/winners/filter/award",
  FilterTitle = "/winners/filter/title",
  BatchCreate = "/winners/batch",
  BatchDelete = "/winners/batch",
  Upload = "/upload/image",
}

/**
 * 获取所有获奖者
 */
export function getWinners() {
  return defHttp.get<Winner[]>({ url: Api.Winner }, { withToken: false });
}

/**
 * 分页获取获奖者
 */
export function getWinnersPage(params: PageParams) {
  return defHttp.get<PageResponse<Winner>>(
    { url: Api.WinnerPage, params },
    { withToken: false },
  );
}

/**
 * 获取获奖者详情
 */
export function getWinnerDetail(id: number) {
  return defHttp.get<Winner>({ url: `${Api.Winner}/${id}` }, { withToken: false });
}

/**
 * 创建获奖者
 */
export function createWinner(
  data: CreateWinnerDto,
  mode: ErrorMessageMode = "modal",
) {
  return defHttp.post<Winner>(
    { url: Api.Winner, data },
    { errorMessageMode: mode, withToken: true },
  );
}

/**
 * 批量创建获奖者
 */
export function batchCreateWinners(
  data: CreateWinnerDto[],
  mode: ErrorMessageMode = "modal",
) {
  return defHttp.post<{ count: number; message: string }>(
    { url: Api.BatchCreate, data },
    { errorMessageMode: mode, withToken: true },
  );
}

/**
 * 更新获奖者信息
 */
export function updateWinner(
  id: number,
  data: UpdateWinnerDto,
  mode: ErrorMessageMode = "modal",
) {
  return defHttp.put<Winner>(
    { url: `${Api.Winner}/${id}`, data },
    { errorMessageMode: mode, withToken: true },
  );
}

/**
 * 删除获奖者
 */
export function deleteWinner(id: number, mode: ErrorMessageMode = "modal") {
  return defHttp.delete<null>(
    { url: `${Api.Winner}/${id}` },
    { errorMessageMode: mode, withToken: true },
  );
}

/**
 * 调整成就展示顺序
 */
export function reorderWinners(
  ids: number[],
  mode: ErrorMessageMode = "modal",
) {
  return defHttp.put<{ success: boolean }>(
    { url: `${Api.Winner}/reorder`, data: { ids } },
    { errorMessageMode: mode, withToken: true },
  );
}

/**
 * 批量删除获奖者
 */
export function batchDeleteWinners(
  data: BatchDeleteParams,
  mode: ErrorMessageMode = "modal",
) {
  return defHttp.delete<{ count: number; message: string }>(
    { url: Api.BatchDelete, data },
    { errorMessageMode: mode, withToken: true },
  );
}

/**
 * 按获奖等级筛选
 */
export function filterWinnersByAward(award: string) {
  return defHttp.get<Winner[]>(
    { url: Api.FilterAward, params: { award } },
    { withToken: false },
  );
}

/**
 * 按成就名称筛选
 */
export function filterWinnersByTitle(title: string) {
  return defHttp.get<Winner[]>(
    { url: Api.FilterTitle, params: { title } },
    { withToken: false },
  );
}

/**
 * 获取统计数据
 */
export function getWinnerStats() {
  return defHttp.get<WinnerStats>({ url: Api.WinnerStats }, { withToken: false });
}

/**
 * 上传头像文件
 */
export function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return defHttp
    .post<{ url: string }>(
      {
        url: Api.Upload,
        data: formData,
        headers: { "Content-Type": ContentTypeEnum.FORM_DATA },
      },
      { withToken: true },
    )
    .then((res: any) => res);
}

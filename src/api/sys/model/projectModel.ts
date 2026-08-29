/**
 * @description: Project interface parameters
 */
export interface ProjectParams {
  title: string;
  content: string;
  stack: string;
  members: string;
}

/**
 * @description: Project interface return value
 */
export interface ProjectItem {
  id: number;
  title: string;
  content: string;
  stack: string;
  members: string;
}

export type ProjectResultModel = ProjectItem[];

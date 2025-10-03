
export enum ReportType {
  PROJECT = 'PROJECT',
  POLITICIAN = 'POLITICIAN'
}

export enum ProjectIssueType {
  GHOST = 'GHOST',
  SUBSTANDARD = 'SUBSTANDARD',
  NON_COMPLIANT = 'NON_COMPLIANT'
}

export type FormData = {
  reportType: ReportType;
  regionId: string;
  provinceId: string;
  cityId: string;
  description: string;
  userId: string;
  isPublic?: boolean;
  projectName?: string;
  projectIssueType?: ProjectIssueType;
  politicianName?: string;
  position?: string;
};

export type ReportWithId = FormData & {
  id: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

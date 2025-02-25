import { AxiosInstance } from 'axios';

export interface MergeGroupParams {
  base_ref: string;
  head_commit: {
    message: string;
  };
}

export enum StoryType {
  Feature = 'feature',
  Bug = 'bug',
  Chore = 'chore',
  Release = 'release',
}

export interface Label {
  name: string;
}

export const enum StoryState {
  Accepted = 'accepted',
  Delivered = 'delivered',
  Finished = 'finished',
  Planned = 'planned',
  Rejected = 'rejected',
  Started = 'started',
  Unscheduled = 'unscheduled',
  Unstarted = 'unstarted',
}

export namespace JIRA {
  export interface IssueStatus {
    self: string;
    description: string;
    iconUrl: string;
    name: string;
    id: string;
    statusCategory: {
      self: string;
      id: number;
      key: string;
      colorName: string;
      name: string;
    };
  }

  export interface IssuePriority {
    self: string;
    iconUrl: string;
    name: string;
    id: string;
  }

  export interface IssueType {
    self: string;
    id: string;
    description: string;
    iconUrl: string;
    name: string;
    subtask: boolean;
    avatarId: number;
  }

  export interface IssueProject {
    self: string;
    key: string;
    name: string;
  }

  export interface Issue {
    id: string;
    key: string;
    self: string;
    status: string;
    fields: {
      summary: string;
      status: IssueStatus;
      priority: IssuePriority;
      issuetype: IssueType;
      project: IssueProject;
      labels: string[];
      [k: string]: unknown;
    };
  }
}

export interface JIRADetails {
  key: string;
  summary: string;
  url: string;
  status: string;
  type: {
    name: string;
    icon: string;
  };
  project: {
    name: string;
    url: string;
    key: string;
  };
  estimate: string | number;
  labels: readonly { name: string; url: string }[];
}

export interface JIRALintActionInputs {
  JIRA_TOKEN: string;
  JIRA_BASE_URL: string;
  SKIP_JIRA_PROJECT: string;
  VALIDATE_ISSUE_STATUS: boolean;
  ALLOWED_ISSUE_STATUSES: string;
}

export interface JIRAClient {
  client: AxiosInstance;
  /** Get complete JIRA Issue details. */
  getIssue: (key: string) => Promise<JIRA.Issue>;
  /** Get required details to display in PR. */
  getTicketDetails: (key: string) => Promise<JIRADetails>;
}

import * as core from '@actions/core';
import * as github from '@actions/github';

import {
  getJIRAClient,
  getJIRAIssueKeys,
  isIssueStatusValid,
} from './utils';
import { MergeGroupParams, JIRADetails, JIRALintActionInputs } from './types';

const getInputs = (): JIRALintActionInputs => {
  const JIRA_TOKEN: string = core.getInput('jira-token', { required: true });
  const JIRA_BASE_URL: string = core.getInput('jira-base-url', { required: true });
  const VALIDATE_ISSUE_STATUS: boolean = core.getInput('validate_issue_status', { required: false }) === 'true';
  const ALLOWED_ISSUE_STATUSES: string = core.getInput('allowed_issue_statuses');

  return {
    JIRA_TOKEN,
    JIRA_BASE_URL: JIRA_BASE_URL.endsWith('/') ? JIRA_BASE_URL.replace(/\/$/, '') : JIRA_BASE_URL,
    VALIDATE_ISSUE_STATUS,
    ALLOWED_ISSUE_STATUSES,
  };
};

async function run(): Promise<void> {
  try {
    const {
      JIRA_TOKEN,
      JIRA_BASE_URL,
      VALIDATE_ISSUE_STATUS,
      ALLOWED_ISSUE_STATUSES,
    } = getInputs();

    const {
      payload: {
        pull_request: pullRequest,
        merge_group: mergeGroup,
      },
    } = github.context;
    
    console.log('pullRequest -> ', pullRequest);
    console.log('mergeGroup -> ', mergeGroup);

    const {
      head_commit: { message: commitMessage = ''},
      base_ref: baseBranch = '',
    } = mergeGroup as MergeGroupParams;

    console.log('Base branch -> ', baseBranch);
    console.log('Commit message -> ', commitMessage);

    const issueKeys = getJIRAIssueKeys(commitMessage);
    if (!issueKeys.length) {
      core.setFailed('JIRA issue id is missing in your branch.');
      process.exit(1);
    }

    // use the last match (end of the branch name)
    const issueKey = issueKeys[issueKeys.length - 1];
    console.log(`JIRA key -> ${issueKey}`);

    const { getTicketDetails } = getJIRAClient(JIRA_BASE_URL, JIRA_TOKEN);
    const details: JIRADetails = await getTicketDetails(issueKey);
    if (details.key) {

      if (!isIssueStatusValid(VALIDATE_ISSUE_STATUS, ALLOWED_ISSUE_STATUSES.split(','), details)) {
        core.setFailed('The found jira issue does is not in acceptable statuses');
        process.exit(1);
      }

    } else {
      core.setFailed('Invalid JIRA key. Please create a branch with a valid JIRA issue key.');
      process.exit(1);
    }
  } catch (error) {
    console.log({ error });
    core.setFailed(error.message);
    process.exit(1);
  }
}

run();

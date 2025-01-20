import {
  getJIRAClient,
  isIssueStatusValid,
} from '../src/utils';
import { JIRADetails } from '../src/types';

jest.spyOn(console, 'log').mockImplementation(); // avoid actual console.log in test output

describe('JIRA Client', () => {
  // use this to test if the token is correct
  it.skip('should be able to access the issue', async () => {
    const client = getJIRAClient('https://cleartaxtech.atlassian.net/', '<token_here>');
    const details = await client.getTicketDetails('ES-10');
    console.log({ details });
    expect(details).not.toBeNull();
  });
});

describe('isIssueStatusValid()', () => {
  const issue: JIRADetails = {
    key: 'GNA-1234',
    url: 'url',
    type: { name: 'feature', icon: 'feature-icon-url' },
    estimate: 1,
    labels: [{ name: 'frontend', url: 'frontend-url' }],
    summary: 'Story title or summary',
    project: { name: 'project', url: 'project-url', key: 'abc' },
    status: 'Assessment',
  };

  it('should return false if issue validation was enabled but invalid issue status', () => {
    const expectedStatuses = ['In Test', 'In Progress'];
    expect(isIssueStatusValid(true, expectedStatuses, issue)).toBeFalsy();
  });

  it('should return true if issue validation was enabled but issue has a valid status', () => {
    const expectedStatuses = ['In Test', 'In Progress'];
    issue.status = 'In Progress';
    expect(isIssueStatusValid(true, expectedStatuses, issue)).toBeTruthy();
  });

  it('should return true if issue status validation is not enabled', () => {
    const expectedStatuses = ['In Test', 'In Progress'];
    expect(isIssueStatusValid(false, expectedStatuses, issue)).toBeTruthy();
  });
});

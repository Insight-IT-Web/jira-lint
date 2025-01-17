import {
  getJIRAIssueKeys,
  getJIRAClient,
  isIssueStatusValid,
} from '../src/utils';
import { JIRADetails } from '../src/types';

jest.spyOn(console, 'log').mockImplementation(); // avoid actual console.log in test output

describe('getJIRAIssueKeys()', () => {
  it('gets multiple keys from a string', () => {
    expect(
      getJIRAIssueKeys(
        'BF-18 abc-123 X-88 ABCDEFGHIJKL-999 abc XY-Z-333 abcDEF-33 ABCDEF-33 abcdef-33 ABC-1 PB2-1 pb2-1 P2P-1 p2p-1'
      )
    ).toEqual([
      'BF-18',
      'ABC-123',
      'X-88',
      'CDEFGHIJKL-999',
      'Z-333',
      'ABCDEF-33',
      'ABCDEF-33',
      'ABCDEF-33',
      'ABC-1',
      'PB2-1',
      'PB2-1',
      'P2P-1',
      'P2P-1',
    ]);
  });

  it('gets jira key from different branch names', () => {
    expect(getJIRAIssueKeys('fix/login-protocol-es-43')).toEqual(['ES-43']);
    expect(getJIRAIssueKeys('fix/login-protocol-ES-43')).toEqual(['ES-43']);
    expect(getJIRAIssueKeys('feature/newFeature_esch-100')).toEqual(['ESCH-100']);
    expect(getJIRAIssueKeys('feature/newFeature_ESCH-101')).toEqual(['ESCH-101']);
    expect(getJIRAIssueKeys('feature/newFeature--mojo-5611')).toEqual(['MOJO-5611']);
    expect(getJIRAIssueKeys('feature/newFeature--MOJO-6789')).toEqual(['MOJO-6789']);

    expect(getJIRAIssueKeys('chore/task-with-dashes--MOJO-6789')).toEqual(['MOJO-6789']);
    expect(getJIRAIssueKeys('chore/task_with_underscores--MOJO-6789')).toEqual(['MOJO-6789']);
    expect(getJIRAIssueKeys('chore/MOJO-6789-task_with_underscores')).toEqual(['MOJO-6789']);
    expect(getJIRAIssueKeys('MOJO-6789/task_with_underscores')).toEqual(['MOJO-6789']);

    expect(getJIRAIssueKeys('MOJO-6789/task_with_underscores-ES-43')).toEqual(['MOJO-6789', 'ES-43']);
    expect(getJIRAIssueKeys('nudge-live-chat-users-Es-172')).toEqual(['ES-172']);

    expect(getJIRAIssueKeys('feature/missingKey')).toEqual([]);
    expect(getJIRAIssueKeys('')).toEqual([]);
  });
});

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
    key: 'ABC-123',
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

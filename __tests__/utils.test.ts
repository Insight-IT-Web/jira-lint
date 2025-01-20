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

  it('gets jira key from different PR title names', () => {
    expect(getJIRAIssueKeys('GNA-1234 fix for something, GNA-34535 another fix')).toEqual(['GNA-1234']);
    expect(getJIRAIssueKeys('A platform (PRT-5678) fix')).toEqual(['PRT-5678']);

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

import {
  getLatestRuntimeJobs,
  readableOwner,
  sortRuntimeJobs
} from './runtime-job-utils';

export async function handleDailyActionListRequest(db: D1Database): Promise<Response> {
  const jobs = sortRuntimeJobs(
    (await getLatestRuntimeJobs(db)).filter(job => job.priority !== 'normal')
  );

  const lines: string[] = [
    'FieldLogic Daily Action List',
    '',
    'Use this as the morning execution checklist.',
    ''
  ];

  if (jobs.length === 0) {
    lines.push('[ ] No urgent or elevated jobs right now.');
  } else {
    jobs.forEach(job => {
      lines.push(`[ ] ${job.jobId}`);
      lines.push(`    Owner: ${readableOwner(job.owner)}`);
      lines.push(`    Priority: ${job.priority}`);
      lines.push(`    Action: ${job.nextAction}`);
      lines.push('');
    });
  }

  return new Response(lines.join('\n'), {
    headers: {
      'content-type': 'text/plain;charset=UTF-8'
    }
  });
}

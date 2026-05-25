import {
  getLatestRuntimeJobs,
  sortRuntimeJobs
} from './runtime-job-utils';

export async function handleUrgentJobsRequest(db: D1Database): Promise<Response> {
  const jobs = sortRuntimeJobs(
    (await getLatestRuntimeJobs(db)).filter(job => job.priority === 'urgent')
  );

  return new Response(
    JSON.stringify(
      {
        count: jobs.length,
        jobs
      },
      null,
      2
    ),
    {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    }
  );
}

import {
  getLatestRuntimeJobs,
  readableOwner,
  type RuntimeOwner,
  sortRuntimeJobs
} from './runtime-job-utils';

const ownerMap: Record<string, RuntimeOwner> = {
  operations: 'operations',
  service: 'service_department',
  production: 'production_manager'
};

export async function handleOwnerJobsRequest(
  ownerSlug: string,
  db: D1Database
): Promise<Response> {
  const owner = ownerMap[ownerSlug];

  if (!owner) {
    return new Response(
      JSON.stringify(
        {
          success: false,
          error: 'Unknown owner. Use operations, service, or production.'
        },
        null,
        2
      ),
      {
        status: 400,
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      }
    );
  }

  const jobs = sortRuntimeJobs(
    (await getLatestRuntimeJobs(db)).filter(
      job => job.owner === owner && job.priority !== 'normal'
    )
  );

  return new Response(
    JSON.stringify(
      {
        owner: readableOwner(owner),
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

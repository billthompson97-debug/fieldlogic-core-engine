import { handleOperationalEventIntake } from './routes/events/intake';
import { handleJobSummaryRequest } from './routes/jobs/job-summary';

export interface Env {
  FIELDLOGIC_DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/events/intake' && request.method === 'POST') {
      return handleOperationalEventIntake(request, env);
    }

    if (url.pathname.startsWith('/jobs/') && url.pathname.endsWith('/summary')) {
      const parts = url.pathname.split('/');
      const jobId = parts[2];

      return handleJobSummaryRequest(jobId, env.FIELDLOGIC_DB);
    }

    const payload = {
      platform: 'FieldLogic',
      engine: 'core',
      status: 'operational',
      timestamp: new Date().toISOString(),
      message: 'FieldLogic operational intelligence layer initialized.',
      routes: {
        eventIntake: '/events/intake',
        jobSummary: '/jobs/:id/summary'
      },
      capabilities: {
        eventPersistence: true,
        operationalMemory: true,
        jobStateTracking: true,
        operationalSummaries: true
      }
    };

    return new Response(JSON.stringify(payload, null, 2), {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    });
  }
};
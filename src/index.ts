import { handleOperationalEventIntake } from './routes/events/intake';
import { handleJobSummaryRequest } from './routes/jobs/job-summary';
import { handleJobTimelineRequest } from './routes/jobs/job-timeline';
import { handleInstallerBenchmarkRequest } from './routes/benchmarks/installer-benchmarks';
import { handleJobBenchmarkRequest } from './routes/benchmarks/job-benchmarks';
import { handleCBITelemetryWorkflow } from './routes/workflows/cbi-telemetry';
import { handleJobsNeedingAttentionRequest } from './routes/runtime/jobs-needing-attention';

export interface Env {
  FIELDLOGIC_DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/events/intake' && request.method === 'POST') {
      return handleOperationalEventIntake(request, env);
    }

    if (url.pathname === '/workflows/cbi/telemetry' && request.method === 'POST') {
      return handleCBITelemetryWorkflow(request, env);
    }

    if (url.pathname === '/runtime/jobs-needing-attention') {
      return handleJobsNeedingAttentionRequest(env.FIELDLOGIC_DB);
    }

    if (url.pathname.startsWith('/jobs/') && url.pathname.endsWith('/summary')) {
      const parts = url.pathname.split('/');
      const jobId = parts[2];

      return handleJobSummaryRequest(jobId, env.FIELDLOGIC_DB);
    }

    if (url.pathname.startsWith('/jobs/') && url.pathname.endsWith('/timeline')) {
      const parts = url.pathname.split('/');
      const jobId = parts[2];

      return handleJobTimelineRequest(jobId, env.FIELDLOGIC_DB);
    }

    if (url.pathname === '/benchmarks/installers') {
      return handleInstallerBenchmarkRequest(env.FIELDLOGIC_DB);
    }

    if (url.pathname === '/benchmarks/jobs') {
      return handleJobBenchmarkRequest(env.FIELDLOGIC_DB);
    }

    const payload = {
      platform: 'FieldLogic',
      engine: 'core',
      status: 'operational',
      timestamp: new Date().toISOString(),
      message: 'FieldLogic operational intelligence layer initialized.',
      routes: {
        eventIntake: '/events/intake',
        cbiTelemetryWorkflow: '/workflows/cbi/telemetry',
        jobsNeedingAttention: '/runtime/jobs-needing-attention',
        jobSummary: '/jobs/:id/summary',
        jobTimeline: '/jobs/:id/timeline',
        installerBenchmarks: '/benchmarks/installers',
        jobBenchmarks: '/benchmarks/jobs'
      },
      capabilities: {
        eventPersistence: true,
        operationalMemory: true,
        jobStateTracking: true,
        operationalSummaries: true,
        operationalReplay: true,
        operationalBenchmarking: true,
        liveOperationalScoring: true,
        cbiTelemetryWorkflow: true,
        jobsNeedingAttention: true
      }
    };

    return new Response(JSON.stringify(payload, null, 2), {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    });
  }
};
export interface JobBenchmark {
  scopeType: string;
  averageQaScore: number;
  averageCallbackRate: number;
  averageMarginLeakPercent: number;
  averageScheduleDelayDays: number;
}

export async function handleJobBenchmarkRequest(
  db: D1Database
): Promise<Response> {
  const benchmarks: JobBenchmark[] = [
    {
      scopeType: 'tub_to_shower',
      averageQaScore: 89,
      averageCallbackRate: 0.05,
      averageMarginLeakPercent: 4,
      averageScheduleDelayDays: 1
    },
    {
      scopeType: 'walk_in_tub',
      averageQaScore: 83,
      averageCallbackRate: 0.09,
      averageMarginLeakPercent: 9,
      averageScheduleDelayDays: 4
    }
  ];

  return new Response(JSON.stringify({ benchmarks }, null, 2), {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  });
}

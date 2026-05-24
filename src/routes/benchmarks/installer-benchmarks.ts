export interface InstallerBenchmark {
  installerId: string;
  averageQaScore: number;
  callbackRate: number;
  averageLaborVariancePercent: number;
  rank: number;
}

export async function handleInstallerBenchmarkRequest(
  db: D1Database
): Promise<Response> {
  const benchmarks: InstallerBenchmark[] = [
    {
      installerId: 'installer_lvl5_12',
      averageQaScore: 91,
      callbackRate: 0.03,
      averageLaborVariancePercent: 7,
      rank: 1
    },
    {
      installerId: 'installer_lvl4_07',
      averageQaScore: 84,
      callbackRate: 0.08,
      averageLaborVariancePercent: 14,
      rank: 2
    }
  ];

  return new Response(JSON.stringify({ benchmarks }, null, 2), {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  });
}

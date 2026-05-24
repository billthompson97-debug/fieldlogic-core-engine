export interface RuntimeContext {
  jobId: string;
  generatedAt: string;
  state?: Record<string, unknown>;
  telemetry: Record<string, unknown>[];
  memory: Record<string, unknown>[];
  signals: string[];
  recommendations: string[];
}

export function createRuntimeContext(jobId: string): RuntimeContext {
  return {
    jobId,
    generatedAt: new Date().toISOString(),
    telemetry: [],
    memory: [],
    signals: [],
    recommendations: []
  };
}

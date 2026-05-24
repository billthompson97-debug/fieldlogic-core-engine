export interface JobRecord {
  id: string;
  customerName?: string;
  address?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export class JobRepository {
  constructor(private db: D1Database) {}

  async create(job: JobRecord): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO jobs (id, customer_name, address, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        job.id,
        job.customerName ?? null,
        job.address ?? null,
        job.status,
        job.createdAt,
        job.updatedAt
      )
      .run();
  }

  async findById(jobId: string): Promise<JobRecord | null> {
    const result = await this.db
      .prepare(`SELECT * FROM jobs WHERE id = ? LIMIT 1`)
      .bind(jobId)
      .first<JobRecord>();

    return result ?? null;
  }
}

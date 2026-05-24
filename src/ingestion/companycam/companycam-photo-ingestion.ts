export interface CompanyCamPhotoPayload {
  photoId: string;
  jobId: string;
  projectId?: string;
  capturedAt: string;
  capturedBy?: string;
  tags: string[];
  url?: string;
}

export interface NormalizedPhotoEvent {
  id: string;
  type: 'qa.event.logged';
  jobId: string;
  occurredAt: string;
  capturedBy: string;
  source: 'companycam';
  payload: Record<string, unknown>;
}

export function normalizeCompanyCamPhoto(
  payload: CompanyCamPhotoPayload
): NormalizedPhotoEvent {
  return {
    id: `companycam_photo_${payload.photoId}`,
    type: 'qa.event.logged',
    jobId: payload.jobId,
    occurredAt: payload.capturedAt,
    capturedBy: payload.capturedBy ?? 'companycam_user',
    source: 'companycam',
    payload: {
      photoId: payload.photoId,
      projectId: payload.projectId,
      tags: payload.tags,
      photoUrl: payload.url,
      photoComplianceSignal: payload.tags.length > 0 ? 'tagged' : 'untagged'
    }
  };
}

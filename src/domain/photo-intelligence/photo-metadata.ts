export interface PhotoMetadata {
  photoId: string;
  jobId: string;
  capturedAt: string;
  capturedBy?: string;
  phase:
    | 'demo'
    | 'plumbing'
    | 'electrical'
    | 'substrate'
    | 'waterproofing'
    | 'wall_install'
    | 'glass_install'
    | 'finish'
    | 'qa';
  tags: string[];
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };
  aiLabels?: string[];
  qualityFlags?: string[];
}

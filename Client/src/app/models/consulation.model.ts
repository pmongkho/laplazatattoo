export interface ConsultationRequest {
  clientName: string;
  email: string;
  preferredArtistId?: number;
  style: string;
  placement: string;
  size: string;
  description: string;
  referenceImages: string[];
}

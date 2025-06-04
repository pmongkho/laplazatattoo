import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface ConsultationRequest {
  clientName: string;
  email: string;
  preferredArtistId?: number;
  style: string;
  placement: string;
  size: string;
  referenceImages: string[];
}

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  private apiUrl = `${environment.apiUrl}/consultation`;

  constructor(private http: HttpClient) {}

  submit(request: ConsultationRequest): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }

  getAll(): Observable<ConsultationRequest[]> {
    return this.http.get<ConsultationRequest[]>(this.apiUrl);
  }
}

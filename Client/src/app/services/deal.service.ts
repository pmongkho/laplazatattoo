import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Deal } from '../models/deal.model';

@Injectable({ providedIn: 'root' })
export class DealService {
  private apiUrl = `${environment.apiUrl}/deals`;

  constructor(private http: HttpClient) {}

  getDeals(): Observable<Deal[]> {
    return this.http.get<Deal[]>(this.apiUrl);
  }
}

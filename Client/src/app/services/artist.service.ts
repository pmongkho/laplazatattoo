import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Artist } from '../models/artist.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArtistService {
  private apiUrl = `${environment.apiUrl}/artists`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Artist[]> {
    return this.http.get<Artist[]>(this.apiUrl);
  }

  getById(id: number): Observable<Artist> {
    return this.http.get<Artist>(`${this.apiUrl}/${id}`);
  }

  searchByStyle(style: string): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.apiUrl}/search?style=${style}`);
  }
}

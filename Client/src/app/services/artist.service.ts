import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Artist } from '../models/artist.model'
import { Observable } from 'rxjs'
import { AuthService } from './auth.service'

@Injectable({ providedIn: 'root' })
export class ArtistService {
	private apiUrl = `${environment.apiUrl}/artists`

	constructor(private http: HttpClient, private authService: AuthService) {}

	getAll(): Observable<Artist[]> {
		return this.http.get<Artist[]>(this.apiUrl)
	}

	getById(id: string): Observable<Artist> {
		return this.http.get<Artist>(`${this.apiUrl}/${id}`)
	}

	searchByStyle(style: string): Observable<Artist[]> {
		return this.http.get<Artist[]>(`${this.apiUrl}/search?style=${style}`)
	}

	create(artist: Artist): Observable<Artist> {
		return this.http.post<Artist>(this.apiUrl, artist)
	}

	update(artist: Artist): Observable<Artist> {
		return this.http.put<Artist>(`${this.apiUrl}/${artist.id}`, artist)
	}

	delete(id: string): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/${id}`)
	}
	// New method to create an artist with FormData (including file upload)
	createArtist(payload: FormData): Observable<Artist> {
		const token = this.authService.getToken()
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
		// HttpClient automatically sets Content-Type to multipart/form-data for FormData
		return this.http.post<Artist>(
			`${environment.apiUrl}/admin/artists`,
			payload,
			{ headers }
		)
	}
}

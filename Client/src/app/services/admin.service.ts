import { Injectable } from '@angular/core'
import {
	HttpClient,
	HttpHeaders,
	HttpErrorResponse,
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Artist } from '../models/artist.model' // Assuming Artist model exists here
import { environment } from '../../environments/environment' // Assuming environment file exists
import {AuthService} from './auth.service'
import {Router} from '@angular/router'

@Injectable({
	providedIn: 'root',
})
export class AdminService {
	private apiUrl = `${environment.apiUrl}/admin/artists` // Base URL for artist endpoints

	constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

	// Helper method to get the auth token (replace with your actual auth service logic)
	private getAuthToken(): string | null {
		console.log('admin toke,', this.authService.getToken())
		console.log(
			'local storage in adminserv',
			localStorage.getItem('admin_auth_token')
		)
		return localStorage.getItem('admin_auth_token')
	}

	// Helper method to create HTTP options with authorization header
	private getHttpOptions(): { headers: HttpHeaders } {
		const token = this.getAuthToken()
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		})
		return { headers }
	}

	// Helper method to create HTTP options for FormData (no Content-Type header needed)
	private getHttpOptionsFormData(): { headers: HttpHeaders } {
		const token = this.getAuthToken()
		const headers = new HttpHeaders({
			Authorization: `Bearer ${token}`,
		})
		return { headers }
	}

	// Handle API errors
	private handleError(error: HttpErrorResponse): Observable<never> {
		let errorMessage = 'An unknown error occurred!'
		if (error.error instanceof ErrorEvent) {
			// Client-side errors
			errorMessage = `Error: ${error.error.message}`
		} else {
			// Server-side errors
			errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
			if (error.status === 401 || error.status === 403) {
				errorMessage =
					'Authentication or authorization failed. Please log in again.'
				// TODO: Redirect to login page or handle unauthorized access
				this.authService.logout() // <-- Uncomment or add this line
			}
		}
		console.error(errorMessage)
		return throwError(() => new Error(errorMessage))
	}

	/**
	 * Create a new artist (Admin endpoint)
	 * Accepts FormData for file upload.
	 * @param formData FormData containing artist data and image file
	 */
	createArtist(formData: FormData): Observable<Artist> {
		// HttpClient automatically sets Content-Type to multipart/form-data with FormData
		return this.http
			.post<Artist>(this.apiUrl, formData, this.getHttpOptionsFormData())
			.pipe(catchError(this.handleError))

	}

	/**
	 * Update an existing artist (Admin endpoint)
	 * Modified to accept FormData for file upload.
	 * Creating headers directly within the method call.
	 * @param id The ID of the artist to update
	 * @param formData FormData containing updated artist data and optional new image file
	 */
	updateArtist(id: string, formData: FormData): Observable<Artist> {
		const url = `${this.apiUrl}/${id}`
		const token = this.getAuthToken()
		const headers = new HttpHeaders({
			Authorization: `Bearer ${token}`,
			// Do NOT set Content-Type here. HttpClient will set it correctly for FormData.
		})

		// Send FormData for updates that might include a file
		return this.http
			.put<Artist>(url, formData, { headers: headers }) // Pass headers directly
			.pipe(catchError(this.handleError))
	}

	/**
	 * Delete an artist by ID (Admin endpoint)
	 * @param id The ID of the artist to delete
	 */
	deleteArtist(id: string): Observable<void> {
		const url = `${this.apiUrl}/${id}`
		return this.http
			.delete<void>(url, this.getHttpOptions())
			.pipe(catchError(this.handleError))
	}
}

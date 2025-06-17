import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {Router} from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private apiUrl = `${environment.apiUrl}/admin/auth`
	private tokenKey = 'admin_auth_token' // Key for storing the token

	constructor(private http: HttpClient, private router: Router) {}

	login(username: string, password: string): Observable<{ token: string }> {
		// Send login credentials to the backend
		return this.http
			.post<{ token: string }>(`${this.apiUrl}/login`, { username, password })
			.pipe(
				tap((response) => {
					// Store the token upon successful login
					localStorage.setItem(this.tokenKey, response.token)
					console.log('Login successful, token stored.')
				})
			)
	}

	getToken(): string | null {
		// Retrieve the token from local storage
		console.log(
			'Retrieving token from local storage.',
			localStorage.getItem(this.tokenKey)
		)
		return localStorage.getItem(this.tokenKey)
	}

	logout(): void {
		// Remove the token from local storage on logout
		localStorage.removeItem(this.tokenKey)
		console.log('Logged out, token removed.')
		this.router.navigate(['/admin/login'])
	}

	// Optional: Check if the user is authenticated (basic check)
	isAuthenticated(): boolean {
		const token = this.getToken()
		// You might want to add more robust checks here, like checking token expiry
		return !!token
	}
}
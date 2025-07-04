import { Injectable } from '@angular/core'
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from '@angular/common/http'
import { Observable } from 'rxjs'
import {environment} from '../../../../../environments/environment'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor() {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		// Get the auth token from local storage
		const token = localStorage.getItem('adminToken')

		// Only add the token to admin API requests
		if (token && request.url.includes(`${environment.apiUrl}/admin`)) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`,
				},
			})
		}

		return next.handle(request)
	}
}

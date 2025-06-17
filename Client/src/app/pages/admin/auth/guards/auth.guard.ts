// Client/src/app/guards/admin-auth.guard.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core' // Import PLATFORM_ID and Inject
import { isPlatformBrowser } from '@angular/common' // Import isPlatformBrowser
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
	Router,
} from '@angular/router'
import { Observable } from 'rxjs'
import {AuthService} from '../../../../services/auth.service'

@Injectable({
	providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
	private isBrowser: boolean // Property to store platform check result

	constructor(
		private authService: AuthService,
		private router: Router,
		@Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
	) {
		this.isBrowser = isPlatformBrowser(this.platformId) // Check if running in browser
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		// Check if in browser environment before accessing AuthService methods that use localStorage
		if (this.isBrowser) {
			if (this.authService.isAuthenticated()) {
				// User is authenticated and in browser, allow access
				return true
			} else {
				// User is not authenticated but in browser, redirect to login
				console.warn(
					'Access denied: User is not authenticated for admin route.'
				)
				return this.router.createUrlTree(['/admin/login'], {
					queryParams: { returnUrl: state.url },
				})
			}
		} else {
			// Not in browser environment, deny access and do not attempt localStorage access
			console.warn('Access denied: Not in browser environment.')
			// In a non-browser environment, we deny access.
			// The login route itself has platform checks, so redirecting there is safe.
			return this.router.createUrlTree(['/admin/login'], {
				queryParams: { returnUrl: state.url },
			})
		}
	}
}

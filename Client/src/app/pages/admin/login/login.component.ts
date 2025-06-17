import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { first } from 'rxjs/operators'
import { AuthService } from '../../../services/auth.service'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { isPlatformBrowser } from '@angular/common'
import { PLATFORM_ID, Inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Component({
	selector: 'app-admin-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
})
export class AdminLoginComponent implements OnInit {
	loginForm!: FormGroup
	loading = false
	submitted = false
	error = ''
	returnUrl: string = '/admin/dashboard'

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private authService: AuthService,
		@Inject(PLATFORM_ID) private platformId: Object,
		private http: HttpClient
	) {}

	ngOnInit(): void {
		this.loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required],
		})

		if (
			isPlatformBrowser(this.platformId) &&
			this.authService.isAuthenticated()
		) {
			this.router.navigate(['/admin/dashboard'])
		}
		this.returnUrl =
			this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard'
	}

	get f() {
		return this.loginForm.controls
	}

	onSubmit(): void {
		this.submitted = true

		if (this.loginForm.invalid) {
			return
		}

		this.loading = true
		this.authService
			.login(this.f['username'].value, this.f['password'].value)
			.pipe(first())
			.subscribe({
				next: () => {
					this.router.navigate([this.returnUrl])
				},
				error: (error) => {
					this.error = 'Invalid username or password'
					this.loading = false
				},
			})
	}
}

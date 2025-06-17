import { Routes } from '@angular/router'
import { ArtistsComponent } from './pages/artists/artists'
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component'
import {AdminLoginComponent} from './pages/admin/login/login.component'
import {AdminAuthGuard} from './auth/guards/auth.guard'

export const routes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./pages/home/home').then((m) => m.HomeComponent),
	},
	{ path: 'artists', component: ArtistsComponent },
	{
		path: 'artists/:id',
		loadComponent: () =>
			import('./pages/artists/artist-profile/artist-profile').then(
				(m) => m.ArtistProfileComponent
			),
	},
	{
		path: 'consultation',
		loadComponent: () =>
			import('./pages/consultation/consultation').then(
				(m) => m.ConsultationComponent
			),
	},
	{
		path: 'deals',
		loadComponent: () =>
			import('./pages/deal/deal').then((m) => m.DealsComponent),
	},
	{
		path: 'admin/dashboard',
		component: DashboardComponent,
		canActivate: [AdminAuthGuard], // Add the guard here
	},
	{
		path: 'admin/login',
		component: AdminLoginComponent,
	},
]

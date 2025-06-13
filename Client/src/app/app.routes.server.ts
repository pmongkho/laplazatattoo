import { RenderMode, ServerRoute } from '@angular/ssr'
import { ArtistService } from './services/artist.service'
import { inject } from '@angular/core' // Import inject
import { firstValueFrom } from 'rxjs' // Import firstValueFrom
import { Artist } from '../app/models/artist.model' // Import Artist model

export const serverRoutes: ServerRoute[] = [
	{
		path: 'artists/:id',
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			const artistService = inject(ArtistService) // Inject ArtistService
			const artists = await firstValueFrom(artistService.getAll()) // Call instance method and convert Observable to Promise
			return artists.map((artist: Artist) => ({ id: artist.id.toString() })) // Map artists to route params, type parameter, convert id to string
		},
	},
	{
		path: '**',
		renderMode: RenderMode.Prerender,
	},
]

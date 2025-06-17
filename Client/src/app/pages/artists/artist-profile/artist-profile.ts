import {
	Component,
	OnInit,
	AfterViewInit,
	Renderer2,
	Inject,
} from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ArtistService } from '../../../services/artist.service'
import { Artist } from '../../../models/artist.model'
import { CommonModule } from '@angular/common'
import { DOCUMENT } from '@angular/common'

// Add this at the top of your file
declare global {
	interface Window {
		instgrm?: {
			Embeds: {
				process(): void
			}
		}
	}
}

@Component({
	selector: 'app-artist-profile',
	templateUrl: './artist-profile.html',
	standalone: true,
	imports: [CommonModule],
})
export class ArtistProfileComponent implements OnInit, AfterViewInit {
	artist: Artist | null = null

	constructor(
		private route: ActivatedRoute,
		private artistService: ArtistService,
		private renderer: Renderer2,
		@Inject(DOCUMENT) private document: Document
	) {}

	ngOnInit(): void {
		const id = this.route.snapshot.paramMap.get('id') as string
		this.artistService.getById(id).subscribe((a) => {
			this.artist = a
			// After artist data is loaded, we'll load the Instagram script in ngAfterViewInit
		})
	}

	ngAfterViewInit(): void {
		// Wait a bit to ensure the DOM is ready with the artist data
		setTimeout(() => {
			this.loadInstagramEmbedScript()
		}, 1000)
	}

	private loadInstagramEmbedScript(): void {
		// Check if script already exists to avoid duplicates
		if (this.document.getElementById('instagram-embed-script')) {
			// If it exists, we need to trigger a reload of the Instagram embed
			if (window['instgrm']) {
				window['instgrm'].Embeds.process()
			}
			return
		}

		// Create script element
		const script = this.renderer.createElement('script')
		script.id = 'instagram-embed-script'
		script.src = 'https://www.instagram.com/embed.js'
		script.async = true
		script.defer = true

		// Append to body
		this.renderer.appendChild(this.document.body, script)
	}
}

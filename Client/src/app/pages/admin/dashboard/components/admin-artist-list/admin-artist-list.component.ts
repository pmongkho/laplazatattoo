import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Artist } from '../../../../../models/artist.model'

@Component({
	selector: 'app-admin-artist-list',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './admin-artist-list.component.html',
})
export class AdminArtistListComponent {
	@Input() artists: Artist[] = []
	@Output() editArtistClicked = new EventEmitter<Artist>()
	@Output() deleteArtistClicked = new EventEmitter<Artist>()

	onEditClick(artist: Artist): void {
		this.editArtistClicked.emit(artist)
	}

	// Placeholder method for deleting an artist
	deleteArtist(artist: Artist): void {
		console.log('Delete Artist clicked:', artist)
		// TODO: Implement actual delete logic (e.g., show confirmation, call adminService.deleteArtist(artist.id))
		alert(`Delete artist: ${artist.name} (Not implemented yet)`)
	}
}

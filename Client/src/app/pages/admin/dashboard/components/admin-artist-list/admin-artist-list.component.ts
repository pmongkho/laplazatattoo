import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Artist } from '../../../../../models/artist.model'
import {AdminService} from '../../../../../services/admin.service'

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


  constructor(private adminService: AdminService){}
	onEditClick(artist: Artist): void {
		this.editArtistClicked.emit(artist)
	}

	// Placeholder method for deleting an artist
	deleteArtist(artist: Artist): void {
    console.log('Emitting deleteArtistClicked', artist)
    
    // this.adminService.deleteArtist(artist.id)
      this.deleteArtistClicked.emit(artist)

	// 	alert(`Delete artist: ${artist.name} (Not implemented yet)`)
	}
}

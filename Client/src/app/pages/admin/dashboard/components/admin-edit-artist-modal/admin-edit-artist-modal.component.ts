import { Component, Input, Output, EventEmitter } from '@angular/core' // Ensure EventEmitter is imported
import { Artist } from '../../../../../models/artist.model'
import {AdminService} from '../../../../../services/admin.service'
import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'

@Component({
	selector: 'app-admin-edit-artist-modal',
	standalone: true,
	imports: [CommonModule, FormsModule], // Add imports if needed
	templateUrl: './admin-edit-artist-modal.component.html',
	styleUrl: './admin-edit-artist-modal.component.css',
})
export class AdminEditArtistModalComponent {
	// --- Modal Visibility Properties ---
	showEditArtistModal = false

	// --- Selected Item Properties ---
	selectedArtist: Artist | null = null

	// --- Edit Artist Form Properties ---
	editArtistImageFile: File | null = null
	selectedArtistImageFile: File | null = null
	isSubmittingEditArtist = false
	editArtistSubmissionError: any = null
	editArtistSubmissionSuccess = false

	@Input() showModal: boolean = false
	@Input() artist: Artist | null = null // Input for the artist data
	@Output() closeModal = new EventEmitter<void>()
	@Output() artistUpdated = new EventEmitter<Artist>() // Add this Output property

	// ... existing properties (selectedArtistImageFile, isSubmittingEditArtist, etc.) ...
	// Note: selectedArtist property might be removed if you use the @Input() artist directly or copy it internally

	constructor(private adminService: AdminService) {
		// ... constructor logic ...
	}
	// Method to open the Edit Artist modal
	editArtist(artist: Artist): void {
		console.log('Edit Artist clicked:', artist)
		this.selectedArtist = { ...artist } // Create a copy to avoid modifying the list directly
		this.selectedArtistImageFile = null // Reset selected file for edit modal
		this.isSubmittingEditArtist = false
		this.editArtistSubmissionError = null
		this.editArtistSubmissionSuccess = false
		this.showEditArtistModal = true
	}

	// --- Edit Artist Form Methods ---

	// Method to close the Edit Artist modal

	onFileSelectedForEditArtist(event: any): void {
		const files: FileList | null = event.target.files
		if (files && files.length > 0) {
			this.selectedArtistImageFile = files[0]
			console.log('Selected file for edit:', this.selectedArtistImageFile)
		} else {
			this.selectedArtistImageFile = null
			console.log('No file selected for edit.')
		}
	}

	onSubmitEditArtist(): void {
		if (!this.artist) {
			// Use the @Input() artist
			console.error('No artist selected for editing.')
			return
		}

		this.isSubmittingEditArtist = true
		this.editArtistSubmissionError = null
		this.editArtistSubmissionSuccess = false

		const formData = new FormData()
		// ... append form data from this.artist ...
		formData.append('name', this.artist.name)
		formData.append('styles', this.artist.styles)
		formData.append('bio', this.artist.bio)
		if (this.artist.instagramHandle) {
			formData.append('instagramHandle', this.artist.instagramHandle)
		}
		if (this.artist.bookingUrl) {
			formData.append('bookingUrl', this.artist.bookingUrl)
		}
		formData.append('featured', this.artist.featured.toString())

		if (this.selectedArtistImageFile) {
			formData.append(
				'imageFile',
				this.selectedArtistImageFile,
				this.selectedArtistImageFile.name
			)
		}

		// Use the adminService method to update the artist with FormData
		this.adminService.updateArtist(this.artist.id, formData).subscribe({
			// Use this.artist.id
			next: (response) => {
				console.log('Artist updated successfully', response)
				this.editArtistSubmissionSuccess = true
				this.isSubmittingEditArtist = false
				// REMOVE: this.loadArtists(); // Don't call parent method directly
				// REMOVE: this.closeEditArtistModal(); // Don't call parent method directly
				this.artistUpdated.emit(response) // Emit the event on success
				this.closeModal.emit() // Also emit close event
			},
			error: (err) => {
				console.error('Error updating artist:', err)
				this.editArtistSubmissionError =
					'Failed to update artist. Please try again.'
				this.isSubmittingEditArtist = false
			},
		})
	}

	// Modify closeEditArtistModal to emit closeModal
	closeEditArtistModal(): void {
		console.log('Close Edit Artist modal clicked')
		this.closeModal.emit() // Emit close event
		// Clearing selectedArtist and selectedArtistImageFile can happen here or in the parent
	}
}

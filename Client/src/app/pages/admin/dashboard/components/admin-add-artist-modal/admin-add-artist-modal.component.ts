import {Artist} from '../../../../../models/artist.model'
import { Component, Input, Output, EventEmitter } from '@angular/core'; // Ensure EventEmitter is imported
import {AdminService} from '../../../../../services/admin.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';


@Component({
	selector: 'app-admin-add-artist-modal',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './admin-add-artist-modal.component.html',
})
export class AdminAddArtistModalComponent {
	showAddArtistForm = false // Using form directly as a modal for Add Artist
	// --- Add New Artist Form Properties ---
	newArtist: Artist = {
		id: '00000000-0000-0000-0000-000000000000', // Placeholder for Guid
		name: '',
		styles: '',
		bio: '',
		instagramHandle: '',
		bookingUrl: '',
		featured: false,
		image: '', // This will store the URL after upload
	}

	// New Artist Form Properties
	newArtistImageFile: File | null = null
	isSubmittingArtist = false
	artistSubmissionError: any = null
	artistSubmissionSuccess = false

	@Input() showModal: boolean = false
	@Output() closeModal = new EventEmitter<void>()
	@Output() artistAdded = new EventEmitter<Artist>() // Add this Output property

	// ... existing properties (newArtist, newArtistImageFile, isSubmittingArtist, etc.) ...

	constructor(private adminService: AdminService) {
		// ... constructor logic ...
	}

	// Method to open the Add New Artist form/modal
	addNewArtist(): void {
		console.log('Add New Artist button clicked - Open Add Artist Modal')
		this.showAddArtistForm = true // Show the inline form/modal
		this.resetNewArtistForm()
	}

	// --- Add New Artist Form Methods ---

	resetNewArtistForm(): void {
		this.newArtist = {
			id: '00000000-0000-0000-0000-000000000000',
			name: '',
			styles: '',
			bio: '',
			instagramHandle: '',
			bookingUrl: '',
			featured: false,
			image: '',
		}
		this.newArtistImageFile = null
		this.isSubmittingArtist = false
		this.artistSubmissionError = null
		this.artistSubmissionSuccess = false
	}

	onFileSelectedForArtist(event: any): void {
		const files: FileList | null = event.target.files
		if (files && files.length > 0) {
			this.newArtistImageFile = files[0]
			console.log('Selected artist image file:', this.newArtistImageFile)
		} else {
			this.newArtistImageFile = null
			console.log('No artist image file selected.')
		}
	}

	onSubmitNewArtist(): void {
		this.isSubmittingArtist = true
		this.artistSubmissionError = null
		this.artistSubmissionSuccess = false

		const formData = new FormData()
		// ... append form data ...
		formData.append('name', this.newArtist.name)
		formData.append('styles', this.newArtist.styles)
		formData.append('bio', this.newArtist.bio)
		if (this.newArtist.instagramHandle) {
			formData.append('instagramHandle', this.newArtist.instagramHandle)
		}
		if (this.newArtist.bookingUrl) {
			formData.append('bookingUrl', this.newArtist.bookingUrl)
		}
		formData.append('featured', this.newArtist.featured.toString())
		if (this.newArtistImageFile) {
			formData.append(
				'imageFile',
				this.newArtistImageFile,
				this.newArtistImageFile.name
			)
		}

		this.adminService.createArtist(formData).subscribe({
			next: (response) => {
				console.log('Artist submitted successfully', response)
				this.artistSubmissionSuccess = true
				this.isSubmittingArtist = false
				// REMOVE: this.loadArtists(); // Don't call parent method directly
				// REMOVE: this.cancelAddArtist(); // Don't call parent method directly
				this.artistAdded.emit(response) // Emit the event on success
				this.closeModal.emit() // Also emit close event
			},
			error: (err) => {
				console.error('Error submitting artist:', err)
				this.artistSubmissionError = 'Failed to add artist. Please try again.'
				this.isSubmittingArtist = false
			},
		})
	}

	// Modify cancelAddArtist to emit closeModal
	cancelAddArtist(): void {
		console.log('Cancel Add Artist clicked')
		this.resetNewArtistForm()
		this.closeModal.emit() // Emit close event
	}
}

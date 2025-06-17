import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms' // Import FormsModule for ngModel
import { Router } from '@angular/router' // Import Router

// Services
import { ConsultationService } from '../../../services/consultation.service'
import { AdminService } from '../../../services/admin.service' // Import AdminService

// Models
import { Artist } from '../../../models/artist.model'
import { ConsultationDisplay } from '../../../models/consulation.model'
import {ArtistService} from '../../../services/artist.service'
import {AuthService} from '../../../services/auth.service'

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	imports: [CommonModule, FormsModule], // Add FormsModule here
	standalone: true,
})
export class DashboardComponent implements OnInit {
	// --- Component State Properties ---
	isLoading = true
	error: any = null
	activeTab: string = 'consultation' // Default active tab

	// --- Data Properties ---
	consultations: ConsultationDisplay[] = []
	artists: Artist[] = []

	// --- Modal Visibility Properties ---
	showViewConsultationModal = false
	showAddArtistForm = false // Using form directly as a modal for Add Artist
	showEditArtistModal = false
	showAddUserModal = false // Property for Add User Modal

	// --- Selected Item Properties ---
	selectedConsultation: ConsultationDisplay | null = null
	selectedArtist: Artist | null = null

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

	// --- Edit Artist Form Properties ---
	editArtistImageFile: File | null = null
	selectedArtistImageFile: File | null = null
	isSubmittingEditArtist = false
	editArtistSubmissionError: any = null
	editArtistSubmissionSuccess = false

	// --- Constructor ---
	constructor(
		private consultationService: ConsultationService,
		private adminService: AdminService, // Inject AdminService
		private router: Router, // Inject Router
		private artistService: ArtistService, // Inject ArtistService
		protected authService: AuthService
	) {}

	// --- Lifecycle Hooks ---
	ngOnInit(): void {
		// Load data based on the initial active tab
		if (this.activeTab === 'artistManagement') {
			this.loadArtists()
		} else {
			this.loadConsultations()
		}
	}

	// --- Tab Management Methods ---
	setActiveTab(tab: string): void {
		this.activeTab = tab
		// Load data when switching tabs
		if (this.activeTab === 'artistManagement') {
			this.loadArtists()
		} else {
			this.loadConsultations()
		}
	}

	// --- Data Loading Methods ---
	loadArtists(): void {
		this.artistService.getAll().subscribe({
			next: (data) => {
				this.artists = data
				console.log('Loaded artists:', this.artists)
			},
			error: (err) => {
				console.error('Error loading artists:', err)
				// TODO: Implement better error handling for artist loading
			},
		})
	}

	loadConsultations(): void {
		this.isLoading = true // Use isLoading for consultations
		this.error = null // Clear previous consultation errors
		this.consultationService.getAll().subscribe({
			next: (data) => {
				this.consultations = data
				this.isLoading = false
				console.log('Loaded consultations:', this.consultations)
			},
			error: (err) => {
				this.error = err // Set consultation error
				this.isLoading = false
				console.error('Error loading consultations:', err)
				// TODO: Implement better error handling for consultation loading
			},
		})
	}

	// --- Consultation Management Methods ---

	// Method to open the View Consultation Details modal
	viewDetails(consultation: ConsultationDisplay): void {
		console.log('View Details clicked:', consultation)
		this.selectedConsultation = consultation
		this.showViewConsultationModal = true
	}

	// Method to close the View Consultation Details modal
	closeViewConsultationModal(): void {
		console.log('Close View Consultation modal clicked')
		this.showViewConsultationModal = false
		this.selectedConsultation = null // Clear selected consultation on close
	}

	// Placeholder method for archiving a consultation
	archiveConsultation(consultation: ConsultationDisplay): void {
		console.log('Archive Consultation clicked:', consultation)
		// TODO: Implement actual archive logic (e.g., show confirmation, call service)
		alert(
			`Archive consultation from: ${consultation.clientName} (Not implemented yet)`
		)
	}

	// --- Artist Management Methods ---

	// Method to open the Add New Artist form/modal
	addNewArtist(): void {
		console.log('Add New Artist button clicked - Open Add Artist Modal')
		this.showAddArtistForm = true // Show the inline form/modal
		this.resetNewArtistForm()
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

	// Placeholder method for deleting an artist
	deleteArtist(artist: Artist): void {
		console.log('Delete Artist clicked:', artist)
		// TODO: Implement actual delete logic (e.g., show confirmation, call adminService.deleteArtist(artist.id))
		alert(`Delete artist: ${artist.name} (Not implemented yet)`)
	}

	// --- Add New Artist Form Methods ---

	cancelAddArtist(): void {
		console.log('Cancel Add Artist clicked')
		this.showAddArtistForm = false // Hide the inline form/modal
		this.resetNewArtistForm()
	}

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

		// Append artist data
		formData.append('name', this.newArtist.name)
		formData.append('styles', this.newArtist.styles)
		formData.append('bio', this.newArtist.bio)
		// Append optional fields only if they have values
		if (this.newArtist.instagramHandle) {
			formData.append('instagramHandle', this.newArtist.instagramHandle)
		}
		if (this.newArtist.bookingUrl) {
			formData.append('bookingUrl', this.newArtist.bookingUrl)
		}
		formData.append('featured', this.newArtist.featured.toString())

		// Append the image file if selected
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
				this.loadArtists() // Reload artists after successful submission
				this.cancelAddArtist() // Close the modal on success
			},
			error: (err) => {
				console.error('Error submitting artist:', err)
				this.artistSubmissionError = 'Failed to add artist. Please try again.' // Set a user-friendly error message
				this.isSubmittingArtist = false
			},
		})
	}

	// --- Edit Artist Form Methods ---

	// Method to close the Edit Artist modal
	closeEditArtistModal(): void {
		console.log('Close Edit Artist modal clicked')
		this.showEditArtistModal = false
		this.selectedArtist = null // Clear selected artist on close
		this.selectedArtistImageFile = null // Clear selected file
	}

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
		if (!this.selectedArtist) {
			console.error('No artist selected for editing.')
			return
		}

		this.isSubmittingEditArtist = true
		this.editArtistSubmissionError = null
		this.editArtistSubmissionSuccess = false

		const formData = new FormData()

		// Append artist data from the selectedArtist object
		// Ensure property names match the backend AdminArtistUpdateModel
		formData.append('name', this.selectedArtist.name)
		formData.append('styles', this.selectedArtist.styles)
		formData.append('bio', this.selectedArtist.bio)
		// Append optional fields only if they have values
		if (this.selectedArtist.instagramHandle) {
			formData.append('instagramHandle', this.selectedArtist.instagramHandle)
		}
		if (this.selectedArtist.bookingUrl) {
			formData.append('bookingUrl', this.selectedArtist.bookingUrl)
		}
		formData.append('featured', this.selectedArtist.featured.toString())

		// Append the new image file if selected
		if (this.selectedArtistImageFile) {
			formData.append(
				'imageFile',
				this.selectedArtistImageFile,
				this.selectedArtistImageFile.name
			)
		}
		// Note: The backend expects the ID in the route, not the form data.
		// We get the ID from this.selectedArtist.id for the service call.

		// Use the adminService method to update the artist with FormData
		this.adminService.updateArtist(this.selectedArtist.id, formData).subscribe({
			next: (response) => {
				console.log('Artist updated successfully', response)
				this.editArtistSubmissionSuccess = true
				this.isSubmittingEditArtist = false
				this.loadArtists() // Reload artists after successful update
				// Optionally close the modal after success
				this.closeEditArtistModal();
			},
			error: (err) => {
				console.error('Error updating artist:', err)
				this.editArtistSubmissionError =
					'Failed to update artist. Please try again.' // Set a user-friendly error message
				this.isSubmittingEditArtist = false
			},
		})
	}

	// --- User Management Methods ---


	closeAddUserModal(): void {
		this.showAddUserModal = false
	}

	// --- Generic Modal Management Methods (Can be refactored if more modals are added) ---
	// These seem redundant with specific close methods, consider removing if not used elsewhere
	// openViewConsultationModal(consultation: ConsultationDisplay): void {
	// 	this.selectedConsultation = consultation;
	// 	this.showViewConsultationModal = true;
	// }

	// openEditArtistModal(artist: Artist): void {
	// 	this.selectedArtist = artist;
	// 	this.showEditArtistModal = true;
	// }

	// openAddUserModal(): void {
	// 	this.showAddUserModal = true;
	// }
}

import { ConsultationService } from '../../../services/consultation.service'
import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ArtistService } from '../../../services/artist.service'
import { Artist } from '../../../models/artist.model'
import { ConsultationDisplay } from '../../../models/consulation.model'
import { environment } from '../../../../environments/environment'
import { FormsModule } from '@angular/forms' // Import FormsModule for ngModel
import { switchMap } from 'rxjs/operators' // Import switchMap
import { of } from 'rxjs' // Import of
import { Router } from '@angular/router' // Import Router

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	imports: [CommonModule, FormsModule], // Add FormsModule here
	standalone: true,
})
export class DashboardComponent implements OnInit {
	consultations: ConsultationDisplay[] = []
	artists: Artist[] = []
	isLoading = true
	error: any = null
	activeTab: string = 'consultations'

	// Properties for Add New Artist form (used directly in HTML for simplicity)
	showAddArtistForm = false
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
	newArtistImageFile: File | null = null
	isSubmittingArtist = false
	artistSubmissionError: any = null
	artistSubmissionSuccess = false

	// Properties for Modals
	showViewConsultationModal = false
	selectedConsultation: ConsultationDisplay | null = null

	showEditArtistModal = false
	selectedArtist: Artist | null = null

	showAddUserModal = false // Property for Add User Modal
	constructor(
		private consultationService: ConsultationService,
		private artistService: ArtistService,
		private router: Router // Inject Router
	) {}

	ngOnInit(): void {
		// Load data based on the initial active tab
		if (this.activeTab === 'artistManagement') {
			this.loadArtists()
		} else {
			this.loadConsultations()
		}
	}

	// Method to open the Edit Artist modal
	editArtist(artist: Artist): void {
		console.log('Edit Artist clicked:', artist)
		this.selectedArtist = artist
		this.showEditArtistModal = true
	}

	// Method to close the Edit Artist modal
	closeEditArtistModal(): void {
		console.log('Close Edit Artist modal clicked')
		this.showEditArtistModal = false
		this.selectedArtist = null // Clear selected artist on close
	}

	// Placeholder method for deleting an artist
	deleteArtist(artist: Artist): void {
		console.log('Delete Artist clicked:', artist)
		// TODO: Implement actual delete logic (e.g., show confirmation, call service)
		alert(`Delete artist: ${artist.name} (Not implemented yet)`)
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

	// --- User Management Methods ---

	// Method to open the Add New User modal
	addNewUser(): void {
		console.log('Add New User button clicked - Open Add User Modal')
		this.showAddUserModal = true
		// TODO: Implement actual user creation form/logic
	}

	// --- Modal Management Methods ---

	openViewConsultationModal(consultation: ConsultationDisplay): void {
		this.selectedConsultation = consultation
		this.showViewConsultationModal = true
	}

	openEditArtistModal(artist: Artist): void {
		this.selectedArtist = artist
		this.showEditArtistModal = true
	}

	openAddUserModal(): void {
		this.showAddUserModal = true
	}

	closeAddUserModal(): void {
		this.showAddUserModal = false
	}

	loadArtists(): void {
		this.artistService.getAll().subscribe({
			next: (data) => {
				this.artists = data
				console.log('Loaded artists:', this.artists)
			},
			error: (err) => {
				console.error('Error loading artists:', err)
				// Handle error loading artists, maybe set an artistError property
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
			},
		})
	}

	setActiveTab(tab: string): void {
		this.activeTab = tab
		// Load data when switching tabs
		if (this.activeTab === 'artistManagement') {
			this.loadArtists()
		} else {
			this.loadConsultations()
		}
	}

	// --- Artist Management Methods ---

	addNewArtist(): void {
		console.log('Add New Artist button clicked - Open Add Artist Modal')
		this.showAddArtistForm = true // Show the inline form/modal
		this.resetNewArtistForm()
	}

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

		// Use the new service method
		this.artistService.createArtistWithPhoto(formData).subscribe({
			next: (response) => {
				console.log('Artist submitted successfully', response)
				this.artistSubmissionSuccess = true
				this.isSubmittingArtist = false
				this.loadArtists() // Reload artists after successful submission
				this.router.navigate(['/home']) // Navigate to home page
			},
		})
	}
}

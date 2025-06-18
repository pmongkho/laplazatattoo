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
import { ArtistService } from '../../../services/artist.service'
import { AuthService } from '../../../services/auth.service'
import { AdminArtistListComponent } from './components/admin-artist-list/admin-artist-list.component'
import { AdminConsultationListComponent } from './components/admin-consultation-list/admin-consultation-list.component'
import { AdminAddArtistModalComponent } from './components/admin-add-artist-modal/admin-add-artist-modal.component'
import { AdminViewConsultationModalComponent } from './components/admin-view-consultation-modal/admin-view-consultation-modal.component'
import { AdminEditArtistModalComponent } from './components/admin-edit-artist-modal/admin-edit-artist-modal.component'

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	imports: [
		CommonModule,
		FormsModule,
		AdminArtistListComponent, // Ensure list components are imported
		AdminConsultationListComponent,
		AdminAddArtistModalComponent, // Add modal components here
		AdminEditArtistModalComponent,
		AdminViewConsultationModalComponent,
	],
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

	// --- Modal Visibility Properties (Keep these in DashboardComponent) ---
	showViewConsultationModal = false
	showModal = false // Renamed from showModal

	// --- Data for Modals (Keep these in DashboardComponent to pass as Inputs) ---
	selectedConsultation: ConsultationDisplay | null = null
	selectedArtist: Artist | null = null // Keep this to pass to edit modal

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

	// --- Methods to Open Modals (Keep and modify in DashboardComponent) ---

	viewDetails(consultation: ConsultationDisplay): void {
		console.log('View Details clicked:', consultation)
		this.selectedConsultation = consultation // Set data for the modal
		this.showViewConsultationModal = true // Show the modal
	}

	addNewArtist(): void {
		console.log('Add New Artist button clicked - Open Add Artist Modal')
		this.showModal = true // Show the modal
		// The modal component will handle its own newArtist state
	}

	editArtist(artist: Artist): void {
		console.log('Edit Artist clicked:', artist)
		this.selectedArtist = { ...artist } // Set data for the modal (pass a copy)
		this.showModal = true // Show the modal
	}

	// --- Methods to Handle Events from Modals (Add these to DashboardComponent) ---

	onViewConsultationModalClosed(): void {
		console.log('View Consultation modal closed')
		this.showViewConsultationModal = false
		this.selectedConsultation = null // Clear selected data
	}

	onAddArtistModalClosed(): void {
		console.log('Add Artist modal closed')
		this.showModal = false
		// No need to clear newArtist here, modal component manages it
	}

	onArtistAdded(newArtist: Artist): void {
		// Listen for the artistAdded event
		console.log('Artist added successfully:', newArtist)
		this.loadArtists() // Refresh the artist list
		// The modal should emit closeModal as well, handled by onAddArtistModalClosed
	}

	onEditArtistModalClosed(): void {
		console.log('Edit Artist modal closed')
		this.showModal = false
		this.selectedArtist = null // Clear selected data
	}

	onArtistUpdated(updatedArtist: Artist): void {
		// Listen for the artistUpdated event
		console.log('Artist updated successfully:', updatedArtist)
		this.loadArtists() // Refresh the artist list
		// The modal should emit closeModal as well, handled by onEditArtistModalClosed
	}

	// --- Placeholder Methods (Keep in DashboardComponent for now) ---
	archiveConsultation(consultation: ConsultationDisplay): void {
		console.log('Archive Consultation clicked:', consultation)
		// TODO: Implement actual archive logic (e.g., show confirmation, call service)
		alert(
			`Archive consultation from: ${consultation.clientName} (Not implemented yet)`
		)
		// If archive logic is moved to modal/service, this method would call that and then loadConsultations()
	}

	deleteArtist(artist: Artist): void {
		// 1. Confirm (optional)
		if (!confirm(`Are you sure you want to delete ${artist.name}?`)) return

		// 2. Call the service and subscribe
		this.adminService.deleteArtist(artist.id).subscribe({
			next: () => {
				console.log('Deleted artist:', artist)
				// 3. Remove from local array or reload artists
				this.artists = this.artists.filter((a) => a.id !== artist.id)
				// Or: this.loadArtists();
			},
			error: (err) => {
				console.error('Delete failed', err)
				alert('Delete failed: ' + (err?.message || err))
			},
		})
	}

	// --- Add User Modal (Logic exists, but HTML not provided) ---
	showAddUserModal = false // Keep this property

	closeAddUserModal(): void {
		// Keep this method
		this.showAddUserModal = false
	}

	// --- Generic Modal Management Methods (Can likely be removed) ---
	// Remove these if they are not used
	// openViewConsultationModal(consultation: ConsultationDisplay): void { ... }
	// openEditArtistModal(artist: Artist): void { ... }
	// openAddUserModal(): void { ... }

	// --- Generic Modal Management Methods (Can be refactored if more modals are added) ---
	// These seem redundant with specific close methods, consider removing if not used elsewhere
	// openViewConsultationModal(consultation: ConsultationDisplay): void {
	// 	this.selectedConsultation = consultation;
	// 	this.showViewConsultationModal = true;
	// }

	// openEditArtistModal(artist: Artist): void {
	// 	this.selectedArtist = artist;
	// 	this.showModal = true;
	// }

	// openAddUserModal(): void {
	// 	this.showAddUserModal = true;
	// }
}

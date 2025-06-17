import { Component, OnInit } from '@angular/core'
import { Artist } from '../../models/artist.model'
import { CommonModule, NgPlural } from '@angular/common'
import { ArtistService } from '../../services/artist.service'
import { ConsultationService } from '../../services/consultation.service'
import { FormsModule } from '@angular/forms'
import { isUndefined } from 'util'
import {ConsultationSubmission} from '../../models/consulation.model'

@Component({
	selector: 'app-consultation',
	templateUrl: './consultation.html',
	imports: [CommonModule, FormsModule],
	standalone: true,
})
export class ConsultationComponent implements OnInit {
	artists: Artist[] = []
	formData: ConsultationSubmission = {
		clientName: '',
		email: '',
		preferredArtist: undefined,
		style: '',
		placement: '',
		size: '',
		description: '',
		referenceImages: [],

	}
	submitted = false
	selectedFiles: File[] = [] // Property to hold selected files

	constructor(
		private consultationService: ConsultationService,
		private artistService: ArtistService
	) {}

	ngOnInit(): void {
		this.artistService.getAll().subscribe((data) => (this.artists = data))
	}
	onFileSelected(event: any): void {
		console.log('File input change event triggered.') // Add this log
		// Get the files from the input event
		const files: FileList | null = event.target.files
		if (files) {
			this.selectedFiles = Array.from(files)
			console.log('Selected files:', this.selectedFiles) // Add this log
			// You might want to add validation here (file types, size)
		} else {
			this.selectedFiles = []
			console.log('No files selected.') // Add this log
		}
	}

	submitForm(): void {
		// Create FormData object
		const formData = new FormData()

		// Append form data fields
		formData.append('clientName', this.formData.clientName)
		formData.append('email', this.formData.email)
		// Handle optional fields, check for null/undefined before appending
		if (this.formData.preferredArtist) {
			formData.append('preferredArtist', this.formData.preferredArtist)
		}
		formData.append('style', this.formData.style)
		formData.append('placement', this.formData.placement)
		formData.append('size', this.formData.size)
		if (this.formData.description) {
			formData.append('description', this.formData.description)
		}
		console.log('Form data fields appended.') // Add this log

		console.log(
			`Attempting to append ${this.selectedFiles.length} files to FormData.`
		) // Add this log
		for (const file of this.selectedFiles) {
			console.log(`Appending file: ${file.name} with key 'referenceImages'.`) // Add this log
			formData.append('referenceImages', file, file.name) // Verify key name here
		}
		console.log('Files appended to FormData.') // Add this log

		// Call the service with FormData
		this.consultationService.submit(formData).subscribe({
			// Note: submit method needs to accept FormData
			next: (response) => {
				console.log('Consultation submitted successfully', response)
				this.submitted = true
				this.selectedFiles = [] // Clear selected files on success
				// Optionally reset form data
			},
			error: (error) => {
				console.error('Error submitting consultation', error)
				// Handle error
			},
		})
	}
}

import { Component, Input, Output, EventEmitter } from '@angular/core' // Import Input, Output, EventEmitter
import { ConsultationDisplay } from '../../../../../models/consulation.model'
import { CommonModule } from '@angular/common'

@Component({
	selector: 'app-admin-view-consultation-modal',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './admin-view-consultation-modal.component.html',
})
export class AdminViewConsultationModalComponent {
	// --- Inputs (Received from parent DashboardComponent) ---
	@Input() showModal: boolean = false // Controls if the modal is visible
	@Input() consultation: ConsultationDisplay | null = null // The consultation data to display

	// --- Outputs (Emitted to parent DashboardComponent) ---
	@Output() closeModal = new EventEmitter<void>() // Emits when the modal should be closed
	@Output() archiveConsultationClicked = new EventEmitter<ConsultationDisplay>() // Emits when archive is clicked

	// --- Methods ---

	// Method to close the modal - emits the closeModal event
	onCloseModal(): void {
		console.log('Close View Consultation modal clicked')
		this.closeModal.emit() // Emit the event
		// Clearing the consultation data will be handled by the parent component
	}

	// Method to handle the Archive button click - emits the archiveConsultationClicked event
	onArchiveClick(): void {
		if (this.consultation) {
			console.log('Archive Consultation clicked in modal:', this.consultation)
			this.archiveConsultationClicked.emit(this.consultation) // Emit the event with the consultation data
			// The parent component will handle the actual archiving logic and closing the modal
		}
	}

	// --- Consultation Management Methods ---

	// Method to open the View Consultation Details modal





}

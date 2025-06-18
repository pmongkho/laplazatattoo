import { Component, Input, Output, EventEmitter
  	}
  
from '@angular/core'
import { CommonModule } from '@angular/common'
import { ConsultationDisplay } from '../../../../../models/consulation.model'
@Component({
	selector: 'app-admin-consultation-list',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './admin-consultation-list.component.html',
})
export class AdminConsultationListComponent {
	private _consultations: ConsultationDisplay[] = []

	@Input() set consultations(value: ConsultationDisplay[]) {
		this._consultations = value
		for (const consultation of this._consultations) {
			if (
				consultation.referenceImages &&
				consultation.referenceImages.length > 0 &&
				!consultation.selectedImageUrl
			) {
				consultation.selectedImageUrl = consultation.referenceImages[0]
			}
		}
	}
	get consultations(): ConsultationDisplay[] {
		return this._consultations
	}
	@Input() isLoading: boolean = false
	@Input() error: any = null

	@Output() viewConsultationClicked = new EventEmitter<ConsultationDisplay>()
	@Output() archiveConsultationClicked = new EventEmitter<ConsultationDisplay>()

	selectImage(consultation: ConsultationDisplay, imageUrl: string): void {
		consultation.selectedImageUrl = imageUrl
	}

	onViewDetailsClick(consultation: ConsultationDisplay): void {
		this.viewConsultationClicked.emit(consultation)
	}

	onArchiveConsultationClick(consultation: ConsultationDisplay): void {
		this.archiveConsultationClicked.emit(consultation)
	}
}

import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ConsultationDisplay } from '../../../../../models/consulation.model'

@Component({
	selector: 'app-admin-consultation-list',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './admin-consultation-list.component.html',
})
export class AdminConsultationListComponent {
	@Input() consultations: ConsultationDisplay[] = []
	@Input() isLoading: boolean = false
	@Input() error: any = null

	@Output() viewConsultationClicked = new EventEmitter<ConsultationDisplay>()
	@Output() archiveConsultationClicked = new EventEmitter<ConsultationDisplay>()

	onViewDetailsClick(consultation: ConsultationDisplay): void {
		this.viewConsultationClicked.emit(consultation)
	}

	onArchiveConsultationClick(consultation: ConsultationDisplay): void {
		this.archiveConsultationClicked.emit(consultation)
	}
}

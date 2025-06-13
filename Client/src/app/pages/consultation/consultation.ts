import { Component, OnInit } from '@angular/core';
import { Artist } from '../../models/artist.model';
import { CommonModule } from '@angular/common';
import { ConsultationRequest } from '../../models/consulation.model';
import { ArtistService } from '../../services/artist.service';
import { ConsultationService } from '../../services/consultation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.html',
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class ConsultationComponent implements OnInit {
  artists: Artist[] = [];
  formData: ConsultationRequest = {
    clientName: '',
    email: '',
    preferredArtistId: undefined,
    style: '',
    placement: '',
    size: '',
    description: '',
    referenceImages: []
  };
  submitted = false;

  constructor(private consultationService: ConsultationService, private artistService: ArtistService) {}

  ngOnInit(): void {
    this.artistService.getAll().subscribe(data => this.artists = data);
  }

  submitForm() {
    // Fixed the syntax error by removing the extra dot
    this.consultationService.submit(this.formData).subscribe(() => this.submitted = true);
  }
}

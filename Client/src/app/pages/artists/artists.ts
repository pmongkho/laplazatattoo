import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Artist } from '../../models/artist.model';
import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.html',
  standalone: true,
  imports: [CommonModule]
})
export class ArtistsComponent implements OnInit {
  artists: Artist[] = [];

  constructor(private artistService: ArtistService) {}

  ngOnInit(): void {
    this.artistService.getAll().subscribe(data => {
      this.artists = data;
    });
  }
}

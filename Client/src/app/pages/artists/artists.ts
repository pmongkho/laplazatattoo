import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Artist } from '../../models/artist.model';
import { ArtistService } from '../../services/artist.service';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.html',
  standalone: true,
  imports: [CommonModule,RouterModule]
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

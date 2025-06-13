import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../../services/artist.service';
import { DealService } from '../../services/deal.service';
import { Artist } from '../../models/artist.model';
import { Deal } from '../../models/deal.model';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [CommonModule,RouterModule],
})
export class HomeComponent implements OnInit {
  featuredArtists: Artist[] = [];
  deals: Deal[] = [];

  constructor(private artistService: ArtistService, private dealService: DealService) {}

  ngOnInit(): void {
    this.artistService.getAll().subscribe(data => {
      this.featuredArtists = data.filter(a => a.featured);
    });

    this.dealService.getDeals().subscribe(data => this.deals = data.slice(0, 2));
  }
}

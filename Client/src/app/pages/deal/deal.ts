import { Component, OnInit } from '@angular/core';
import { DealService } from '../../services/deal.service';
import { Deal } from '../../models/deal.model';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-deals',
  templateUrl: './deal.html',
  imports: [CommonModule,RouterModule],
  standalone: true,
})
export class DealsComponent implements OnInit {
  deals: Deal[] = [];

  constructor(private dealService: DealService) {}

  ngOnInit(): void {
    this.dealService.getDeals().subscribe(data => this.deals = data);
  }
}

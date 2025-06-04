import { Routes } from '@angular/router';
import { ArtistsComponent } from './pages/artists/artists';

export const routes: Routes = [
{
  path: '',
  loadComponent: () => import('./pages/home/home')
    .then(m => m.HomeComponent)
}  ,
{ path: 'artists', component: ArtistsComponent },
  {
    path: 'artists/:id',
    loadComponent: () => import('./pages/artists/artist-profile/artist-profile')
      .then(m => m.ArtistProfileComponent)
  },
  {
  path: 'consultation',
  loadComponent: () => import('./pages/consultation/consultation')
    .then(m => m.ConsultationComponent)
},
{
  path: 'deals',
  loadComponent: () => import('./pages/deal/deal')
    .then(m => m.DealsComponent)
},
];

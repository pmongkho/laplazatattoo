import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav';
import {Banner} from './components/banner/banner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, Banner],
  templateUrl: './app.html',
})
export class App {
  protected title = 'La Plaza Tattoo & Art Gallery';
}

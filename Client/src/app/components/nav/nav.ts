import {CommonModule} from '@angular/common'
import { Component } from '@angular/core'
import {RouterModule} from '@angular/router'

@Component({
	selector: 'app-nav',
	templateUrl: './nav.html',
	imports: [CommonModule, RouterModule],
})
export class NavComponent {
	isMenuOpen = false

	closeMenu() {
		this.isMenuOpen = false
	}

	toggleMenu() {
		this.isMenuOpen = !this.isMenuOpen
	}
}

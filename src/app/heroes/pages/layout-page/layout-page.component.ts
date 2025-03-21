import { Component } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-layout-page',
  standalone: false,
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {
  public sidebarItems = [
    { label: 'Listado', icon: 'label', url: '/heroes/list' },
    { label: 'Añadir', icon: 'add', url: './new-heroe' },
    { label: 'Buscar', icon: 'search', url: '/heroes/search' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get user(): User | undefined {
    return this.authService.getcurrentUser();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }
}
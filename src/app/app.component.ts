import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router) {}

  isHeroFormRouteActive(): boolean {
    return this.router.url === '/hero-form';
  }

  isHeroListRouteActive(): boolean {
    return this.router.url === '/hero-list';
  }

}








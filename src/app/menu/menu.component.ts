import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  public showButton: boolean = true;
  public showMenu: boolean = false;
  public navItems = [
    { section: 'hero-list', routerLink: '/hero-list', icon: 'HEROLIST', label: 'Hero List' },
    { section: 'hero-form', routerLink: '/hero-form', icon: 'HEROFORM', label: 'Hero form' },
  ];

  constructor( ) { }

  ngOnInit(): void {
    window.addEventListener('resize', () => {
      this.checkScreenWidth();
    });
    this.checkScreenWidth();
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  checkScreenWidth() {
    if (window.innerWidth < 991) {
      this.showButton = true;
      this.showMenu = false;
    } else {
      this.showButton = false;
      this.showMenu = true;
    }
  }
}

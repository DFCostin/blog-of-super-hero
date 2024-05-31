import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HeroService } from '../hero.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.css'
})

export class HeroListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public heroes: any[] = [];
  public heroesOriginal: any[] = [];
  public displayedColumns: string[] = ['id', 'name', 'gender', 'race', 'alignment', 'publisher', 'img', 'actions'];
  public pageSizeOptions: number[] = [];
  public isLoading = true;

  constructor(private router: Router, private route: ActivatedRoute, private heroService: HeroService) { }

  ngOnInit(): void {
    this.getSuperheroes();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    if (filterValue === '') {
      this.heroes = [...this.heroesOriginal];
    } else {
      this.heroes = this.heroesOriginal.filter(hero => 
        Object.values(hero).some(value => 
          (typeof value === 'string' || typeof value === 'number') && 
          value.toString().toLowerCase().includes(filterValue)
        )
      );
    }
  
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
  
  getSuperheroes(): void {
    this.isLoading = true; 
    this.heroService.getHeroes().subscribe(
      data => {
        this.heroesOriginal = data.results;
        this.heroes = this.heroesOriginal.filter(hero => hero.name.toLowerCase())
          .map(hero => {
            return {
              ...hero,
              name: hero.name.charAt(0).toUpperCase() + hero.name.slice(1)
            };
          });

        const totalHeroes = this.heroesOriginal.length;

        this.pageSizeOptions = this.calculatePageSizeOptions(totalHeroes);
        this.isLoading = false;
        console.log(this.heroes);
      },
      error => {
        this.isLoading = false;
        console.error('Error al obtener los héroes:', error);
      }
    );
  }

  calculatePageSizeOptions(totalItems: number): number[] {
    const defaultPageSizeOptions = [5, 10, 25, 100];
    const maxPageSize = Math.ceil(totalItems / defaultPageSizeOptions[0]);
    return defaultPageSizeOptions.filter(option => option <= maxPageSize);
  }

  deleteHero(hero: any): void {
    const respuesta = confirm(`Are you sure to delete: ${hero.name} ?`);
    if (respuesta) {
      this.heroes = this.heroes.filter(h => h.id !== hero.id);
      this.heroesOriginal = this.heroesOriginal.filter(h => h.id !== hero.id);
      alert(` ${hero.name} was delete`);
    }
  }

  editHero(hero: any): void {
    this.router.navigate(['../hero-form', hero.id], { relativeTo: this.route });
  }

  createHero(): void {
    this.router.navigate(['../hero-form'], { relativeTo: this.route });
  }

}
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { HeroService } from '../hero.service';


@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule,
     MatSortModule, 
    MatPaginatorModule
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.css'
})

export class HeroListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public heroes: any[] = [];
  public heroesOriginal: any[] = [];
  public displayedColumns: string[] = ['id', 'name'];

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getSuperheroes();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
 
  if (filterValue === '') {
    this.heroes = [...this.heroesOriginal];
  } else {
    this.heroes = this.heroesOriginal.filter(hero => hero.name.toLowerCase().includes(filterValue));
  }
  
  if (this.paginator) {
    this.paginator.firstPage();
  }

  }
  

  getSuperheroes(): void {
    this.heroService.getHeroes().subscribe(
      data => {
        this.heroesOriginal = data.results; 
        this.heroes = [...this.heroesOriginal];
        console.log(this.heroes); 
      },
      error => {
        console.error('Error al obtener los héroes:', error);
      }
    );
  }
  
}
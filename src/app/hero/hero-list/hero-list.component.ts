import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeroService } from '../hero.service';
import { Hero } from '../hero.interface';
import { MatButtonModule } from '@angular/material/button';

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
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.css']
})
export class HeroListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public dataSource: MatTableDataSource<Hero> = new MatTableDataSource();
  public displayedColumns: string[] = ['id', 'name', 'gender', 'race', 'alignment', 'publisher', 'img', 'actions'];
  public pageSizeOptions: number[] = [];
  public isLoading = true;

  constructor(private router: Router, private route: ActivatedRoute, private heroService: HeroService) { }

  ngOnInit(): void {
    this.loadHeroes();
  }

  loadHeroes(): void {
    const storedHeroes = localStorage.getItem('heroes');
    if (storedHeroes) {
      const heroes = JSON.parse(storedHeroes).map((hero: Hero) => ({
        ...hero,
        name: hero.name.charAt(0).toUpperCase() + hero.name.slice(1).toLowerCase()
      }));
      this.setHeroesData(heroes);
    } else {
      this.getSuperheroes();
    }
  }

  setHeroesData(heroes: Hero[]): void {
    this.dataSource.data = heroes;
    const totalHeroes = heroes.length;
    this.pageSizeOptions = this.calculatePageSizeOptions(totalHeroes);
    this.isLoading = false;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getSuperheroes(): void {
    this.isLoading = true;
    this.heroService.getHeroes().subscribe(
      data => {
        const heroes = data.map((hero: any) => ({
          id: hero.id,
          name: hero.name.charAt(0).toUpperCase() + hero.name.slice(1).toLowerCase(),
          gender: hero.appearance.gender,
          race: hero.appearance.race,
          alignment: hero.biography.alignment,
          publisher: hero.biography.publisher,
          img: hero.image.url
        }));
        this.setHeroesData(heroes);
        localStorage.setItem('heroes', JSON.stringify(heroes));
      },
      error => {
        this.isLoading = false;
        alert('Error getting heroes.');
        console.error('Error getting heroes:', error);
      }
    );
  }

  calculatePageSizeOptions(totalItems: number): number[] {
    const defaultPageSizeOptions = [5, 10, 25, 100];
    const maxPageSize = Math.ceil(totalItems / defaultPageSizeOptions[0]);
    return defaultPageSizeOptions.filter(option => option <= maxPageSize);
  }

  deleteHero(hero: Hero): void {
    const confirmDelete = confirm(`Are you sure to delete: ${hero.name}?`);
    if (confirmDelete) {
      this.heroService.deleteHero(hero.id);
      this.loadHeroes();
    }
  }

  editHero(hero: Hero): void {
    const dataHero = {
      id: hero.id,
      name: encodeURIComponent(hero.name),
      gender: encodeURIComponent(hero.gender),
      race: encodeURIComponent(hero.race),
      alignment: encodeURIComponent(hero.alignment),
      publisher: encodeURIComponent(hero.publisher),
      img: encodeURIComponent(hero.img)
    };
    this.router.navigate(['../hero-form', dataHero], { relativeTo: this.route });
  }

  createHero(): void {
    this.router.navigate(['../hero-form'], { relativeTo: this.route });
  }

  clearDate(): void {
    this.heroService.clearLocalStorage();
    this.dataSource.filter = '';
    this.loadHeroes();
  }
}

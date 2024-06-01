import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Hero } from './hero.interface';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private apiUrl = `https://www.superheroapi.com/api.php/2fc632c162f048c834371300191524ac/search/all`;
  private heroes: Hero[] = this.loadHeroesFromLocalStorage();
  private heroesSubject: BehaviorSubject<Hero[]> = new BehaviorSubject<Hero[]>(this.heroes);

  constructor(private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.results as Hero[]),
      catchError(this.handleError)
    );
  }

  obtainLastId(): Observable<number> {
    const heroes = this.loadHeroesFromLocalStorage();
    const ultimoID = heroes.reduce((maxID: number, hero: Hero) => {
      const heroID = +hero.id;
      return heroID > maxID ? heroID : maxID;
    }, 0);
    return of(ultimoID);
  }

  addHero(hero: Hero) {
    this.heroes.push(hero);
    this.saveHeroesToLocalStorage();
    this.heroesSubject.next(this.heroes);
  }

  clearLocalStorage() {
    localStorage.removeItem('heroes');
    this.heroes = [];
    this.getHeroes().subscribe(
      heroes => {
        const formattedHeroes = heroes.map((hero: any) => ({
          id: hero.id,
          name: hero.name.charAt(0).toUpperCase() + hero.name.slice(1).toLowerCase(),
          gender: hero.appearance.gender,
          race: hero.appearance.race,
          alignment: hero.biography.alignment,
          publisher: hero.biography.publisher,
          img: hero.image.url
        }));
        this.heroes = formattedHeroes;
        this.saveHeroesToLocalStorage();
        this.heroesSubject.next(this.heroes);
      },
      error => {
        console.error('Failed to fetch heroes:', error);
      }
    );
  }

  updateHero(updatedHero: Hero): void {
    if (!Array.isArray(this.heroes)) {
      this.heroes = [];
    }

    const index = this.heroes.findIndex(hero => hero.id === updatedHero.id);
    if (index !== -1) {
      this.heroes[index] = updatedHero;
      this.saveHeroesToLocalStorage();
      this.heroesSubject.next(this.heroes);
    } else {
      console.error(`Hero with id ${updatedHero.id} not found.`);
    }
  }

  deleteHero(heroId: number): void {
    this.heroes = this.heroes.filter(hero => hero.id !== heroId);
    this.saveHeroesToLocalStorage();
    this.heroesSubject.next(this.heroes);
  }

  getHeroesObservable(): Observable<Hero[]> {
    return this.heroesSubject.asObservable();
  }

  private saveHeroesToLocalStorage() {
    localStorage.setItem('heroes', JSON.stringify(this.heroes));
  }

  private loadHeroesFromLocalStorage(): Hero[] {
    const storedHeroes = localStorage.getItem('heroes');
    return storedHeroes ? JSON.parse(storedHeroes) : [];
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Error code ${error.status}, ` +
        `message: ${error.error}`
      );
    }
    return throwError('An error occurred while fetching data from the SuperHero API');
  }
}

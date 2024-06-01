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

  getHeroes(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  obtainLastId(): Observable<number> {
    const heroes = this.loadHeroesFromLocalStorage();
    const ultimoID = heroes.reduce((maxID: number, hero: Hero) => {
      const heroID = hero.id;
      return heroID > maxID ? heroID : maxID;
    }, 0);
    return of(ultimoID);
  }

  addHero(hero: Hero) {
    const heroesWithIds = this.loadHeroesFromLocalStorage();
    heroesWithIds.push(hero);
    localStorage.setItem('heroes', JSON.stringify(heroesWithIds));
    this.heroesSubject.next(heroesWithIds);
  }

  clearLocalStorage() {
    localStorage.removeItem('heroes');
    this.heroes = [];
    this.heroesSubject.next(this.heroes);
  }

  updateHero(updatedHero: Hero): void {
    const updatedHeroes = this.heroes.map(hero => {
      if (hero.id === updatedHero.id) {
        return updatedHero;
      } else {
        return hero;
      }
    });
    this.heroes = updatedHeroes;
    localStorage.setItem('heroes', JSON.stringify(updatedHeroes));
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

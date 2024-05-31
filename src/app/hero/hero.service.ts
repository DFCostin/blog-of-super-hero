import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private apiUrl = `https://www.superheroapi.com/api.php/2fc632c162f048c834371300191524ac/search/all`;
  
  constructor(private http: HttpClient) {}

  getHeroes(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Ocurrió un error:', error.error.message);
    } else {
      console.error(
        `Código de error ${error.status}, ` +
        `mensaje: ${error.error}`
      );
    }
    return throwError('Ocurrió un error al obtener datos de la API de SuperHero');
  }
}

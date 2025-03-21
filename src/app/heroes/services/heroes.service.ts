import { catchError, map, Observable, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interfaces';
import { enviroments } from '../../../enviroments/enviroments';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HeroesService {
  private baseUrl: string = enviroments.baseUrl;

  constructor(private http: HttpClient) {} //permite hacer solicitudes HTTP

  getHeroes(): Observable<Hero[]> {
    //metodo que obtiene la lista de héroes
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  getHeroById(id: string): Observable<Hero | undefined> {
    //Metodo que obtiene un heroe especifico basado en su ID
    //Retorna un observable que puede ser un Hero o "undefined" (si no existe el hero)
    return this.http
      .get<Hero>(`${this.baseUrl}/heroes/${id}`)

      .pipe(
        //Se usa pipe para procesar el resultado de la peticion
        catchError((error) => of(undefined))
      );
    //Si ocurre un error devuelve "undefined"
  }
  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`);
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero);
  }

  //Actualiza datos de un heroe en la base de datos, recibe un objeto Hero y actualiza sus datos en la Api
  updateHero(hero: Hero): Observable<Hero> {
    if (!hero.id) throw Error('Hero is required');
    //Validacion antes de hacer la petición
    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
  }

  //Elimina un heroe por id
  deleteHeroById(id: string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/heroes/${id}`).pipe(
      catchError((err) => of(false)),
      map((resp) => true)
    );
  }

  /*
       addHero(hero: Hero): Observable<Hero> {
        return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero);
      }
        updateHero(hero: Hero) {
        return this.http.put<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
      }
        

      deleteHero(id: string) {
        return this.http.delete(`${this.baseUrl}/heroes/${id}`);
      }
      */
}

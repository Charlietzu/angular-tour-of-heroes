import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  /** Define the heroesUrl of the form :base/:collectionName with the address of the heroes resource on the server. 
   * Here base is the resource to which requests are made, 
   * and collectionName is the heroes data object in the in-memory-data-service.ts.*/
  private heroesUrl = 'api/heroes'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

  constructor(private messageService: MessageService,
              private http: HttpClient) { }

  /**returns observable of hero arrays
   * the tap method look the flow of the observable valeus and send a message via the log method*/
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }
  /** getHero() constructs a request URL with the desired hero's id
   * The server responds with a single hero
   * getHero() returns an Observable<Hero> ("an observable of Hero objects") 
  */
  getHero(id: number): Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string){
    this.messageService.add(`HeroService: ${message}`);
  }

  /**PUT: update the hero on the server
   * it takes three parameters: the URL, the data to update(the modified hero) and the options
   */
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /**POST: add a new hero to the server 
   * this method differs from updateHero() in two ways:
   * it calls httpClient.post() instead of put()
   * it expects the server to generate an id for the new hero, which it returns in the Observable<Hero> 
   * to the caller
  */
  addHero (hero: Hero): Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
  /**DELETE: delete the hero from the server
   * note the following key points:
   * deleteHero() calls httpClient.delete()
   * the URL is the heroes resource URL plus the id of the hero to delete
   * you don't send data as you did with put() and post()
   * you still send the httpOptions
   */
  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero: hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    )
  }
  /*GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()){
      //if not search term, return empty hero array.
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {

     // TODO: send the error to remote logging infrastructure
     console.error(error); // log to console instead

     // TODO: better job of transforming error for user consumption
     this.log(`${operation} failed: ${error.message}`);
 
     // Let the app keep running by returning an empty result.
     return of(result as T);
    }
  }

}

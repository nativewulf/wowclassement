import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';

import { Player } from './player';
//import { PLAYERS } from './mock-players';

import { MessageService } from './message.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError, map, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PlayerService {
private playersUrl = 'api/players';

httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }



getPlayers(): Observable<Player[]> {
return this.http.get<Player[]>(this.playersUrl)
.pipe(
  tap(_=>this.log(`fetched players`)),
  catchError(this.handleError<Player[]>('getPLayers', []))
);
}

  /** GET hero by id. Return `undefined` when id not found */
  getPlayerNo404<Data>(id: number): Observable<Player> {
    const url = `${this.playersUrl}/?id=${id}`;
    return this.http.get<Player[]>(url)
      .pipe(
        map(players => players[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} player id=${id}`);
        }),
        catchError(this.handleError<Player>(`getPlayer id=${id}`))
      );
  }

getPlayer(id: number): Observable<Player>{
  const url = `${this.playersUrl}/${id}`;
  return this.http.get<Player>(url).pipe(
    tap(_=>this.log(`player by id=${id}`)),
    catchError(this.handleError<Player>(`getPlayer id=${id}`))

  );
}

searchPlayers(term : string): Observable<Player[]>{
  if(!term.trim()){
    return of ([]);
  }
  return this.http.get<Player[]>(`${this.playersUrl}/?name=${term}`).pipe(
    tap(_=>this.log(`joueur trouve "${term}"`)),
    catchError(this.handleError<Player[]>('searchPlayers', []))
  );
}

updatePlayer (player: Player): Observable<any> {
  return this.http.put(this.playersUrl, player,
    this.httpOptions).pipe(
      tap(_ =>this.log(`updated player id=${player.id}`)),
      catchError(this.handleError<any>(`updatePlayer`))
    );
}

addPlayer (player: Player): Observable<Player> {
  return this.http.post<Player>(this.playersUrl, player,
    this.httpOptions).pipe(
      tap((newPlayer: Player) => this.log(`added player w/id=${newPlayer.id}`)),
      catchError(this.handleError<Player>('addPlayer'))
    );
}

deletePlayer (player: Player): Observable<Player>{
  const id = typeof player === 'number' ? player : player.id;
  const url =`${this.playersUrl}/${id}`;

  return this.http.delete<Player>(url, this.httpOptions).pipe(
    tap(_=>this.log(`deleted player id=${id}`)),
    catchError(this.handleError<Player>('deletePlayer'))
  );
}


  private log (message:string){
    this.messageService.add(`PlayerService:${message}`);
  }

  private handleError<T> (operation = 'operation', result?:T){
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed : ${error.message}`);
      return of (result as T);

    };
  }
}

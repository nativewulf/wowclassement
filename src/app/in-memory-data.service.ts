import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Player } from './player';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService {

  createDb(){
    const players = [
      {id :11, name :'darknight'},
      {id :23, name :'RIO'},
      {id :45, name :'TOKYO'},
      {id :67, name :'NAIROBI'},
      {id :78, name :'PROFESSOR'}

    ];
    return {players};
  }

  genId(players: Player[]):number{
    return players.length> 0 ? Math.max(...players.map(player => player.id)) + 1 : 11;
  }
  constructor() { }
}

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Storage} from '@ionic/storage-angular';
@Injectable({
  providedIn: 'root'
})
export class TriviaService {

  //constructor for HTTP client, taking in url for the API
  constructor(private httpClient:HttpClient) {}
    GetQuestion():Observable<any>{
     return this.httpClient.get("https://opentdb.com/api.php?amount=1");
     
    }
    //random integer function for randomising answer placement
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
}
export class StorageService {
  private _storage :Storage | null = null;
  constructor(private storage: Storage){
    this.init();
  }
  async init() {
    
    const storage = await this.storage.create();
    this._storage = storage;
  }

  
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }
}


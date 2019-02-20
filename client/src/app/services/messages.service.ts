import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';

@Injectable()
export class MessageService {
  public url: String;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  addMessage(token, message): Observable<any> {
    const params = JSON.stringify(message);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', token);
    return this._http.post(this.url + 'message', params, {headers: headers});
  }

  getMyMessages(token, page = 1): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', token);
    return this._http.get(this.url + 'received-messages/' + page , {headers: headers});
  }

  getEmitMessages(token, page = 1): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', token);
    return this._http.get(this.url + 'emit-messages/' + page , {headers: headers});
  }
}

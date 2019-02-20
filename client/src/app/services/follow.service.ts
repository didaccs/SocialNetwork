import { Follow } from './../models/follow';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable  } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class FollowService {
    public url: string;

    constructor( public _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    addFollow(token, follow): Observable<any> {
        const params = JSON.stringify(follow);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

        return this._http.post(this.url + 'follow', params, {headers: headers});
    }

    deleteFollow(token, id): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

        return this._http.delete(this.url + 'follow/' + id, {headers: headers});
    }

    getFollowing(token, userId, page): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);
        let url = this.url + 'following/' + '/' + page;
        if (userId != null) {
            url = this.url + 'following/' + userId + '/' + page;
        }
        return this._http.get( url, {headers: headers});
    }

    getFollowed(token, userId, page): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);
        let url = this.url + 'followed/' + '/' + page;
        if (userId != null) {
            url = this.url + 'followed/' + userId + '/' + page;
        }
        return this._http.get( url, {headers: headers});
    }

    getMyFollows(token): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
        return this._http.get(this.url + 'get-my-follows/true', {headers: headers});
    }
}

import { Follow } from './../../models/follow';
import { FollowService } from './../../services/follow.service';
import { UserService } from './../../services/user.service';
import { User } from './../../models/user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'followed',
    templateUrl: 'followed.component.html',
    providers: [UserService, FollowService]
})
export class FollowedComponent implements OnInit {
    public title: string;
    public identity;
    public token;
    public page;
    public nextPage;
    public prevPage;
    public status: string;
    public total;
    public pages;
    public users: User[];
    public url: string;
    public follows;
    public followUserOver;
    public followed;
    public userPageId;
    public user: User;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    ) {
        this.title = 'Seguidores de ';
        this.identity = this._userService.getIdentity();
        this.token = _userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('Component cargado');
        this.actualPage();
    }

    actualPage() {
        this._route.params.subscribe(params => {
            const user_id = params['id'];
            this.userPageId = user_id;
            let page = +params['page'];
            if (!page) {
                page = 1;
            }
            this.page = page;
            if (!page) {
                page = 1;
            } else {
                this.nextPage = page + 1;
                this.prevPage = page - 1;

                if (this.prevPage <= 0) {
                    this.prevPage = 1;
                }
            }

            this.getUser(user_id, page);
        });
    }

    getFollows(user_id, page) {
        this._followService.getFollowed(this.token, user_id, page).subscribe(
            response => {
                if (!response.follows) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    this.total = response.total;
                    this.pages = response.pages;
                    this.followed = response.follows;
                    this.follows = response.users_following;

                    if (page > this.pages) {
                        this._router.navigate(['/gente',1]);
                    }
                }
            },
            error => {
                const errorMensaje = <any> error;
                console.log(errorMensaje);
                if (errorMensaje != null) {
                    this.status = 'error';
                }
            }
        );
    }

    getUser(user_id, page) {
        this._userService.getUser(user_id).subscribe(
            response => {
              console.log(response);
                if (response.user) {
                    this.user = response.user;
                    this.getFollows(user_id, page);
                } else {
                    this._router.navigate(['/home']);
                }
            },
            error => {
                const errorMensaje = <any> error;
                console.log(errorMensaje);
                if (errorMensaje != null) {
                    this.status = 'error';
                }
            }
        );
    }

    mouseEnter(user_id) {
        this.followUserOver = user_id;
    }
    mouseLeave(user_id) {
        this.followUserOver = 0;
    }

    followUser(followed) {
        const follow = new Follow('', this.identity._id, followed);

        this._followService.addFollow(this.token, follow).subscribe(
            response => {
                console.log(response);
                if (!response) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    this.follows.push(followed);
                }
            },
            error => {
                const errorMensaje = <any> error;
                console.log(errorMensaje);
                if (errorMensaje != null) {
                    this.status = 'error';
                }
            }
        );
    }

    unFollowUser(followed){
        this._followService.deleteFollow(this.token, followed).subscribe(
            response => {
                console.log(response);
                if(!response){
                    this.status='error';
                }
                else{
                    this.status = 'success';
                    var search  = this.follows.indexOf(followed);
                    if (search!=-1) {
                        this.follows.splice(search, 1);   
                    }                    
                }
            },
            error=>{
                var errorMensaje = <any> error;
                console.log(errorMensaje);
                if (errorMensaje!= null) {
                    this.status = 'error';
                }
            }
        );
    }
}

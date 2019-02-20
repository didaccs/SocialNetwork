import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { User } from "../../models/user";



@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers: [UserService]
})
export class LoginComponent implements OnInit{
    public title:string;
    public user:User;
    public status:string;
    public identity;
    public token;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ) {
        this.title = 'Identificate';
        this.user = new User("","","","","","ROLE_USER","");
    }

    ngOnInit(){
        console.log('Login cargado');
    }

    onSubmit() {
        this._userService.signUp(this.user).subscribe(
            response => {
                this.identity = response.user;
                if (!this.identity || !this.identity._id) {
                    this.status = 'error';
                } else {
                    // guardar usuario en localsotrage
                    localStorage.setItem('identity', JSON.stringify(this.identity));

                    // Conseguir el token
                    this.getToken();
                }

                console.log(response.user);
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

    getToken() {
        this._userService.signUp(this.user, 'true').subscribe(
            response => {
                this.token = response.token;
                if (this.token.length <= 0) {
                    this.status = 'error';
                } else {
                    // localsotrage
                    localStorage.setItem('token', this.token);

                    // contadores o estadisticas
                    this.getCounters();
                }

                console.log(response.token);
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

    getCounters() {
        this._userService.getCounters().subscribe(
            response => {
               localStorage.setItem('stats', JSON.stringify(response));
               this.status = 'success';
               this._router.navigate(['/']);
            },
            error => {
                console.log(error);
            }
        );
    }
}
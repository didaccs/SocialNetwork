import { UserService } from './../../services/user.service';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    providers:[UserService]
})
export class RegisterComponent implements OnInit{
    public title:string;
    public user:User;
    public status: string;

    constructor(
        private _route: ActivatedRoute,
        private _router:Router,
        private _userService:UserService
    ){
        this.title = 'Registrate';
        this.user = new User("","","","","","ROLE_USER","");
    }

    ngOnInit(){
        console.log('Register cargado');
    }

    onSubmit(form){
        this._userService.register(this.user).subscribe(
            response => {
                if (response.user && response.user._id) {                    
                    this.status = 'success';
                    form.reset();
                }
                else{
                    this.status='error';
                }
            },
            error=>{
                console.log(<any>error)
            }
        );
    }
}
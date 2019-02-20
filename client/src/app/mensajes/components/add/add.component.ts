import { Message } from './../../../models/message';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FollowService } from './../../../services/follow.service';
import { OnInit, Component } from '@angular/core';
import { MessageService } from '../../../services/messages.service';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';

@Component({
  selector: 'add',
  templateUrl: './add.component.html',
  providers: [ FollowService, MessageService, UserService ]
})
export class AddComponent implements OnInit {
  public title: String;
  public message: Message;
  public identity;
  public token;
  public url: String;
  public status;
  public follows;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _followService: FollowService,
    private _messageService: MessageService,
    private _userService: UserService
  ) {
    this.title = 'Enviar mensaje';
    this.identity = _userService.getIdentity();
    this.token = _userService.getToken();
    this.message = new Message('', '', '', '', this.identity._id, '');
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('add cargado');
    this.getMyFollows();
  }

  onSubmit(form) {
    this._messageService.addMessage(this.token, this.message).subscribe(
      response => {
        console.log(response);
        if (response.messageSaved) {
          this.status = 'success';
          form.reset();
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }

  getMyFollows() {
    this._followService.getMyFollows(this.token).subscribe(
      response => {
        this.follows = response.follows;
      },
      error => {
        console.log(<any>error);
      }
    );
  }
}

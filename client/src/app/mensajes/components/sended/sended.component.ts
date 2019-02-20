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
  selector: 'sended',
  templateUrl: './sended.component.html',
  providers: [ FollowService, MessageService, UserService ]
})
export class SendedComponent implements OnInit {
  public title: String;
  public message: Message;
  public identity;
  public token;
  public url: String;
  public status;
  public messages: Message[];
  public page;
  public total;
  public pages;
  public nextPage;
  public prevPage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _followService: FollowService,
    private _messageService: MessageService,
    private _userService: UserService
  ) {
    this.title = 'Mensajes enviados';
    this.identity = _userService.getIdentity();
    this.token = _userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('sended cargado');
    this.actualPage();
  }

  actualPage() {
    this._route.params.subscribe(params => {
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

        this.getMessages(this.token, this.page);
    });
}

  getMessages(token, page) {
    this._messageService.getEmitMessages(token, page).subscribe(
      response => {
        if (response.messages) {

          this.messages = response.messages;
          this.total = response.total;
          this.pages = response.pages;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
}

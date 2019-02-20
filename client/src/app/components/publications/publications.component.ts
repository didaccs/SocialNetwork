import { Publication } from './../../models/publication';
import { UserService } from './../../services/user.service';
import { GLOBAL } from './../../services/global';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PublicationService } from '../../services/publication.service';

@Component({
    selector:'publications',
    templateUrl: './publications.component.html',
    providers: [UserService, PublicationService]
})
export class PublicationsComponent implements OnInit {
  public identity;
  public token;
  public title: string;
  public url: string;
  public status;
  public page = 1;
  public total;
  public pages;
  public itemsPerPage;
  public publications: Publication[];
  public noMore = false;
  @Input() user: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationsService: PublicationService
  ) {
    this.title = 'Publicaciones';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.getPublications(this.user, this.page);
  }

  getPublications(user, page, adding = false) {
    this._publicationsService.getPublicationsUser(this.token, user, page).subscribe(
      response => {
        if (response.publications) {
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.itemsPerPage;

          if (!adding) {
            this.publications = response.publications;
          } else {
            this.publications = this.publications.concat(response.publications);

            $("html, body").animate({ scrollTop: $('html').prop("scrollHeight") }, 500);
          }

          if (page > this.page) {
            this._router.navigate(['/home']);
          }
        } else {
          this.status = 'error';
        }

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

  viewMore() {
    this.page += 1;
    if (this.page=== this.pages) {
      this.noMore = true;
    }
    this.getPublications(this.user, this.page, true);
  }
}

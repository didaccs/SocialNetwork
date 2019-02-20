import { Publication } from './../../models/publication';
import { UserService } from './../../services/user.service';
import { GLOBAL } from './../../services/global';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PublicationService } from '../../services/publication.service';

@Component({
    selector:'timeline',
    templateUrl: './timeline.component.html',
    providers: [UserService, PublicationService]
})
export class TimelineComponent implements OnInit {
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
  public showImage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationsService: PublicationService
  ) {
    this.title = 'Timeline';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('Timeline cargado');
    this.getPublications(this.page);
  }

  getPublications(page, adding = false) {
    this._publicationsService.getPublications(this.token, page).subscribe(
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
    if (this.page === this.pages) {
      this.noMore = true;
    }
    this.getPublications(this.page, true);
  }

  refresh(event = null) {
    this.getPublications(1);
  }

  showThisImage(id) {
    this.showImage = id;
  }
  hideThisImage() {
    this.showImage = 0;
  }

  deletePublication(id){
    this._publicationsService.deletePublication(this.token, id).subscribe(
      response => {
        this.refresh();
      },
      error => {
        console.log(<any>error);
      }
    );
  }
}

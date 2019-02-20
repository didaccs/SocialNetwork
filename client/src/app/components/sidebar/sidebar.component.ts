import { UploadService } from './../../services/upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Publication } from './../../models/publication';
import { UserService } from './../../services/user.service';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { GLOBAL } from '../../services/global';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  providers: [UserService, PublicationService, UploadService]
})
export class SidebarComponent implements OnInit {
  public identity;
  public token;
  public stats;
  public url;
  public status;
  public publication: Publication;
  public filesToUpload: Array<File>;

  @Output() sended = new EventEmitter();

  constructor(
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _uploadService: UploadService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
    this.publication = new Publication('', '', '', '', this.identity._id);
  }

  ngOnInit() {
    console.log('El componente sidebar ha sido cargado');
  }

  onSubmit(newPubForm, $event) {
    this._router.navigate(['/timeline']);
    this._publicationService.addPublication(this.token, this.publication).subscribe(
      response => {
        if (response.publication) {
          if (this.filesToUpload && this.filesToUpload.length) {
            this._uploadService.makeFileRequest(this.url + 'upload-image-pub/' + response.publication._id,
            [], this.filesToUpload, this.token, 'image').then((result: any) => {
              this.publication.file = result.image;

              newPubForm.reset();
              this.status = 'success';
              this._router.navigate(['/timeline']);
              this.sended.emit({send: 'true'});
            });
          } else {
              newPubForm.reset();
              this.status = 'success';
              this._router.navigate(['/timeline']);
              this.sended.emit({send: 'true'});
          }
        } else {
          this.status = 'error';
        }
      },
      error => {
        const errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  sendPublication(event) {
    this.sended.emit({send: 'true'});
  }

}

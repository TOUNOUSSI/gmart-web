import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { Profile } from 'src/app/models/profile.model';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  profileImageAvatar: SafeResourceUrl;

  public pseudoname: string;

  public loadedProfile: Profile = new Profile();
  public avatar: any;
  public isParentRendred: boolean = false;


  constructor(
    private cookieService: CookieService,
    private profileService: ProfileService,
    private _sanitizer: DomSanitizer,

  ) { }

  async ngOnInit() {
    this.pseudoname = this.cookieService.get('__psdnm_');


    await this.profileService.getAvatarPayloadByUsername('TOUNOUSSI').subscribe((resp: any) => {

      const reader = new FileReader();
      reader.readAsDataURL(resp); //InputStreamResource response from Profile Service backend

      reader.onload = _event => {
        this.profileImageAvatar = this._sanitizer.bypassSecurityTrustResourceUrl(
          '' + reader.result
        );
      };
    });

    await this.profileService.getProfile(this.pseudoname).subscribe((response) => {
      this.loadedProfile = response;

    });


  }
}

import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "dmart-notification-avatar",
  templateUrl: "./notification-avatar.component.html",
  styleUrls: ["./notification-avatar.component.scss"],
})
export class NotificationAvatarComponent implements OnInit {
  public notificationAvatar: SafeResourceUrl;

  @Input("avatar") public avatar: any;
  @Input("styles") public styles: string[];
  @Input("id") public id: string;
  @Output() public avatarCssChange: EventEmitter<any> = new EventEmitter();

  constructor(private _sanitizer: DomSanitizer) {}
  ngOnInit(): void {
    if (this.avatar !== undefined && this.avatar !== null) {
      this.notificationAvatar = this._sanitizer.bypassSecurityTrustResourceUrl(
        "data:image/jpg;base64," + this.avatar
      );
    } else {
      // In case there's no cover load the default GMART cover
      this.notificationAvatar = this._sanitizer.bypassSecurityTrustResourceUrl(
        "../../../../assets/img/avatars/avatar-default.png"
      );
    }
  }
}

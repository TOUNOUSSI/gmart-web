import { Component, Input, OnInit, AfterViewInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Comment } from "src/app/models/comment.model";
import { Picture } from "src/app/models/picture.model";

@Component({
  selector: "dmart-comment-box",
  templateUrl: "./comment-box.component.html",
  styleUrls: ["./comment-box.component.scss"],
})
export class CommentBoxComponent implements OnInit {
  @Input()
  public comment: Comment = new Comment();

  @Input()
  public id: string;

  profileImageAvatar: SafeResourceUrl;

  constructor(private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    if (
      this.comment.commenterProfile.avatar !== undefined &&
      this.comment.commenterProfile.avatar !== null
    ) {
      this.profileImageAvatar = this._sanitizer.bypassSecurityTrustResourceUrl(
        "data:image/jpg;base64," + this.comment.commenterProfile.avatar
      );
    } else {
      this.profileImageAvatar = this._sanitizer.bypassSecurityTrustResourceUrl(
        "../../../../assets/img/avatars/avatar-default.png"
      );
    }
  }
}

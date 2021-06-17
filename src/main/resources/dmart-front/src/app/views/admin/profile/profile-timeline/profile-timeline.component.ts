import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  TemplateRef,
  ComponentFactoryResolver,
  ViewChild,
  ComponentFactory,
  ViewContainerRef,
  ViewChildren,
  QueryList,
  ElementRef,
  HostListener,
} from "@angular/core";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { CookieService } from "ngx-cookie-service";
import { PostService } from "src/app/services/post/post.service";
import { Post } from "src/app/models/post.model";
import { PostWidgetComponent } from "src/app/views/post/post-widget/post-widget.component";
import { NewPostModalComponent } from "src/app/views/post/new-post-modal/new-post-modal.component";

const batchSize: number = 2;

@Component({
  selector: "dmart-profile-timeline",
  templateUrl: "./profile-timeline.component.html",
  styleUrls: ["./profile-timeline.component.scss"],
})
export class ProfileTimelineComponent implements OnInit {
  @Input("profile")
  public loadedProfile: any;

  public isMyProfile: Boolean = true;
  public textPost: Post = new Post();

  modalRef: BsModalRef;
  @ViewChild("templateref", { static: false })
  public templateref: TemplateRef<any>;

  profileImageAvatar: SafeResourceUrl;
  profileCover: SafeResourceUrl;

  // Counter used to handle pageable posts
  counter: number = 0;

  public posts = [];

  constructor(
    private postService: PostService,
    private cookieService: CookieService,
    private _sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    //List of post
    console.log("List f posts: ");
    this.profileImageAvatar = this._sanitizer.bypassSecurityTrustResourceUrl(
      "../../../../assets/img/avatars/avatar-default.png"
    );
    this.profileCover = this._sanitizer.bypassSecurityTrustResourceUrl(
      "../../../../assets/img/profile/default-coverr.jpg"
    );
    this.postService.getAllRecentPosts().subscribe((response) => {
      console.log(response);
      this.posts = response;
      if (this.posts.length <= batchSize) {
        this.counter = this.posts.length;
      } else {
        this.counter = batchSize;
      }
    });

    console.log(
      this.loadedProfile.pseudoname !== this.cookieService.get("__psdnm_")
    );
    if (this.loadedProfile.pseudoname !== this.cookieService.get("__psdnm_")) {
      this.isMyProfile = false;
    }
    if (
      this.loadedProfile.pictures !== undefined &&
      this.loadedProfile.pictures.length > 0
    ) {
      this.loadedProfile.pictures.forEach((picture) => {
        switch (picture.pictureType) {
          case "PROFILE_PICTURE":
            this.profileImageAvatar =
              this._sanitizer.bypassSecurityTrustResourceUrl(
                "data:image/jpg;base64," + picture.data
              );
            break;

          case "COVER_PICTURE":
            this.profileCover = this._sanitizer.bypassSecurityTrustResourceUrl(
              "data:image/jpg;base64," + picture.data
            );
            break;
        }
      });
    }
  }

  /**
   * To open Modal Post Dialog
   */
  openDialog(): void {
    console.log("The dialog was closed");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "760px";
    const dialogRef = this.dialog.open(NewPostModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (
        dialogRef.componentInstance.post.description !== undefined &&
        dialogRef.componentInstance.post.description !== ""
      ) {
        console.log(dialogRef.componentInstance.post);
        this.posts.unshift(dialogRef.componentInstance.post);
        console.log("The dialog AfterClosed was closed");
      }
    });
  }

  /**
   * To handle key up text posting (Non-modal Post)
   */
  submitTextPostKeyUpEvent() {
    console.log("key up performed : ");
    this.postService.save(this.textPost).subscribe((savedPost) => {
      if (savedPost !== undefined) {
        console.log("Posted");
        this.posts.unshift(savedPost);
        this.textPost = new Post();
      }
    });
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    //In chrome and some browser scroll is given to body tag
    let cursorPosition =
      (document.documentElement.scrollTop || document.body.scrollTop) +
      document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;

    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if (
      Math.round(cursorPosition) + 1 >= max &&
      this.counter < this.posts.length
    ) {
      this.getMorePosts();
    }
  }

  getMorePosts() {
    if (this.counter <= this.posts.length - batchSize) {
      this.counter += batchSize;
    } else if (this.counter <= this.posts.length) {
      this.counter += this.posts.length - this.counter;
    }
  }
}

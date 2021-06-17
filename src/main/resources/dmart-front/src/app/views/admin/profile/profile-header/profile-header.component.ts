import {
  Component,
  OnInit,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { ProfileService } from "src/app/services/profile/profile.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { MessengerService } from "src/app/services/messenger/messenger.service";
import { CookieService } from "ngx-cookie-service";
import { PushNotificationService } from "src/app/services/push-notification/push-notification.service";
import { NotificationDTO } from "src/app/models/notification.model";
import { UserProfile } from "src/app/models/notification-profile.model";

const rand = (max) => Math.floor(Math.random() * max);

@Component({
  selector: "dmart-profile-header",
  templateUrl: "./profile-header.component.html",
  styleUrls: ["./profile-header.component.scss"],
})
export class ProfileHeaderComponent implements OnInit {
  @Input("pseudoname")
  public pseudoname: string;

  @Input("loaded-profile")
  public loadedProfile: any;

  public profilePropertyToChange: string;

  public newFriendRequestNotification: NotificationDTO;

  constructor(
    private cookieService: CookieService,
    private messengerService: MessengerService,
    private pushNotificationService: PushNotificationService,
    private profileService: ProfileService,
    private _sanitizer: DomSanitizer
  ) {}

  profileCoverImage: SafeResourceUrl;
  profileImageAvatar: SafeResourceUrl;
  imagePathBackup: SafeResourceUrl;

  fileToUpload: File;

  isSaveSideBarShown: boolean = true;
  isMyProfile: boolean = true;
  areWeAlreadyFriend: boolean = true;
  isProfilePicture: boolean = false;
  ngOnInit() {
    // In case there's no cover and no profile load the default GMART cover and default profile picture
    this.profileCoverImage = this._sanitizer.bypassSecurityTrustResourceUrl(
      "../../../../assets/img/profile/cover/default-cover.jpg"
    );

    this.profileImageAvatar = this._sanitizer.bypassSecurityTrustResourceUrl(
      "../../../../assets/img/avatars/avatar-default.png"
    );
    if (this.pseudoname !== this.cookieService.get("__psdnm_")) {
      this.isMyProfile = false;
    }

    this.messengerService.AreWeAlreadyFriend(this.pseudoname).then((resp) => {
      this.areWeAlreadyFriend = JSON.parse(JSON.stringify(resp));
      console.log("Are we friends : " + this.areWeAlreadyFriend);
    });
    if (
      this.loadedProfile.pictures !== undefined &&
      this.loadedProfile.pictures.length > 0
    ) {
      this.loadedProfile.pictures.forEach((picture) => {
        if (picture.pictureType === "COVER_PICTURE") {
          this.profileCoverImage =
            this._sanitizer.bypassSecurityTrustResourceUrl(
              "data:image/jpg;base64," + picture.data
            );
        } else {
          this.profileImageAvatar =
            this._sanitizer.bypassSecurityTrustResourceUrl(
              "data:image/jpg;base64," + picture.data
            );
        }
      });
    }
    //Backing up the profile cover
    this.imagePathBackup = this.profileCoverImage;
  }

  /**
   * @todo apply this only on large screens and not on small devices (mobile)
   * @param event
   */
  @HostListener("window:scroll", ["$event"])
  scrollHandler(event) {
    let profile = document.getElementById(
      "profile-horizontal-list-menu"
    ) as HTMLDivElement;
    let profileBlurredBackground = document.getElementById(
      "profile-background-container"
    ) as HTMLDivElement;
    let timelineContainer = document.getElementById(
      "timeline-container"
    ) as HTMLDivElement;
    if (profile !== undefined) {
      //console.log(window.innerWidth);

      //if( window.pageYOffset>= 526.4000244140625){
      if (window.pageYOffset >= 526.4000244140625 && window.innerWidth > 414) {
        profile.classList.add("profile-horizontal-list-start-fixed");

        profileBlurredBackground.classList.add(
          "profile-background-container-fixed"
        );
        profileBlurredBackground.classList.remove(
          "profile-background-container"
        );

        timelineContainer.classList.add("timeline-container-scroll");
        timelineContainer.classList.remove("timeline-container");
      } else {
        profile.classList.remove("profile-horizontal-list-start-fixed");

        profileBlurredBackground.classList.remove(
          "profile-background-container-fixed"
        );
        profileBlurredBackground.classList.add("profile-background-container");

        timelineContainer.classList.remove("timeline-container-scroll");
        timelineContainer.classList.add("timeline-container");
      }
    }
  }

  onClickOpenImageChooseDialogue(event) {
    var input = document.getElementById("inputimage") as HTMLInputElement;
    input.click();
  }

  onClickOpenProfilePictureChooseDialogue(event) {
    var input = document.getElementById("avatarinputImage") as HTMLInputElement;
    input.click();
  }

  onCIChange(files: FileList) {
    this.isProfilePicture = false;
    this.profilePropertyToChange = "PROFILE_COVER";

    this.fileToUpload = files[0];
    console.log("Cover Image changed:" + files[0]);
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.profileCoverImage = event.target.result;
    };
    reader.readAsDataURL(files[0]);

    this.switchSaveSideBarShown();
  }

  onPPChange(files: FileList) {
    this.isProfilePicture = true;

    this.profilePropertyToChange = "PROFILE_PICTURE";
    this.fileToUpload = files[0];
    console.log("Profile Picture changed:" + files[0]);
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.profileImageAvatar = event.target.result;
    };
    reader.readAsDataURL(files[0]);

    this.switchSaveSideBarShown();
  }

  onUpload() {
    console.log("File name :" + this.fileToUpload.name);
    switch (this.profilePropertyToChange) {
      case "PROFILE_PICTURE": {
        this.profileService.updateProfilePicture(this.fileToUpload).subscribe(
          (res: any) => {
            if (res !== undefined) {
              this.profileImageAvatar =
                this._sanitizer.bypassSecurityTrustResourceUrl(
                  "data:image/jpg;base64," + res.data
                );
            }
          },
          (err) => {}
        );
        window.location.reload();

        break;
      }
      case "PROFILE_COVER": {
        this.profileService.updateProfileCover(this.fileToUpload).subscribe(
          (res: any) => {
            if (res !== undefined) {
              this.profileCoverImage =
                this._sanitizer.bypassSecurityTrustResourceUrl(
                  "data:image/jpg;base64," + res.data
                );
            }
          },
          (err) => {}
        );
        window.location.reload();

        break;
      }

      default:
        break;
    }

    var input = document.getElementById("inputimage") as HTMLInputElement;
    input.value = "";
    this.switchSaveSideBarShown();
    this.isProfilePicture = false;
  }

  onCancel() {
    this.isProfilePicture = false;

    this.profileCoverImage = this.imagePathBackup;

    console.log("onClose called");
    var input = document.getElementById("inputimage") as HTMLInputElement;
    input.value = "";
    this.switchSaveSideBarShown();
  }

  /**
   *
   */
  onAddNewFriendToFriendList() {
    //Get friend username to be send
    console.log("Sending a friend request to '" + this.pseudoname);

    this.messengerService
      .addFriendRequest(this.pseudoname)
      .then((userProfile: any) => {
        console.log("Send friend request to : " + JSON.stringify(userProfile));

        this.profileService
          .getCustomProfileByUsername(userProfile.username)
          .subscribe((receiver: UserProfile) => {
            console.log("Receiver : " + JSON.stringify(receiver));

            this.profileService
              .getCustomProfileByUsername(this.cookieService.get("__usrnm_"))
              .subscribe((sender: UserProfile) => {
                console.log("Sender: " + JSON.stringify(sender));
                this.newFriendRequestNotification = new NotificationDTO(
                  sender,
                  receiver,
                  "FRIEND_REQUEST"
                );
                console.log(JSON.stringify(this.newFriendRequestNotification));
                this.pushNotificationService.sendFriendRequestNotification(
                  this.newFriendRequestNotification
                );
              });
          });
      });
  }

  public switchSaveSideBarShown() {
    this.isSaveSideBarShown = !this.isSaveSideBarShown;
  }
}

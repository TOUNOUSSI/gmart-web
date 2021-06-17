import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { AccountService } from "src/app/services/account/account.service";
import { AuthService } from "src/app/services/authentication/auth.service";
import { navItems } from "../../../_nav";
import { Observable } from "rxjs";
import { User } from "src/app/models/user.model";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";
import { ProfileService } from "src/app/services/profile/profile.service";
import { WebSocketAPI } from "src/app/websocket-api";
import { map, startWith } from "rxjs/operators";
import { FormControl, FormGroup } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { ClassToggler } from "../../core/shared/toggle-classes";
import { HttpEvent } from "@angular/common/http";
import { PushNotificationService } from "src/app/services/push-notification/push-notification.service";
import { NotificationDTO } from "src/app/models/notification.model";
import { cpuUsage } from "process";
import { UserProfile } from "src/app/models/notification-profile.model";
import { DmartUtilsService } from "src/app/services/dmart-utils/dmart-utils.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html",
  styleUrls: ["./default-layout.component.scss"],
  providers: [ClassToggler],
})
export class DefaultLayoutComponent implements OnInit, AfterViewInit {
  //total notifications
  @Input()
  public notificationCounter = 0;

  @Output() public idEmitter: EventEmitter<any> = new EventEmitter();

  theme: "red";
  name: string;
  public sidebarMinimized = true;
  public navItems = navItems;
  public matchingUsers: User[] = [];
  public search_id: string = "dmart-search-id";
  public pseudoname: string = "";
  public myProfile: any;
  myFormGroup: FormGroup;
  searchHistory: string[] = [];
  filteredOptions: Observable<string[]>;
  fromSearchHistory: string[] = new Array();

  public initNavItems: Array<any>;
  msgConfirmation: string = "Vous êtes déconnecté.";

  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  public profileAvatar: SafeResourceUrl;

  //This is used for listing all notifications
  public notifications = [];
  public newNotifications = [];
  public oldNotifications = [];
  public avatarPayload: string = "";
  constructor(
    private accountservice: AccountService,
    private authenticationService: AuthService,
    private cookieService: CookieService,
    private webSocketAPI: WebSocketAPI,
    private router: Router,
    private profileService: ProfileService,
    private _sanitizer: DomSanitizer,
    private classToggler: ClassToggler,
    private pushNotificationService: PushNotificationService,
    private dmartUtils: DmartUtilsService
  ) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized =
        document.body.classList.contains("sidebar-minimized");
    });
    this.changes.observe(<Element>this.element, {
      attributes: true,
    });
  }

  async ngOnInit() {
    this.myFormGroup = new FormGroup({
      search: new FormControl(),
    });
    this.filteredOptions = this.myFormGroup.get("search").valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
    await this.profileService.getMyProfile().subscribe((profile) => {
      this.myProfile = profile;
      this.pseudoname = profile.pseudoname;
      console.log("Inside Default layout profile loading ... ");

      this.pushNotificationService
        .getAllNotifications(this.cookieService.get("__usrnm_"))
        .subscribe((notifications) => {
          console.log("Getting list of notification");
          this.notifications = notifications;
          console.log(this.notifications);
          this.oldNotifications = this.notifications.filter(
            (notif: NotificationDTO) => {
              return notif.checked === true;
            }
          );
          this.newNotifications = this.notifications.filter(
            (notif: NotificationDTO) => {
              return notif.checked === false;
            }
          );
          this.notificationCounter = this.newNotifications.length;
        });

      if (profile.pictures !== undefined && profile.pictures.length > 0) {
        profile.pictures.forEach((picture) => {
          if (picture.pictureType === "PROFILE_PICTURE") {
            this.profileAvatar = this._sanitizer.bypassSecurityTrustResourceUrl(
              "data:image/jpg;base64," + picture.data
            );
            this.avatarPayload = picture.data;
          }
        });
      } else {
        // In case there's no cover load the default GMART cover
        this.profileAvatar = this._sanitizer.bypassSecurityTrustResourceUrl(
          "../../../../assets/img/avatars/avatar-default.png"
        );
      }
    });

    //push notification
    this.pushNotificationService.initializeWebSocketConnection(
      this.cookieService.get("__usrnm_")
    );

    this.pushNotificationService.messageSource.subscribe((counter) => {
      console.log("Message: ", counter); //
      this.notificationCounter += counter;
    });

    this.pushNotificationService.notificationsBehaviorSubject.subscribe(
      (notification: NotificationDTO) => {
        this.profileService
          .getCustomProfileByUsername(notification.sender.username)
          .subscribe((sender: UserProfile) => {
            notification.sender = sender;
            this.notifications.unshift(notification);
            this.newNotifications.unshift(notification);
          });
      }
    );
  }

  ngAfterViewInit(): void {
    this.idEmitter.emit(this.search_id);
  }

  connect() {
    this.webSocketAPI._connect();
  }

  disconnect() {
    this.webSocketAPI._disconnect();
  }

  sendMessage() {
    this.webSocketAPI._send(this.name);
    this.handleMessage();
  }

  handleMessage() {
    console.log("Message handled");
    console.log("response from observable here " + this.webSocketAPI.message);
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  public onSearchFriend(username: string) {
    if (username !== "") {
      this.accountservice.getSearchUsersList(username).subscribe((data) => {
        console.log("returned data here");
        console.log(data);
        this.matchingUsers = data;
      });
    } else {
      this.matchingUsers = [];
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.fromSearchHistory = this.searchHistory.filter((option) => {
      option.toLowerCase().includes(filterValue);
    });

    if (this.fromSearchHistory.length == 0) {
      this.accountservice
        .getAllAccounts()
        .toPromise()
        .then((users) => {
          alert(users);
        });
    } else {
      return this.fromSearchHistory;
    }
  }

  onOpenMyProfile(pseudoname) {
    this.router.navigateByUrl("/admin/profile/" + pseudoname);
  }
  doLogout() {
    if (confirm("Voulez vous vraiment vous déconnecter?")) {
      localStorage.clear();
      sessionStorage.clear();
      this.cookieService.deleteAll();
      this.authenticationService.logout();
      this.router.navigate(["/signin"]);
    }
  }

  openDatasourceDialog() {
    console.log("Open dialog called");
  }

  @HostListener("swiperight", ["$event"])
  public swipeRightHandler(event) {
    console.log("event " + event.type + " listener");
    document.querySelector("body").classList.add("sidebar-show");
    document.querySelector("body").classList.remove("aside-menu-show");
  }

  @HostListener("click", ["$event"])
  public clickHandler(event) {
    console.log("event " + event.type + " listener");
    document.querySelector("body").classList.remove("sidebar-show");
    document.querySelector("body").classList.remove("aside-menu-show");
  }

  @HostListener("swipeleft", ["$event"])
  public swipeLeftHandler(event) {
    console.log("event " + event.type + " listener");
    document.querySelector("body").classList.add("aside-menu-show");
    document.querySelector("body").classList.remove("sidebar-show");
  }

  readNotification(event: HttpEvent<any>) {
    console.log("Event received");
  }

  public navigateToUrlWithRefreshParams() {
    this.dmartUtils.loadProfileWithRefreshParams(
      "/admin/profile/" + this.pseudoname
    );
  }
}

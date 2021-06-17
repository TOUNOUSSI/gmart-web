import { DashboardComponent } from "./dashboard/dashboard.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AdminRoutingModule } from "./admin-routing.module";
import { ChatModule } from "../chat";
import { FriendsModule } from "../friends";
import { ProfileComponent } from "./profile/profile.component";
import { RouterModule } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

import {
  MatCardModule,
  MatDialogModule,
  MatDialogContent,
  MatSelectModule,
} from "@angular/material";
import { ProfileHeaderComponent } from "./profile/profile-header/profile-header.component";
import { ProfileBodyComponent } from "./profile/profile-body/profile-body.component";
import { ProfileTimelineComponent } from "./profile/profile-timeline/profile-timeline.component";
import { AngularMaterialModule } from "src/app/angular-material.module";
import { ProfileAvatarComponent } from "./profile/profile-avatar/profile-avatar.component";
import { BsModalService } from "ngx-bootstrap/modal";
import { PostModule } from "../post/post.module";
import { PostWidgetComponent } from "../post/post-widget/post-widget.component";
import { NewPostModalComponent } from "../post/new-post-modal/new-post-modal.component";
import {
  PushNotificationComponent,
  PushNotificationModule,
} from "../core/push-notification";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdminRoutingModule,
    RouterModule,
    MatDialogModule,
    MatSelectModule,
    MatCardModule,
    AngularMaterialModule,
    PostModule,
    PushNotificationModule,
  ],

  declarations: [
    DashboardComponent,
    ProfileComponent,
    ProfileAvatarComponent,
    ProfileHeaderComponent,
    ProfileBodyComponent,
    ProfileTimelineComponent,
  ],
  entryComponents: [NewPostModalComponent, PushNotificationComponent],
  providers: [BsModalService, CookieService],
})
export class AdminModule {}

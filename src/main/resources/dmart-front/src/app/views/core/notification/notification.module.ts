import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotificationComponent } from "./notification.component";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { NotificationAvatarComponent } from "./notification-avatar/notification-avatar.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [NotificationComponent, NotificationAvatarComponent],
  imports: [CommonModule, BsDropdownModule, RouterModule],
  exports: [NotificationComponent, NotificationAvatarComponent],
})
export class NotificationModule {}

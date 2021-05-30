import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CommentBoxComponent } from "./comment-box/comment-box.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [CommentBoxComponent],
  imports: [CommonModule, FormsModule],
  exports: [CommentBoxComponent],
  entryComponents: [CommentBoxComponent],
})
export class CommentModule {}

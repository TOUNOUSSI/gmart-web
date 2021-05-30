import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { SafeResourceUrl } from "@angular/platform-browser";
import { Comment } from "src/app/models/comment.model";
import { Post } from "src/app/models/post.model";
import { CommentService } from "src/app/services/comment/comment.service";
import { CommentBoxComponent } from "../../comment";
import { fadeIn, fadeInOut } from "../animations";

@Component({
  selector: "dmart-post-widget",
  templateUrl: "./post-widget.component.html",
  styleUrls: ["./post-widget.component.scss"],
  //animations: [fadeInOut, fadeIn],
})
export class PostWidgetComponent implements OnInit {
  @Input()
  public loadedProfile: any;

  @Input()
  public post: Post;

  @Input()
  public id: string;

  @Input()
  profileImageAvatar: SafeResourceUrl;

  @Input()
  comments: Comment[];

  //New comment
  private newComment: Comment = new Comment();

  constructor(
    private commentService: CommentService,
    private compFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {}

  /**
   *
   */
  submitCommentAfterKeyUpEvent() {
    console.log("Comment key up event performed : ");
    this.newComment.pseudoname = this.loadedProfile.pseudoname;
    this.commentService
      .addNewCommentOnPost(this.newComment, this.id)
      .subscribe((savedComment) => {
        if (savedComment !== undefined) {
          console.log("Posted");
          this.comments.unshift(savedComment);
          this.newComment = new Comment();
        }
      });
  }
}

import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { SafeResourceUrl } from "@angular/platform-browser";
import { Comment } from "src/app/models/comment.model";
import { Post } from "src/app/models/post.model";
import { CommentService } from "src/app/services/comment/comment.service";

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

  // Counter used to handle pageable comments
  counter: number = 0;

  //New comment
  public newComment: Comment = new Comment();

  constructor(private commentService: CommentService) { }

  ngOnInit() {
    if (this.comments.length <= 3) {
      this.counter = this.comments.length;
    } else {
      this.counter = 3;
    }
  }

  /**
   *
   */
  submitCommentAfterKeyUpEvent() {
    if (this.comments.length <= 3) {
      this.counter = this.comments.length;
    }

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

        if (this.comments.length <= 3) {
          this.counter = this.comments.length;
        }
      });
  }

  getMoreComments() {
    if (this.counter <= this.comments.length - 3) {
      this.counter += 3;
    } else if (this.counter <= this.comments.length) {
      this.counter += this.comments.length - this.counter;
    }
    console.log(this.counter + " shown comments");
  }

}

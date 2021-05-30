import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material";
import { Post } from "src/app/models/post.model";
import { PostService } from "src/app/services/post/post.service";

@Component({
  selector: "dmart-new-post-modal",
  templateUrl: "./new-post-modal.component.html",
  styleUrls: ["./new-post-modal.component.scss"],
})
export class NewPostModalComponent implements OnInit {
  form: FormGroup;
  description: string;
  post: Post = new Post();
  postTypes: IPostType[] = [
    { value: "VD", viewValue: "VIDEO" },
    { value: "TXT", viewValue: "TEXT" },
    { value: "IMG", viewValue: "IMAGE" },
    { value: "LNK", viewValue: "LINK" },
  ];
  constructor(
    private postService: PostService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewPostModalComponent>
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      description: [this.description, []],
    });
  }

  save() {
    console.log("Post to be saved");
    console.log(this.post.type);
    if (this.post.description !== undefined && this.post.description !== "") {
      this.postService.save(this.post).subscribe((savedPost) => {
        if (savedPost !== undefined) {
          console.log("Posted");
          this.post = savedPost;
          this.dialogRef.close(this.form.value);
        }
      });
    }
  }

  close() {
    console.log("New Post Modal has been closed");
    this.dialogRef.close();
  }
}

interface IPostType {
  value: string;
  viewValue: string;
}

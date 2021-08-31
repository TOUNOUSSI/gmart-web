import { ElementRef, Inject, ViewChild, ViewEncapsulation } from "@angular/core";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Post } from "src/app/models/post.model";
import { PostService } from "src/app/services/post/post.service";

@Component({
  selector: "dmart-new-post-modal",
  templateUrl: "./new-post-modal.component.html",
  styleUrls: ["./new-post-modal.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NewPostModalComponent implements OnInit {
  @ViewChild('mediaframe', { static: false })
  mediaFrame: ElementRef;

  isMediaSelected: boolean = false
  mediaImage: SafeResourceUrl;
  fileToUpload: File;


  media: any = {
    src: 'blob:https://web.facebook.com/34e16775-e603-4fc7-bc8c-c2a68cf889ce',
    alt: 'Joker face'
  }

  onFileSelect(files: FileList) {
    this.fileToUpload = files[0];
    if (this.fileToUpload !== undefined) {
      this.isMediaSelected = true;
    } else {
      return;
    }

    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.mediaImage = this._sanitizer.bypassSecurityTrustResourceUrl(
        event.target.result
      );
    };
    reader.readAsDataURL(files[0]);
  }

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
    private dialogRef: MatDialogRef<NewPostModalComponent>,
    private _sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      description: [this.description, []],
    });
  }

  addNewPost() {

    if (this.isMediaSelected && (this.fileToUpload.type === 'image/jpeg' || this.fileToUpload.type === 'image/jpg')) {
      this.post.type = this.postTypes[1].value
    }

    if ((this.post.description !== undefined && this.post.description !== "") || this.isMediaSelected) {

      this.post.type = (this.post.type === undefined || this.post.type === '') ? this.postTypes[0].value : this.post.type;

      this.postService.save(this.post, this.fileToUpload).subscribe((savedPost) => {
        if (savedPost !== undefined) {
          console.log("Posted");
          this.post = savedPost;
          this.dialogRef.close(this.form.value);
        }
      });
    }
  }

  /**
   * Remove selected Image from Preview
   */
  clearSelectedInput() {
    this.mediaImage = null;
    this.isMediaSelected = false;
  }

  close() {
    console.log("New Post Modal has been closed");
    this.dialogRef.close();
  }

  onMouseEnterDiv() {
    if (this.mediaFrame !== undefined) {
      this.mediaFrame.nativeElement.classList.toggle('show')
      this.mediaFrame.nativeElement.classList.toggle('hide')
    }
  }

  onMouseLeaveDiv() {
    if (this.mediaFrame !== undefined) {
      this.mediaFrame.nativeElement.classList.toggle('hide')
      this.mediaFrame.nativeElement.classList.toggle('show')
    }
  }

}
interface IPostType {
  value: string;
  viewValue: string;
}

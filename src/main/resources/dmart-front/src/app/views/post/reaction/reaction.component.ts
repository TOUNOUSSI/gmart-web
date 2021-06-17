import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "dmart-reaction",
  templateUrl: "./reaction.component.html",
  styleUrls: ["./reaction.component.scss"],
})
export class ReactionComponent implements OnInit {
  @Input()
  public totalComments: number;

  constructor() {}

  ngOnInit() {}
}

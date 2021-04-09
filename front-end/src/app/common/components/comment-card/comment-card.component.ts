import { Component, OnInit, Input, Inject, ElementRef, ViewChild, Renderer2 } from '@angular/core';

export interface Comment {
  commentId: number,
  authorName: string,
  authorId: number,
  avatorUrl: string,
  createTime: string,
  content: string,
  likes: number,
}
@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css']
})
export class CommentCardComponent implements OnInit {
  @Input() comment: Comment;

  constructor() { }

  ngOnInit(): void {
  }

}

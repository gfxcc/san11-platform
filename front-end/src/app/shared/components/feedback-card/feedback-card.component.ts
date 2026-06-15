import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/common/notification.service';
import { San11PlatformServiceService } from 'src/app/service/san11-platform-service.service';
import { loadUser, signedIn } from 'src/app/utils/user_util';
import { Action, ListActivitiesRequest, ListActivitiesResponse, ToggleActionRequest, ToggleActionResponse } from 'src/proto/san11-platform.pb';

@Component({
  selector: 'app-feedback-card',
  templateUrl: './feedback-card.component.html',
  styleUrls: ['./feedback-card.component.css']
})
export class FeedbackCardComponent implements OnInit, OnDestroy {
  @Input() target: string;
  @Input() likeCount: string;
  @Input() dislikeCount: string;

  @Input() disableClickableBackground: boolean = false;


  liked = false;
  disliked = false;
  hoveredFeedback: 'like' | 'dislike' | undefined;
  feedbackPulse: 'like' | 'dislike' | undefined;
  private feedbackPulseTimeout: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private san11pkService: San11PlatformServiceService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadFeedback();
  }

  ngOnDestroy(): void {
    if (this.feedbackPulseTimeout) {
      clearTimeout(this.feedbackPulseTimeout);
    }
  }

  loadFeedback() {
    this.san11pkService.listActivities(new ListActivitiesRequest({
      parent: `users/${loadUser().userId}`,
      filter: `resource_name="${this.target}"`,
    })).subscribe({
      next: (resp: ListActivitiesResponse) => {
        resp.activities.forEach(activity => {
          if (activity.action === Action.LIKE) {
            this.liked = true;
          } else if (activity.action === Action.DISLIKE) {
            this.disliked = true;
          }
        });
      },
      error: (error) => {
        console.error(`Failed to load like status: ${error.statusMessage}`);
      }
    });
  }

  onToggleLike() {
    if (!signedIn()) {
      this.notificationService.warn('请登录');
      return;
    }
    if (this.liked) {
      this.liked = false;
    } else {
      this.liked = true;
      if (this.disliked) {
        this.disliked = false;
      }
    }
    this.toggle(Action.LIKE);
  }

  onToggleDislike() {
    if (!signedIn()) {
      this.notificationService.warn('请登录');
      return;
    }
    if (this.disliked) {
      this.disliked = false;
    } else {
      this.disliked = true;
      if (this.liked) {
        this.liked = false;
      }
    }
    this.toggle(Action.DISLIKE);
  }

  onFeedbackHover(feedback: 'like' | 'dislike') {
    this.hoveredFeedback = feedback;
  }

  onFeedbackHoverEnd() {
    this.hoveredFeedback = undefined;
  }

  startFeedbackPulse(feedback: 'like' | 'dislike') {
    if (this.feedbackPulseTimeout) {
      clearTimeout(this.feedbackPulseTimeout);
    }

    this.feedbackPulse = undefined;
    requestAnimationFrame(() => {
      this.feedbackPulse = feedback;
      this.feedbackPulseTimeout = setTimeout(() => {
        this.feedbackPulse = undefined;
      }, 320);
    });
  }

  // utils

  toggle(action: Action) {

    this.san11pkService.toggleAction(new ToggleActionRequest({
      target: this.target,
      action: action,
    })).subscribe({
      next: (resp: ToggleActionResponse) => {
        if (action === Action.LIKE) {
          this.likeCount = resp.likeCount;
          this.dislikeCount = resp.dislikeCount;
          this.startFeedbackPulse('like');
        } else if (action === Action.DISLIKE) {
          this.likeCount = resp.likeCount;
          this.dislikeCount = resp.dislikeCount;
          this.startFeedbackPulse('dislike');
        }
      },
      error: (error) => {
        console.error(`Failed to toggle action: ${error.statusMessage}`);
      }
    });
  }
}

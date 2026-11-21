import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PackageAutoReview } from '../../../../proto/san11-platform.pb';
import { reviewLabel } from '../../../utils/auto_review_util';

@Component({
  selector: 'app-auto-review-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [attr.data-tone]="tone">
      <mat-icon aria-hidden="true">{{icon}}</mat-icon>
      {{unavailable ? '状态更新失败' : label(review)}}
    </span>`,
  styles: [`
    :host { display: inline-flex; max-width: 100%; vertical-align: middle; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: 6px;
      background: #edf0f4;
      color: #405066;
      font-size: .75rem;
      line-height: 1.45;
      font-weight: 700;
    }
    .badge[data-tone="scheduled"] { background: #d6f1e6; color: #15553f; }
    .badge[data-tone="due"] { background: #dfeaff; color: #234b8b; }
    mat-icon { width: 15px; height: 15px; font-size: 15px; flex-shrink: 0; }
  `],
})
export class AutoReviewBadgeComponent {
  @Input() review?: PackageAutoReview;
  @Input() unavailable = false;
  readonly label = reviewLabel;

  get tone(): string {
    if (this.unavailable || !this.review?.enabled || !this.review.hasVersion || !this.review.eligibleAt) {
      return 'neutral';
    }
    return this.review.remainingMinutes ? 'scheduled' : 'due';
  }

  get icon(): string {
    if (this.unavailable || !this.review) { return 'info_outline'; }
    if (!this.review.enabled) { return 'pause_circle_outline'; }
    return this.tone === 'due' ? 'hourglass_full' : 'schedule';
  }
}

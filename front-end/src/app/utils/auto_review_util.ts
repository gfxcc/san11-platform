import { PackageAutoReview } from '../../proto/san11-platform.pb';

export function reviewLabel(review?: PackageAutoReview): string {
  if (!review) { return '自动审核状态未知'; }
  if (!review.enabled) { return '自动审核已关闭'; }
  if (!review.hasVersion) { return '等待首个版本'; }
  if (!review.eligibleAt) { return '尚未开始自动审核计时'; }
  return review.remainingMinutes ? '已安排自动批准' : '已到期，等待系统批准';
}

export function reviewDescription(review?: PackageAutoReview): string {
  if (!review) { return '暂时无法确认是否会自动批准。'; }
  if (!review.enabled) {
    return review.eligibleAt
      ? '当前需人工审核。若重新开启自动审核，将沿用原定时间。'
      : review.hasVersion ? '当前需人工审核，此资源尚未开始计时。' : '当前需人工审核，资源尚无版本。';
  }
  if (!review.hasVersion) { return '成功添加版本后开始 24 小时计时，也可以现在人工审核。'; }
  if (!review.eligibleAt) { return '需人工审核，或等待作者添加新版本后开始计时。'; }
  if (!review.remainingMinutes) { return '已满足自动批准条件，等待后台处理。'; }
  const hours = Math.floor(review.remainingMinutes / 60);
  const minutes = review.remainingMinutes % 60;
  const duration = [hours && hours + ' 小时', minutes && minutes + ' 分钟'].filter(Boolean).join(' ');
  return '约剩 ' + duration;
}

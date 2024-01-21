import { Notification } from "src/proto/san11-platform.pb";
import { getFullUrl, parseName } from "./resrouce_util";


 export function notificationToEvent(notification: Notification) {
    let color = '#607D8B';

    return {
      'actorId': parseName(parseName(notification.name)[0])[2],
    //   'displayName': notification.createTime,
      'description': notification.content,
      'createTime': notification.createTime.toISOString(),
      'icon': notification.unread ? 'mark_email_unread' : 'mark_email_read',
      'image': notification.imagePreview ? getFullUrl(notification.imagePreview) : undefined,
      'color': notification.unread ? '#FBBE04' : '#33A951',
      'link': notification.link,
    }
  }
import { Action, Activity } from "src/proto/san11-platform.pb";
import { getFullUrl, parseName } from "./resrouce_util";

 export function activityToEvent(activity: Activity) {
    let action: string;
    let icon: string;
    let color = '#607D8B';
    switch (activity.action) {
      case Action.CREATE:
        action = '创建';
        icon = 'add';
        color = '#4286F3';
        break;
      case Action.DELETE:
        action = '删除';
        icon = 'delete';
        color = '#EA4333';
        break;
      case Action.UPDATE:
        action = '更新';
        icon = 'update';
        color = '#33A951';
        break;
      case Action.SELECT:
        action = '查看';
        icon = 'update';
        icon = 'travel_explore';
        break;
      case Action.LIKE:
        action = 'LIKE';
        icon = 'favorite';
        color = '#FBBE04';
        break;
      case Action.UPVOTE:
        action = '赞';
        icon = 'thumb_up';
        color = '#FBBE04';
        break;
      case Action.SUBSCRIBE:
        action = '订阅';
        icon = 'notifications';
        color = '#FBBE04';
        break;
      case Action.UNSUBSCRIBE:
        action = '退订';
        icon = 'unsubscribe';
        color = '#EA4333';
        break;
      case Action.DISLIKE:
        action = '反对';
        icon = 'thumb_down';
        color = '#EA4333';
        break;
      case Action.DOWNLOAD:
        action = '下载';
        icon = 'get_app';
        break;
    };

    return {
      'actorId': parseName(parseName(activity.name)[0])[2],
      'displayName': `【${action}】 ${activity.resourceView ? activity.resourceView.displayName : '已删除'}`,
      'description': activity.resourceView ? activity.resourceView.description : '',
      'createTime': activity.createTime,
      'icon': icon,
      'image': (activity.resourceView && activity.resourceView.imageUrl) ? getFullUrl(activity.resourceView.imageUrl) : undefined,
      'color': color,
      'link': (activity.resourceView?.name) ? activity.resourceView.name : undefined,
    }
  }
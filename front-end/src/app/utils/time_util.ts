import * as googleProtobuf000 from '@ngx-grpc/well-known-types';

export function getAge(timestamp: googleProtobuf000.Timestamp): string {
    const date :Date = timestamp.toDate();

    const now = new Date();
    var seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " 年前";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " 月前";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " 天前";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " 小时前";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " 分钟前";
    }
    return Math.floor(seconds) + " 秒前";
}
import { transition } from "@angular/animations";
import { map, filter, tap } from 'rxjs/operators';
import { Observer, Observable } from "rxjs";
import { User, ListUsersResponse } from "../../proto/san11-platform.pb";
import { San11PlatformServiceService } from "../service/san11-platform-service.service";


export function isAdmin(): boolean {
    return localStorage.getItem('userType') === 'admin';
}

export function getUserUrl(user: User): string {
    return 'users/' + user.userId;
}

export function signedIn(): boolean {
    const user = loadUser();
    return user.userId != '0' && user.username != '' && user.imageUrl != '' && user.userType != '';
}

export function saveUser(user: User) {
    localStorage.setItem('userId', user.userId);
    localStorage.setItem('username', user.username);
    localStorage.setItem('userType', user.userType);
    localStorage.setItem('userImageUrl', user.imageUrl);
}

export function clearUser() {
    localStorage.removeItem('sid');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    localStorage.removeItem('userImageUrl');
}

export function loadUser(): User {
    return new User({
        username: localStorage.getItem('username'),
        userId: localStorage.getItem('userId'),
        imageUrl: localStorage.getItem('userImageUrl'),
        userType: localStorage.getItem('userType')
    });
}

export function getUsernameFeeds(san11PkService: San11PlatformServiceService): string[] | Observable<string[]> {
    const cachedUserameFeeds = loadCacheUsernameFeeds();
    if (cachedUserameFeeds != null) {
        return cachedUserameFeeds;
    }

    return san11PkService.listUsers().pipe(
        map((resp: ListUsersResponse) => {
            const usernames = resp.users.map((user: User) => `@${user.username}`);
            cacheUsernameFeeds(usernames);
            return usernames;
        })
    );
}

function cacheUsernameFeeds(usernames: string[]) {
    const cacheStr = usernames.join('|');
    localStorage.setItem('usernameFeeds', cacheStr);
}

function loadCacheUsernameFeeds(): null | string[] {
    const cachedUserames = localStorage.getItem('usernameFeeds');
    if (cachedUserames != null) {
        return cachedUserames.split('|');
    }
    return null;
}
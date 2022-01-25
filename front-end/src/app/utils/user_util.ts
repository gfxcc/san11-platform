import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { ListUsersResponse, User } from "../../proto/san11-platform.pb";
import { San11PlatformServiceService } from "../service/san11-platform-service.service";


export function isAdmin(): boolean {
    return localStorage.getItem('userType') === User.UserType[User.UserType.ADMIN];
}

export function getUserUrl(user: User): string {
    return 'users/' + user.userId;
}

export function signedIn(): boolean {
    const user = loadUser();
    return user.userId != '0' && user.username != '';
}

export function saveUser(user: User) {
    localStorage.setItem('userId', user.userId);
    localStorage.setItem('username', user.username);
    localStorage.setItem('userType', User.UserType[user.type]);
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
        userId: localStorage.getItem('userId'),
        username: localStorage.getItem('username'),
        type: User.UserType[localStorage.getItem('userType')],
        imageUrl: localStorage.getItem('userImageUrl'),
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
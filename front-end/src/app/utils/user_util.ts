import { User } from "../../proto/san11-platform.pb";


export function isAdmin(): boolean {
    return localStorage.getItem('userType') === User.UserType[User.UserType.ADMIN];
}

export function getUserUri(user: User): string {
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

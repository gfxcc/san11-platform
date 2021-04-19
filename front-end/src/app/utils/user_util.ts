import { User } from "../../proto/san11-platform.pb";


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


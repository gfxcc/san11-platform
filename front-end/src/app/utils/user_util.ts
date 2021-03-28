import { User } from "../../proto/san11-platform.pb";


export function isAdmin(): boolean {
    return localStorage.getItem('userType') === 'admin';
}

export function getUserUrl(user: User): string {
    return 'users/' + user.userId;
}


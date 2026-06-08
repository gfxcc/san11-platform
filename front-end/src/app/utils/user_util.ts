import { User } from "../../proto/san11-platform.pb";


export function isAdmin(): boolean {
    return parseUserType(localStorage.getItem('userType')) === User.UserType.ADMIN;
}

export function getUserUri(user: User): string {
    return 'users/' + user.userId;
}

export function signedIn(): boolean {
    const user = loadUser();
    return !!user.userId && user.userId !== '0' && !!user.username;
}

export function saveUser(user: User) {
    localStorage.setItem('userId', user.userId);
    localStorage.setItem('username', user.username);
    localStorage.setItem('userType', User.UserType[parseUserType(user.type)]);
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
    const userId = localStorage.getItem('userId') ?? '0';
    const username = localStorage.getItem('username') ?? '';
    const userType = localStorage.getItem('userType');
    const imageUrl = localStorage.getItem('userImageUrl') ?? '';

    return new User({
        name: `users/${userId}`,
        userId: userId,
        username: username,
        type: parseUserType(userType),
        imageUrl: imageUrl,
    });
}

function parseUserType(userType: User.UserType | string | null | undefined): User.UserType {
    if (typeof userType === 'number') {
        return userType;
    }

    if (!userType) {
        return User.UserType.USER_TYPE_UNSPECIFIED;
    }

    const numericUserType = Number(userType);
    if (!Number.isNaN(numericUserType) && User.UserType[numericUserType] !== undefined) {
        return numericUserType as User.UserType;
    }

    return User.UserType[userType] ?? User.UserType.USER_TYPE_UNSPECIFIED;
}

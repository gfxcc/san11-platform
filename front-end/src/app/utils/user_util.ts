


export function isAdmin(): boolean {
    return localStorage.getItem('userType') === 'admin';
}

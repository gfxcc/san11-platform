import { User } from "../../proto/san11-platform.pb";
import { clearUser, loadUser, saveUser, signedIn } from "./user_util";

describe('user_util', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('treats empty browser storage as anonymous', () => {
        expect(signedIn()).toBeFalse();

        const user = loadUser();
        expect(user.userId).toBe('0');
        expect(user.username).toBe('');
        expect(user.name).toBe('users/0');
    });

    it('detects a saved user as signed in', () => {
        saveUser(new User({
            userId: '123',
            username: 'tester',
            type: User.UserType.REGULAR,
            imageUrl: 'static/avatar.png',
        }));

        expect(signedIn()).toBeTrue();
        expect(loadUser().userId).toBe('123');
        expect(loadUser().username).toBe('tester');
    });

    it('returns to anonymous state after clearing the user', () => {
        saveUser(new User({
            userId: '123',
            username: 'tester',
            type: User.UserType.REGULAR,
        }));

        clearUser();

        expect(signedIn()).toBeFalse();
        expect(loadUser().userId).toBe('0');
    });
});

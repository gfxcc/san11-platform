
export function onMobile(): boolean {
    return window.matchMedia('(max-width: 40rem)').matches;
}
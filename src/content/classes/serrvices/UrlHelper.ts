export class UrlHelper {
    public static getCurrentMatchIdFromUrl(): string | null {
        const indexLastSlash: number = window.location.href.lastIndexOf('/');
        if (indexLastSlash >= 0) {
            return window.location.href.substring(indexLastSlash + 1);
        } else {
            console.error(`Url does not seem to contain a slash?`);
            return null;
        }
    }
}
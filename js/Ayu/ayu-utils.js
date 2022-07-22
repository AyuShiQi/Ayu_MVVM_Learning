export default class Utils {
    static deleteBlank(str) {
        const regBlank = /[\n\r]/g;
        const parts = str.split(regBlank);
        return parts.reduce((prev, attr) => {
            return prev + attr;
        });
    }
}

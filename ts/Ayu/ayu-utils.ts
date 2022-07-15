/**
 * 工具类
 */
export default class Utils {
    private constructor(){}

    /**
     * 删除HTML一段字符串中的回车
     * @param str 
     * @returns 删除空白后的新字符串
     */
    static deleteBlank(str: string): string {
        const regBlank = /[\n\r]/g;

        const parts = str.split(regBlank);
        return parts.reduce((prev: string,attr: string)=>{
            return prev+attr;
        });
    }
}
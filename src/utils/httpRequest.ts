export class HttpRequest {
    public static loadImageAsync(url: string): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.onload = _ => {
                resolve(image)
            }
            image.onerror = _ =>{
                reject(`could not loadimage at ${url}`)
            }
            image.src = url;
        })
    }

    public static loadTextFileAsync(url: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = (evt: Event): any => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    resolve(xhr.responseText);
                }
            }
            xhr.open("get",url);
            xhr.send();
        })
    }

    public static loadArrayBuuferAsync(url: string): Promise<ArrayBuffer> {
        return new Promise<ArrayBuffer>((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.responseType = "arraybuffer";
            xhr.onreadystatechange = (evt: Event): any => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    resolve(xhr.response as ArrayBuffer);
                }
            }
            xhr.open("get", url);
            xhr.send();
        })
    }
}
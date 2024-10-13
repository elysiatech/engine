import { Asset } from './Asset';
export class ImageAsset extends Asset {
    url;
    constructor(url) {
        super();
        this.url = url;
    }
    async loader() {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = this.url;
        });
    }
}

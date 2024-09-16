const HEX: string[] = Array.from({ length: 256 }, (_, i) => (i + 256).toString(16).substring(1));

let buffer: number[] | null = null;

let bufferIndex = 0;

export function generateUUID(): string {

    if (!buffer || bufferIndex + 16 > 256) {
        buffer = Array.from({ length: 256 }, () => Math.floor(256 * Math.random()));
        bufferIndex = 0;
    }

    const uuid: string[] = new Array(36);

    let index = 0;

    for (let i = 0; i < 16; i++) {
        const num = buffer[bufferIndex + i];
        if (i === 6) {
            uuid[index] = HEX[num & 15 | 64];
        } else if (i === 8) {
            uuid[index] = HEX[num & 63 | 128];
        } else {
            uuid[index] = HEX[num];
        }
        index++;

        if ((i & 1) && i > 1 && i < 11) {
            uuid[index] = '-';
            index++;
        }
    }

    bufferIndex++;

    return uuid.join('');
}


import Konva from 'konva';

export const loadImage = async (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = src
        image.addEventListener('load', () => resolve(image), { once: true })
        image.addEventListener('load', reject, { once: true })
    })
}

export const drawXMark = (x1: number, y1: number, color: string, width: number, height: number, sWidth: number) => {
    const line1 = new Konva.Line({
        points: [x1, y1, x1 + width, y1 + height],
        stroke: color,
        strokeWidth: sWidth,
        lineCap: 'round',
    });
    const line2 = new Konva.Line({
        points: [x1 + width, y1, x1, y1 + height],
        stroke: color,
        strokeWidth: sWidth,
        lineCap: 'round',
    });
    return [line1, line2]
}
export const drawBars = (x: number, y: number, width: number, height: number, color: string, sWidth: number) => {

    const barsIcon = new Konva.Group({
        x: x,
        y: y,
    })
    const distance = height / 3

    for (let i = 0; i < 3; i++) {
        const line = new Konva.Line({
            points: [barsIcon.x(), barsIcon.y() + distance * i, barsIcon.x() + width, barsIcon.y() + distance * i],
            stroke: color,
            strokeWidth: sWidth,
            lineCap: 'round',
            lineJoin: 'round',
        });
        barsIcon.add(line)
    }
    return barsIcon
}
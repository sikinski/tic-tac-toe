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
        hitStrokeWidth: 15,
    });
    const line2 = new Konva.Line({
        points: [x1 + width, y1, x1, y1 + height],
        stroke: color,
        strokeWidth: sWidth,
        lineCap: 'round',
        hitStrokeWidth: 15,
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
            hitStrokeWidth: 20,
        });
        barsIcon.add(line)
    }
    
    return barsIcon
}

export const drawEllipsis = (x: number, y: number, width: number, height: number, color:string, r: number) => {
    const icon = new Konva.Group({
        x: x,
        y: y,
    })
    const distance = width / 3

    for (let i = 0; i < 3; i++) {
        const circle = new Konva.Circle({
            x: x + distance * i ,
            y: y + height / 2,
            radius: r,
            fill: color,
        });
        circle.hitFunc(function(context) {
            context.beginPath();
            context.rect(0, 0, 30, 30);
            context.closePath();
            context.fillStrokeShape(circle);
          });
        icon.add(circle)
    }
    return icon
}
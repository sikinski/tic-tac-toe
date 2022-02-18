import { Stage } from "konva/lib/Stage"

import Konva from 'konva';

export class Game {
    stage: Stage;
    public numCell: number = 3

    constructor(idContainer: string, width: number, height: number) {
        this.stage = new Konva.Stage({
            container: idContainer,
            width: width,
            height: height
        })
    }

    renderHeading() {
        const layer = new Konva.Layer();

        const heading = new Konva.Text({
            x: this.stage.width() / 2,
            y: 15,
            text: 'Tic-tac-toe',
            fontSize: 36,
            fontFamily: 'Averta-Bold',
            fill: 'black',
        });
        heading.offsetX(heading.width() / 2);
        layer.add(heading);
        this.stage.add(layer)
    }
    renderField() {
        const layer = new Konva.Layer();

        const dimensionField: number = 400
        const offsetX: number = this.stage.width() / 2 - dimensionField / 2
        const offsetY: number = this.stage.height() / 2 - dimensionField / 2

        const field = new Konva.Rect({
            x: offsetX,
            y: offsetY,
            width: dimensionField,
            height: dimensionField,
            fill: 'MistyRose',
            shadowBlur: 10,
            cornerRadius: 10,
        });

        layer.add(field);

        const grid = new Konva.Group({
            x: offsetX,
            y: offsetY,
        });
        const dimensionCell = dimensionField / this.numCell

        for (let i = 1; i < this.numCell; i++) {
            const vLine = new Konva.Line({
                points: [i * dimensionCell, 0, i * dimensionCell, dimensionCell * this.numCell],
                stroke: '#1f1f1f',
                strokeWidth: 5,
            });
            const gLine = new Konva.Line({
                points: [0, i * dimensionCell, dimensionCell * this.numCell, i * dimensionCell],
                stroke: '#1f1f1f',
                strokeWidth: 5,
            });
            grid.add(vLine)
            grid.add(gLine)
        }
        layer.add(grid)
        this.stage.add(layer);
    }

    initRender() {
        this.renderHeading()
        this.renderField()
    }
}
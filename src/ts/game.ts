import { Stage } from "konva/lib/Stage"

import Konva from 'konva';
import {
    loadImage,
    drawXMark,
    drawBars,
    drawEllipsis,
} from './utils'

export class Game {
    stage: Stage;
    public numCell: number = 3
    public btnArea: Array<object> = []
    public numPlayers: number = 1
    public wins: number = 0
    public losses: number = 0
    public round: number = 0
    public imgsPaths: { name: string, path: string }[] = []
    public imgs: { [key: string]: HTMLImageElement } = {}

    public themes: Array<string> = ['light', 'dark', 'neon', 'anime']

    constructor(idContainer: string, width: number, height: number) {
        this.stage = new Konva.Stage({
            container: idContainer,
            width: width,
            height: height
        })
        // this.init()
    }
    // init() {
    //     // this.imgsPaths = [
    //     //     { name: 'bars', path: 'src/images/icons/bars.svg' },
    //     //     { name: 'xmark', path: 'src/images/icons/xmark.svg' },
    //     // ]
    // }

    // async preloadImgs() {
    //     this.imgs = {}
    //     for (const { name, path } of this.imgsPaths) {
    //         this.imgs[name] = await loadImage(path)
    //     }
    // }

    renderHeading() {
        const layer = new Konva.Layer();

        const heading = new Konva.Text({
            x: this.stage.width() / 2,
            y: 25,
            text: 'Tic-tac-toe',
            fontSize: 32,
            fontFamily: 'Averta-Bold',
            fill: 'black',
        });
        heading.offsetX(heading.width() / 2);
        layer.add(heading);
        this.stage.add(layer)
    }
    renderField() {
        const layer = new Konva.Layer();

        const dimensionField: number = 380
        const offsetX: number = this.stage.width() / 2 - dimensionField / 2
        const offsetY: number = (this.stage.height() / 2 - dimensionField / 2) - 20

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
                strokeWidth: 4,
            });
            const gLine = new Konva.Line({
                points: [0, i * dimensionCell, dimensionCell * this.numCell, i * dimensionCell],
                stroke: '#1f1f1f',
                strokeWidth: 4,
            });
            grid.add(vLine)
            grid.add(gLine)
        }
        layer.add(grid)
        this.stage.add(layer);
    }
    renderButtons() {
        const layer = new Konva.Layer()

        const widthBtn = 160
        const heightBtn = 50
        const margin = 25

        const names = ['changeXO', 'restart', `players (${this.numPlayers})`]

        const groupBtns = new Konva.Group({
            x: this.stage.width() / 2 - (widthBtn * names.length + margin) / 2,
            y: this.stage.height() - heightBtn * 2,
        });

        for (let i = 0; i < names.length; i++) {
            const btn = new Konva.Rect({
                x: i * widthBtn + i * margin,
                y: 13,
                width: widthBtn,
                height: heightBtn,
                name: names[i],
                fill: '#1f1f1f',
                stroke: '#1f1f1f',
                strokeWidth: 2,
                shadowBlur: 15,
                cornerRadius: 14,
            });

            const text = new Konva.Text({
                x: btn.x(),
                y: btn.y(),
                text: `${names[i]}`,
                fontSize: 16,
                fontFamily: 'Averta-Bold',
                fill: 'white',
                width: btn.width(),
                padding: 20,
                align: 'center',
                verticalAlign: 'middle',
            })

            this.btnArea.push({ name: btn.name(), x: btn.x(), y: btn.y(), width: widthBtn, height: heightBtn }) // coords inside the group!

            groupBtns.add(btn)
            groupBtns.add(text)
        }

        layer.add(groupBtns)
        this.stage.add(layer)
    }
    toggleNav() {
        const layer = new Konva.Layer()
        layer.add(drawBars(15, 15, 25, 25, 'black', 2))
        this.stage.add(layer)
    }
    renderNavigation() {
        const layer = new Konva.Layer()

        const container = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.stage.width() / 6,
            height: this.stage.height(),
        });
        const borderRight = new Konva.Line({
            points: [container.x() + container.width(), container.y(), container.x() + container.width(), container.y() + container.height()],
            stroke: 'black',
            shadowColor: 'black',
            shadowBlur: 15,
            shadowOffset: { x: 0, y: 10 },
            shadowOpacity: 0.5,
            strokeWidth: 2,
            lineCap: 'round',
        })

        const heading = new Konva.Text({
            x: container.x(),
            y: 15,
            width: container.width(),
            text: 'menu',
            fontSize: 30,
            fontFamily: 'Averta-Bold',
            align: 'center',
            fill: 'black',
        })

        const underHeadingLine = new Konva.Line({
            points: [heading.x(), heading.y() + heading.height() + 15, heading.x() + heading.width(), heading.y() + heading.height() + 15],
            stroke: 'black',
            shadowColor: 'black',
            shadowBlur: 15,
            shadowOffset: { x: 0, y: 10 },
            shadowOpacity: 0.5,
            strokeWidth: 2,
            lineCap: 'round',
        })

        const list = new Konva.Group({
            x: container.x(),
            y: 40,
        });

        const items = [`round: ${this.round}`, `won: ${this.wins}`, `lost: ${this.losses}`, '3x3', '6x6', '9x9', 'info'];

        for (let i = 0; i < items.length; i++) {
            if (i < items.length - 1) {
                const item = new Konva.Text({
                    x: list.x(),
                    y: list.y() + 20 + 60 * i,
                    width: container.width(),
                    text: items[i],
                    fontSize: 20,
                    fontFamily: 'Averta-Bold',
                    align: 'center',
                    fill: 'black',
                })
                list.add(item)
            } else {
                const bottomItem = new Konva.Text({
                    x: list.x(),
                    y: list.y() + container.height() - heading.height() - 100,
                    width: container.width(),
                    text: items[i],
                    fontSize: 20,
                    fontFamily: 'Averta-Bold',
                    align: 'center',
                    fill: 'black',
                })
                list.add(bottomItem)
            }
        }
        const xBtn = {
            x: container.x() + container.width() + 17,
            y: container.y() + 17,
            width: 15,
            height: 15,
        }

        const lines = drawXMark(xBtn.x, xBtn.y, 'black', xBtn.width, xBtn.height, 3)
        layer.add(lines[0], lines[1])

        layer.add(container)
        layer.add(borderRight)
        layer.add(heading)
        layer.add(underHeadingLine)
        layer.add(list)
        this.stage.add(layer)

    }
    toggleThemes() {
        const layer = new Konva.Layer()
        const width = 30
        const height = 10

        const toggleBtn = {
            x: this.stage.width() / 2 - width,
            y: 15,
            width: width,
            height: height,
            color: 'black',
            radius: 3,
        }
        layer.add(drawEllipsis(toggleBtn.x, toggleBtn.y, toggleBtn.width, toggleBtn.height, toggleBtn.color, toggleBtn.radius))
        this.stage.add(layer)

        // this.renderPopup(this.stage.width() - 220, toggleBtn.y)
    }

    renderPopup(x: number, y: number) {
        const layer = new Konva.Layer()
        const widthPopup = 200

        const popup = new Konva.Rect({
            x: x,
            y: y + 50,
            width: widthPopup,
            height: 250,
            stroke: 'black',
            strokeWidth: 2,
            shadowBlur: 5,
            cornerRadius: 10,
        });
        layer.add(popup);

        const heading = new Konva.Text({
            x: popup.x() + 8,
            y: popup.y() + 12,
            text: 'Themes:',
            fontSize: 28,
            fontFamily: 'Averta-Bold',
            fill: 'pink',
            align: 'center',
        });

        layer.add(heading)

        const list = new Konva.Group({
            x: popup.x() + 8,
            y: popup.y() + 30,
        })

        for (let i = 0; i < this.themes.length; i++) {
            const itemText = new Konva.Text({
                x: 8,
                y: 20 + 30 * i,
                text: this.themes[i],
                fontSize: 20,
                fontFamily: 'Averta-Bold',
                fill: 'black',
                align: 'center',
            });
            list.add(itemText)
        }
        layer.add(list)

        this.stage.add(layer)
    }

    async initRender() {
        // await this.preloadImgs()
        this.renderHeading()
        this.renderField()
        this.renderButtons()
        this.toggleNav()
        // this.renderNavigation()
        this.toggleThemes()
    }
}
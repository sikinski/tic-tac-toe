import { Stage } from "konva/lib/Stage"
import { Layer } from "konva/lib/Layer"

import Konva from 'konva';
import {
    loadImage,
    drawXMark,
    drawBars,
    drawEllipsis,
} from './utils'
import { Rect } from "konva/lib/shapes/Rect";
import { Group } from "konva/lib/Group";
import { BtnArea } from './interfaces'

export class Game {
    stage: Stage;

    // state
    public numCell: number = 3
    public numPlayers: number = 1
    public round: number = 0
    public wins: number = 0
    public losses: number = 0
    public actualMove: string = 'x'

    // booleans
    public modalOpen: boolean = false
    public popupOpen: boolean = false

    // others
    // public btnAreas: Array<object> = []
    public imgsPaths: { name: string, path: string }[] = []
    public imgs: { [key: string]: HTMLImageElement } = {}
    public coordsCells: { x1: number, y1: number, x2: number, y2: number }[] = []

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

    renderField() {
        const layer = new Konva.Layer();

        const field = new Konva.Rect({
            height: this.stage.height() / 1.5,
            fill: 'MistyRose',
            shadowBlur: 10,
            cornerRadius: 10,
        });
        field.setAttr('width', field.height())

        const offsetX = this.stage.width() / 2 - field.width() / 2
        const offsetY = (this.stage.height() / 2 - field.height() / 2) - 50
        field.setAttr('x', offsetX)
        field.setAttr('y', offsetY)
        const dimensionField = field.height()

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

        const cellWidth = field.width() / this.numCell
        const cellHeight = field.height() / this.numCell

        const addCoords = () => {
            for (let i = 0; i < this.numCell; i++) {
                for (let j = 0; j < this.numCell; j++) {
                    this.coordsCells.push({
                        x1: cellWidth * j,
                        y1: cellHeight * i,
                        x2: cellWidth * (j + 1),
                        y2: cellHeight * (i + 1)
                    },
                    )
                }
            }
        }
        addCoords()

        this.stage.add(layer);
        this.clickHandler(field, layer)
    }

    renderButtons() {
        const layer = new Konva.Layer()

        const widthBtn = 160
        const heightBtn = 50
        const margin = 25

        const names = ['changeXO', 'restart', 'players']

        const groupBtns = new Konva.Group({
            x: this.stage.width() / 2 - (widthBtn * names.length + margin) / 2,
            y: this.stage.height() - heightBtn * 2,
        });

        let btnAreas: Array<BtnArea> = []


        for (let i = 0; i < names.length; i++) {
            const btn = new Konva.Rect({
                x: i * widthBtn + i * margin,
                y: 0,
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

            btnAreas.push({ name: btn.name(), x1: btn.x(), y1: btn.y(), x2: btn.x() + widthBtn, y2: btn.y() + heightBtn })

            groupBtns.add(btn)
            groupBtns.add(text)
        }

        layer.add(groupBtns)
        this.stage.add(layer)
        this.btnClick(groupBtns, btnAreas, layer)
    }

    toggleNav() {
        const layer = new Konva.Layer()
        let modalOpen = false

        const renderNav = () => {
            const widthPanel = this.stage.width() / 6

            let container: Rect

            let offsetXNav

            if (modalOpen) {
                offsetXNav = 0
            } else {
                offsetXNav = -widthPanel - 15
            }

            container = new Konva.Rect({
                x: offsetXNav,
                y: 0,
                width: widthPanel,
                height: this.stage.height(),
            });

            layer.add(container)

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
            layer.add(borderRight)


            const heading = new Konva.Text({
                x: container.x(),
                y: 15,
                width: container.width(),
                text: 'Tic-tac-toe',
                fontSize: 26,
                fontFamily: 'Averta-Bold',
                align: 'center',
                fill: 'black',
            })
            layer.add(heading)


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
            layer.add(underHeadingLine)


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
            layer.add(list)
            renderBtn(container)
        }

        let btn: Group;

        const renderBtn = (container: Rect) => {
            if (!modalOpen) {
                btn = drawBars(15, 15, 25, 25, 'black', 2)

                btn.on('mouseup', () => {
                    btn.hide()
                    modalOpen = true
                    layer.removeChildren()
                    renderNav()
                })
            } else {
                btn.hide()
                const btnMethics = {
                    x: container.x() + container.width() + 17,
                    y: container.y() + 17,
                    width: 15,
                    height: 15,
                }
                btn = drawXMark(btnMethics.x, btnMethics.y, 'black', btnMethics.width, btnMethics.height, 3)

                btn.on('mouseup', () => {
                    btn.hide()
                    modalOpen = false
                    layer.removeChildren()
                    renderNav()
                })
            }
            layer.add(btn)
        }

        renderNav()
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
        const btn = drawEllipsis(toggleBtn.x, toggleBtn.y, toggleBtn.width, toggleBtn.height, toggleBtn.color, toggleBtn.radius)
        layer.add(btn)

        const renderPopup = () => {
            const widthPopup = 180

            const popup = new Konva.Rect({
                x: this.stage.width() - 200,
                y: toggleBtn.y + 50,
                width: widthPopup,
                stroke: 'black',
                strokeWidth: 2,
                shadowBlur: 3,
                cornerRadius: 7,
            });
            layer.add(popup);

            const heading = new Konva.Text({
                x: popup.x(),
                y: popup.y() + 12,
                width: popup.width(),
                text: 'Themes:',
                fontSize: 28,
                fontFamily: 'Averta-Bold',
                fill: 'pink',
                align: 'center',
            });

            layer.add(heading)

            const list = new Konva.Group({
                x: popup.x(),
                y: popup.y() + 30,
            })

            let heightItems = 0;

            for (let i = 0; i < this.themes.length; i++) {
                const itemText = new Konva.Text({
                    x: 0,
                    y: 35 + 30 * i,
                    text: this.themes[i],
                    fontSize: 20,
                    width: popup.width(),
                    fontFamily: 'Averta-Bold',
                    fill: 'black',
                    align: 'center',
                });
                list.add(itemText)
                heightItems += itemText.height() + 30
            }

            popup.setAttr('height', heading.height() + heightItems);
            layer.add(list)
        }

        btn.on('mouseup', () => {
            if (this.popupOpen) {
                layer.removeChildren()
                this.popupOpen = false
                this.toggleThemes()
            } else {
                renderPopup()
                this.popupOpen = true
            }
        });

        this.stage.add(layer)
    }

    clickHandler = async (field: Rect, layer: Layer) => {
        field.on('mouseup', () => {
            let clickedCellNum: number;
            const pos = field.getRelativePointerPosition()

            for (let i = 0; i < this.coordsCells.length; i++) {
                if (
                    this.coordsCells[i].x1 <= pos.x && this.coordsCells[i].x2 >= pos.x && this.coordsCells[i].y1 <= pos.y && this.coordsCells[i].y2 >= pos.y) {

                    clickedCellNum = i

                    const clickedCell = this.coordsCells[clickedCellNum]

                    const padding = (clickedCell.x2 - clickedCell.x1) / 4
                    const width = clickedCell.x2 - clickedCell.x1 - padding * 2
                    const height = clickedCell.y2 - clickedCell.y1 - padding * 2
                    const offsetX = Math.floor(field.x()) + clickedCell.x1 + padding
                    const offsetY = Math.floor(field.y()) + clickedCell.y1 + padding

                    // Moving
                    if (this.actualMove === 'x') {
                        const xMark = drawXMark(offsetX, offsetY, 'black', width, height, 5)
                        layer.add(xMark)
                        this.actualMove = 'o'
                    } else if (this.actualMove === 'o') {
                        const oMark = new Konva.Circle({
                            radius: width / 2,
                            stroke: 'black',
                            strokeWidth: 4,
                        })
                        oMark.setAttr('x', offsetX + oMark.radius())
                        oMark.setAttr('y', offsetY + oMark.radius())

                        layer.add(oMark)
                        this.actualMove = 'x'
                    }

                }
            }
        })
    }
    btnClick = (groupBtns: Group, btnAreas: Array<BtnArea>, layer: Layer) => {

        groupBtns.on('mousedown', () => {
            const pos = groupBtns.getRelativePointerPosition()

            const area = btnAreas.find((obj) => obj.x1 <= pos.x && obj.x2 >= pos.x && obj.y1 <= pos.y && obj.y2 >= pos.y)

            if (area && area.name) {
                if (area.name === 'changeXO') {
                    this.actualMove = 'o'
                } else if (area.name === 'restart') {
                    this.newGame()
                } else if (area.name === 'players') {
                    this.numPlayers = this.numPlayers === 1 ? 2 : 1
                }
            }
        });
    }
    newGame = () => {
        this.numCell = 3
        this.numPlayers = 1
        this.round = 0
        this.wins = 0
        this.losses = 0
        this.actualMove = 'x'
    }

    async initRender() {
        // await this.preloadImgs()
        this.renderField()
        this.renderButtons()
        this.toggleNav()
        this.toggleThemes()
    }
}
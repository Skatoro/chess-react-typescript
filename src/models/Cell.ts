import {Colors} from "./Colors";
import {Figure, FigureNames, FigureShortNames} from "./figures/Figure";
import {Board} from "./Board";
import {Queen} from "./figures/Queen";
import cloneDeep from "lodash/cloneDeep";

export class Cell {
    readonly x: number;
    readonly y: number;
    readonly color: Colors;
    figure: Figure | null;
    board: Board;
    available: boolean; // is it possible to move
    id: number; // react keys
    isAvailableForWhiteKing: boolean = true;
    isAvailableForBlackKing: boolean = true;
    isNearWhiteKing: boolean = false;
    isNearBlackKing: boolean = false;

    constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.figure = figure;
        this.board = board;
        this.available = false;
        this.id = Math.random();
    }

    private castleKing(target: Cell) {
        const rookCell = this.board.getCompatibleRookForCastle(this, target);
        if (rookCell) {
            const newRookX = rookCell?.x === 7 ? 5 : 3;
            const newRookY = rookCell?.y;
            const newCell = this.board.getCell(newRookX, newRookY)

            rookCell.moveFigure(newCell)
        }

    }

    private promotePawn() {
        if(this.figure) {
            this.figure = new Queen(this.figure?.color, this.board.getCell(this.x, this.y));
        }
    }

    private resetAvailableCellsForKings() {
        for (let row of this.board.cells) {
            for (let cell of row) {
                cell.isAvailableForWhiteKing = true;
                cell.isAvailableForBlackKing = true;
            }
        }
    }

    private setAttacksForFigure(figure: Figure) {
        for (let row of this.board.cells) {
            for (let cell of row) {
                if (figure.canAttack(cell)) {
                    if (figure.color === Colors.BLACK) {
                        cell.isAvailableForWhiteKing = false
                    }
                    if (figure.color === Colors.WHITE) {
                        cell.isAvailableForBlackKing = false;
                    }
                }
            }
        }
    }

    private setFigure(figure: Figure) {
        this.figure = figure;
        this.figure.cell = this;
    }

    private setIsNearKing() {
        let whiteKingCell = this.board.getKingCell(Colors.WHITE);
        let blackKingCell = this.board.getKingCell(Colors.BLACK);

        this.board.cells.flat().forEach(cell => {
            cell.isNearWhiteKing = false;
            cell.isNearBlackKing = false;
        });

        let range = [-1, 0, 1];
        for (let i of range) {
            for (let j of range) {
                if (this.areIndexesValid(this.board.cells, [whiteKingCell.y - i, whiteKingCell.x - j])) {
                    this.board.cells[whiteKingCell.y - i][whiteKingCell.x - j].isNearWhiteKing = true;
                }
                if (this.areIndexesValid(this.board.cells, [blackKingCell.y - i, blackKingCell.x - j])) {
                    this.board.cells[blackKingCell.y - i][blackKingCell.x - j].isNearBlackKing = true;
                }
            }
        }
    }

    public areIndexesValid(nestedArray: any[], indexes: number[]): boolean {
        let currentArray = nestedArray;

        for (const index of indexes) {
            if (!Array.isArray(currentArray) || index < 0 || index >= currentArray.length) {
                return false;
            }
            currentArray = currentArray[index];
        }

        return true;
    }

    public isEmpty(currentFigure: Figure | null): boolean {
        let isKingInvisible = currentFigure?.color !== this.figure?.color && this.figure?.name === FigureNames.KING;

        return !this.figure || (isKingInvisible);
    }

    public isEnemy(target: Cell): boolean {
        if (target.figure) {
            return this.figure?.color !== target.figure.color;
        }
        return false
    }

    public isEmptyVertical(target: Cell): boolean {
        if (this.x !== target.x) {
            return false
        }
        if (this.x === target.x && this.y === target.y) {
            return false
        }
        const min = Math.min(this.y, target.y);
        const max = Math.max(this.y, target.y);
        for (let y = min + 1; y < max; y++) {
            if (!this.board.getCell(this.x, y).isEmpty(this.figure)) {
                return false
            }
        }
        return true;
    }

    public isEmptyHorizontal(target: Cell): boolean {
        if (this.y !== target.y) {
            return false
        }
        if (this.x === target.x && this.y === target.y) {
            return false
        }
        const min = Math.min(this.x, target.x);
        const max = Math.max(this.x, target.x);
        for (let x = min + 1; x < max; x++) {
            if (!this.board.getCell(x, this.y,).isEmpty(this.figure)) {
                return false
            }
        }
        return true;

    }

    public isEmptyDiagonal(target: Cell): boolean {
        const absX = Math.abs(target.x - this.x)
        const absY = Math.abs(target.y - this.y)
        if (absY !== absX) {
            return false
        }
        if (this.x === target.x && this.y === target.y) {
            return false
        }
        const dy = this.y < target.y ? 1 : -1;
        const dx = this.x < target.x ? 1 : -1;

        for (let i = 1; i < absY; i++) {
            if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty(this.figure)) {
                return false;
            }
        }
        return true;
    }

    public setAvailableCellsForKings() {
        this.resetAvailableCellsForKings()

        for (let row of this.board.cells) {
            for (let cell of row) {
                if (cell.figure) {
                    this.setAttacksForFigure(cell.figure)
                }
            }
        }
    }

    public getFigureMoveNode(oldCell: Cell, currentCell: Cell, captured: boolean): string {
        const letterCords = ["a", "b", "c", "d", "e", "f", "g", "h"];
        const isKingCastling = oldCell.figure?.name === FigureNames.KING && Math.abs(oldCell.x - currentCell.x) === 2;
        const isPawnPromotion = oldCell.figure?.name === FigureNames.PAWN && this.isLastRank(oldCell.figure, currentCell.y);

        if (isKingCastling) {
            this.board.moveHistory.pop();
            return currentCell.x > oldCell.x ? "O-O" : "O-O-O";

        }
        let promotionFigure = isPawnPromotion ? '=' + currentCell.figure?.shortName : '';
        let figureShortName: FigureShortNames | undefined | string = oldCell.figure?.shortName;
        let captureSign = captured ? 'x' : '';
        let oldX = letterCords[oldCell.x];
        let newX = letterCords[currentCell.x];
        let newY = (8 - currentCell.y).toString();

        if (oldCell.figure?.name === FigureNames.PAWN && captured) {
            figureShortName = oldX;
        }

        return figureShortName + captureSign + newX + newY + promotionFigure;
    }

    public isLastRank(figure: Figure | null, currentY: Number): boolean {
        let figureColor = figure?.color;
        if (figureColor === Colors.BLACK && currentY === 7){
            return true
        }
        if (figureColor === Colors.WHITE && currentY === 0) {
            return true
        }
        return false
    }

    public moveFigure(target: Cell) {
        if (this.figure && this.figure?.canMove(target)) {
            const moveHistory =  this.board.moveHistory;
            let oldCell = cloneDeep(this);

            if (this.figure.name === FigureNames.KING && Math.abs(this.x - target.x) === 2) {
                this.castleKing(target)
            }
            if (this.figure.name === FigureNames.PAWN) {
                let lastRank = this.figure.color === Colors.BLACK ? 7 : 0;
                if (target.y === lastRank){
                    this.promotePawn();
                }
            }
            if (target.figure) {
                this.board.addLostFigure(target.figure);
            }

            let hasTargetFigure = !!target.figure;
            target.setFigure(this.figure);
            target.available = false;
            this.figure.moveFigure();
            this.figure = null;

            moveHistory.push(this.getFigureMoveNode(oldCell, target, hasTargetFigure));
            setTimeout(() => document.getElementById("moveHistory")?.scrollTo(0, 9999), 100)

            this.setAvailableCellsForKings(); // only after figure cell change
            this.board.setIsKingsUnderAttack();
            this.setIsNearKing()
            if (this.board.setFirstMoveMade) {
                this.board.setFirstMoveMade(true);
            }
            this.board.checkCheckmate(target.figure?.color);
        }
    }

}
import logo from '../../assets/black-king.png'
import {Colors} from "../Colors";
import {Cell} from "../Cell";

export enum FigureNames {
    FIGURE= "figure",
    KING= "king",
    PAWN= "pawn",
    BISHOP= "bishop",
    KNIGHT= "knight",
    ROOK= "rook",
    QUEEN= "queen",
}

export enum FigureShortNames {
    FIGURE= "figure",
    KING= "K",
    PAWN= "",
    BISHOP= "B",
    KNIGHT= "N",
    ROOK= "R",
    QUEEN= "Q",
}

export class Figure {
    color: Colors;
    logo: typeof logo | null;
    cell: Cell;
    name: FigureNames;
    shortName: FigureShortNames;
    id: number;
    moveable: boolean;
    hasBeenMoved: boolean = false;

    constructor(color: Colors, cell: Cell) {
        this.color = color;
        this.cell = cell;
        this.cell.figure = this;
        this.logo = null;
        this.name = FigureNames.FIGURE;
        this.shortName = FigureShortNames.FIGURE;
        this.id = Math.random();
        this.moveable = true;
    }

    canMove(target: Cell) : boolean {
        if (target.figure?.color === this.color) {
            return false
        }
        if (!this.moveable) {
            return false
        }
        if (this.cell.board.isKingCheckedAfterMove(this.cell, target)){
            return false
        }
        return true
    }

    canAttack(target: Cell) : boolean{
        return true;
    }

    moveFigure() {
        this.hasBeenMoved = true;
        this.cell.setAvailableCellsForKings();
    }
}
import {Figure, FigureNames, FigureShortNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-king.png";
import whiteLogo from "../../assets/white-king.png";

export class King extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.KING;
        this.shortName = FigureShortNames.KING
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target))
            return false;
        if (!this.canAttack(target)) {
            return false
        }
        return true;
    }

    canAttack(target: Cell): boolean {
        const dx = Math.abs(this.cell.x - target.x);
        const dy = Math.abs(this.cell.y - target.y);
        const kingColor = this.cell.figure?.color;
        let canKingMoveToTarget = kingColor === Colors.BLACK
            ? target.isAvailableForBlackKing && !target.isNearWhiteKing
            : target.isAvailableForWhiteKing && !target.isNearBlackKing;
        const isAround = (dx === 0 && dy === 1) || (dx === 1 && dy === 0) || (dx === 1 && dy === 1);
        const canCastleThere = this.cell.board.canKingCastleThere(this.cell, target);

        if ((isAround || canCastleThere) && canKingMoveToTarget) {
            return true
        }

        return false
    }
}
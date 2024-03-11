import {Figure, FigureNames, FigureShortNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-pawn.png";
import whiteLogo from "../../assets/white-pawn.png";

export class Pawn extends Figure {
    direction: number = this.cell.figure?.color === Colors.BLACK ? 1 : -1;

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.PAWN;
        this.shortName = FigureShortNames.PAWN;
    }

    private getFirstStepDirection(): number {
        return this.cell.figure?.color === Colors.BLACK ? 2 : -2;
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) {
            return false;
        }

        const isMovingForward = target.y === this.cell.y + this.direction;
        const isMakingFirstMove = !this.hasBeenMoved && target.y === this.cell.y + this.getFirstStepDirection();
        const isSameColumn = target.x === this.cell.x;
        const isTargetCellEmpty = this.cell.board.getCell(target.x, target.y).figure === null;
        const isTargetCellEnemy = this.cell.isEnemy(target);
        const isMovingDiagonally = target.x === this.cell.x + 1 || target.x === this.cell.x - 1;

        if (isMakingFirstMove) {
            const isWayClear = this.canMove(this.cell.board.getCell(this.cell.x, this.cell.y + this.direction));
            if (isSameColumn && isTargetCellEmpty && isWayClear) {
                return true;
            }
        }
        if (isMovingForward && isSameColumn && isTargetCellEmpty) {
            return true;
        }

        if (isMovingForward && isMovingDiagonally && isTargetCellEnemy) {
            return true;
        }

        return false;
    }

    canAttack(target: Cell): boolean {
        if (target.y === this.cell.y + this.direction) {
            if (target.x === this.cell.x + 1 || target.x === this.cell.x - 1) {
                return true
            }
        }
        return false
    }
}
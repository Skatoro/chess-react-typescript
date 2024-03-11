import {Figure, FigureNames, FigureShortNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from '../../assets/black-bishop.png';
import whiteLogo from '../../assets/white-bishop.png';

export class Bishop extends Figure{

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.BISHOP;
        this.shortName = FigureShortNames.BISHOP;
    }
    canMove(target: Cell) : boolean {
        if(!super.canMove(target))
            return false

        return this.canAttack(target);
    }
    canAttack(target: Cell): boolean{
        if(this.cell.isEmptyDiagonal(target))
            return true
        return false
    }
}
import {Figure, FigureNames, FigureShortNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-knight.png";
import whiteLogo from "../../assets/white-knight.png";

export class Knight extends Figure{

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.KNIGHT;
        this.shortName = FigureShortNames.KNIGHT;
    }
    canMove(target: Cell) : boolean {
        if(!super.canMove(target))
            return false

        return this.canAttack(target);
    }
    canAttack(target: Cell): boolean{
        const dx = Math.abs(target.x - this.cell.x)
        const dy = Math.abs(target.y - this.cell.y)

        return (dx === 1 && dy === 2) || (dx === 2 && dy === 1)
    }
}
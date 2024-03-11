import React, {FC} from 'react';
import {Cell} from "../models/Cell";
import {Colors} from "../models/Colors";
import {FigureNames} from "../models/figures/Figure";

interface CellProps {
    cell: Cell;
    selected: boolean;
    click: (cell: Cell) => void;
}

const CellComponent: FC<CellProps> = ({cell, selected, click}) => {
    let isAllyKingChecked = cell.figure?.color === Colors.WHITE ? cell.board.whiteKingUnderAttack : cell.board.blackKingUnderAttack;
    let isKing = cell.figure?.name === FigureNames.KING;
    return (
        <div
            className={["cell", cell.color].join(' ')}
            onClick={() => click(cell)}
        >
            {cell.available && !cell.figure && <div className={'available'}></div>}
            {cell.available && cell.figure && <div className={'captureAvailable'}></div>}
            {isKing && isAllyKingChecked && <div className={'checkedKing'}></div>}
            {selected && <div className={'selected'}></div>}
            {cell.figure?.logo && <img src={cell.figure.logo} alt={"figure"} draggable={false}/>}
        </div>
    );
};

export default CellComponent;
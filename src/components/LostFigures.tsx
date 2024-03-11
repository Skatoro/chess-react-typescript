import React, {FC} from 'react';
import {Figure, FigureNames} from "../models/figures/Figure";
import {Colors} from "../models/Colors";

interface LostFiguresProps {
    figures: Figure[];
}

const figureTypes = [FigureNames.PAWN, FigureNames.KNIGHT, FigureNames.BISHOP, FigureNames.ROOK, FigureNames.QUEEN];

const LostFigures: FC<LostFiguresProps> = ({figures}) => {
    const figureCounts: Record<string, number> = {
        [FigureNames.PAWN]: 0,
        [FigureNames.KNIGHT]: 0,
        [FigureNames.BISHOP]: 0,
        [FigureNames.ROOK]: 0,
        [FigureNames.QUEEN]: 0,
    };

    figures.forEach((figure) => {
        if (figureCounts.hasOwnProperty(figure.name)) {
            figureCounts[figure.name]++;
        }
    });

    figureTypes.forEach((type) => {
        let maxAmount = 2;
        if (type === FigureNames.QUEEN) {
            maxAmount = 1;
        }
        if (type === FigureNames.PAWN) {
            maxAmount = 8;
        }
        if (figureCounts[type] > maxAmount) {
            figureCounts[FigureNames.PAWN] += figureCounts[type] - maxAmount;
            figureCounts[type] = maxAmount;
        }
    });

    let color = figures[0]?.color === Colors.WHITE ? 'w' : 'b';
    return (
        <div className="lost">
            {figureTypes.map((type) => {
                return (figureCounts[type] !== 0 && <span
                        key={type}
                        className={`captured-pieces captured-pieces-${color}-${figureCounts[type]}-${type.toLowerCase()}`}
                    >
                </span>)
            }
            )}
        </div>
    );
};

export default LostFigures;
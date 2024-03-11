import {Cell} from "./Cell";
import {Colors} from "./Colors";
import {Pawn} from "./figures/Pawn";
import {Bishop} from "./figures/Bishop";
import {King} from "./figures/King";
import {Queen} from "./figures/Queen";
import {Knight} from "./figures/Knight";
import {Rook} from "./figures/Rook";
import {Figure, FigureNames} from "./figures/Figure";
import {Player} from "./Player";
import cloneDeep from 'lodash/cloneDeep';

export class Board {
    cells: Cell[][] = [];
    lostBlackFigures: Figure[] = [];
    lostWhiteFigures: Figure[] = [];
    setWinner: ((player: Player | null) => void) | undefined;
    setFirstMoveMade: ((value: boolean) => void) | undefined;
    whitePlayer: Player | null = null;
    blackPlayer: Player | null = null;
    whiteKingUnderAttack: boolean = false;
    blackKingUnderAttack: boolean = false;
    moveHistory: String[] = [];

    public initCells() {
        for (let i = 0; i < 8; i++) {
            const row: Cell[] = [];

            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 !== 0) {
                    row.push(new Cell(this, j, i, Colors.BLACK, null)) // Black cells
                } else {
                    row.push(new Cell(this, j, i, Colors.WHITE, null)) // White cells
                }
            }
            this.cells.push(row)
        }
    }

    public highlightCells(selectedCell: Cell | null) {
        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                const targetCell = row[j];
                targetCell.available = !!selectedCell?.figure?.canMove(targetCell)
            }
        }
    }

    public getCopyBoard(): Board {
        const newBoard = new Board;
        newBoard.cells = this.cells;
        newBoard.lostBlackFigures = this.lostBlackFigures;
        newBoard.lostWhiteFigures = this.lostWhiteFigures;
        newBoard.moveHistory = this.moveHistory;
        return newBoard;
    }

    public getCell(x: number, y: number) {
        return this.cells[y][x];
    }

    private addPawns() {
        for (let i = 0; i < 8; i++) {
            new Pawn(Colors.BLACK, this.getCell(i, 1))
            new Pawn(Colors.WHITE, this.getCell(i, 6))
        }
    }

    private addKnights() {
        for (let i = 0; i < 2; i++) {
            new Knight(Colors.BLACK, this.getCell(i * 5 + 1, 0))
            new Knight(Colors.WHITE, this.getCell(i * 5 + 1, 7))
        }
    }

    private addBishops() {
        for (let i = 0; i < 2; i++) {
            new Bishop(Colors.BLACK, this.getCell(i * 3 + 2, 0))
            new Bishop(Colors.WHITE, this.getCell(i * 3 + 2, 7))
        }
    }

    private addRooks() {
        for (let i = 0; i < 2; i++) {
            new Rook(Colors.BLACK, this.getCell(i * 7, 0))
            new Rook(Colors.WHITE, this.getCell(i * 7, 7))
        }
    }

    private addQueens() {
        new Queen(Colors.BLACK, this.getCell(3, 0))
        new Queen(Colors.WHITE, this.getCell(3, 7))
    }

    private addKings() {
        new King(Colors.BLACK, this.getCell(4, 0))
        new King(Colors.WHITE, this.getCell(4, 7))
    }

    public addFigures() {
        this.addPawns()
        this.addKnights()
        this.addBishops()
        this.addRooks()
        this.addQueens()
        this.addKings()
    }

    public addLostFigure(lostFigure: Figure) {
        if (lostFigure.color === Colors.WHITE) {
            this.lostWhiteFigures.push(lostFigure);
        } else {
            this.lostBlackFigures.push(lostFigure);
        }
    }

    public getKingCell(kingColor: Colors): Cell {
        let enemyKingCell: Cell = this.cells[0][0];

        this.cells.flat().forEach(cell => {
            if (cell.figure && cell.figure.color === kingColor && cell.figure.name === FigureNames.KING) {
                enemyKingCell = cell;
            }
        });

        return enemyKingCell;
    }

    public getRookCells(allyColor: Colors | undefined): Cell[] {
        const rookArray: Cell[] = [];
        this.cells.flat().forEach(cell => {
            if (cell.figure?.name === FigureNames.ROOK && cell.figure?.color === allyColor) {
                rookArray.push(cell)
            }
        })

        return rookArray;
    }

    public isKingCheckedAfterMove(currentCell: Cell, targetCell: Cell): boolean {       // is king checked after piece presumably moved
        if (currentCell.figure?.name === FigureNames.KING) {
            return false
        }
        const cellsClone = cloneDeep(this.cells);
        let [currentCell_x, currentCell_y] = [currentCell.x, currentCell.y]
        let [targetCell_x, targetCell_y] = [targetCell.x, targetCell.y]
        let clonedCurrentCell: Cell = cellsClone[0][0];
        let clonedTargetCell: Cell = cellsClone[0][0];

        for (let i = 0; i < cellsClone.length; i++) {
            const row = cellsClone[i];
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                if (cell.x === currentCell_x && cell.y === currentCell_y) {
                    clonedCurrentCell = cell;
                }
                if (cell.x === targetCell_x && cell.y === targetCell_y) {
                    clonedTargetCell = cell;
                }
            }
        }

        if (targetCell.figure?.color !== currentCell.figure?.color) {
            clonedTargetCell.figure = clonedCurrentCell.figure;
            clonedCurrentCell.figure = null;
        }

        let answer = false;
        if (currentCell.figure?.color) {
            answer = this.isKingUnderAttack(currentCell.figure?.color, cellsClone)
        }
        return answer;
    }

    public isKingUnderAttack(kingColor: Colors, cellsArray: Cell[][]) {
        let kingCell = this.getKingCell(kingColor);

        for (let row of cellsArray) {
            for (let cell of row) {
                if (cell.figure && cell.figure.color !== kingColor && cell.figure.canAttack(kingCell)) {
                    return true
                }
            }

        }
        return false
    }

    public setIsKingsUnderAttack() {

        this.blackKingUnderAttack = this.isKingUnderAttack(Colors.BLACK, this.cells);
        this.whiteKingUnderAttack = this.isKingUnderAttack(Colors.WHITE, this.cells);
    }

    public checkCheckmate(attackerColor: Colors | undefined) {
        const kingColor = attackerColor === Colors.BLACK ? Colors.WHITE : Colors.BLACK;
        const kingCell = this.getKingCell(kingColor);
        const isChecked = attackerColor === Colors.BLACK ? this.whiteKingUnderAttack : this.blackKingUnderAttack;
        const player = attackerColor === Colors.BLACK ? this.blackPlayer : this.whitePlayer;

        const canRun = this.cells.some(row => row.some(cell =>
            (attackerColor === Colors.BLACK ? cell.isNearWhiteKing : cell.isNearBlackKing) && kingCell.figure?.canMove(cell)
        ));
        let canDefend = false;
            if (isChecked && !canRun) {
            this.cells.flat().forEach(cell => {
                if (cell.figure && cell.figure?.color !== attackerColor && cell.figure.name !== FigureNames.KING) { // optimization
                    this.cells.flat().forEach(target => {
                        if (target.figure?.color !== cell.figure?.color) { // optimization
                            if (cell.figure?.canMove(target) && !this.isKingCheckedAfterMove(cell, target)) { // canMove has to be first
                                canDefend = true;
                            }
                        }
                    });
                }
            });
        } else {
            canDefend = true
        }
        if (isChecked && !canRun && !canDefend && this.setWinner) {
            this.setWinner(player);
        }

    }

    public canKingCastleThere(kingCell: Cell, targetCell: Cell): boolean {
        const dx = Math.abs(kingCell.x - targetCell.x);
        const dy = Math.abs(kingCell.y - targetCell.y);
        if (kingCell.figure?.hasBeenMoved || dx !== 2 || dy !== 0) return false;

        const kingUnderAttack = kingCell.figure?.color === Colors.BLACK ? this.blackKingUnderAttack : this.whiteKingUnderAttack;
        const compatibleRookCell = this.getCompatibleRookForCastle(kingCell, targetCell);
        let clearPath;
        if (targetCell.x > kingCell.x) {
            clearPath = kingCell.figure?.canMove(this.getCell(kingCell.x + 1, kingCell.y))
        } else {
            clearPath = kingCell.figure?.canMove(this.getCell(kingCell.x - 1, kingCell.y))
        }

        if (compatibleRookCell && kingCell.isEmptyHorizontal(compatibleRookCell) && !kingUnderAttack && clearPath) {
            return true
        }

        return false
    }

    public getCompatibleRookForCastle(kingCell: Cell, targetCell: Cell) {
        const rookCells = this.getRookCells(kingCell.figure?.color);

        for (let rookCell of rookCells) {
            const sameRow = rookCell.y === kingCell.y;
            const hasBeenMoved = rookCell.figure?.hasBeenMoved;
            const correctXCord = (targetCell.x - rookCell.x === 2) || (rookCell.x - targetCell.x === 1);

            if (sameRow && !hasBeenMoved && correctXCord) {
                return rookCell
            }
        }
    }
}
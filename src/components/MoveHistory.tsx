import React, {FC, useEffect} from 'react';

interface MoveHistoryProps {
    moveHistory: String[];
}

const MoveHistory:FC<MoveHistoryProps> = ({moveHistory}) => {
    let moveHistoryClusters: String[][] = [];

    moveHistory.map((moveNode, index) => {
        if (moveHistoryClusters.length !== 0 && ((index + 1) % 2 === 0)) {
            moveHistoryClusters[moveHistoryClusters.length - 1].push(moveNode);
        } else {
            moveHistoryClusters.push([moveNode])
        }
    })

    return (
        <div className={"moveHistory"} id={"moveHistory"}>
            {moveHistoryClusters.map((moveNodePair, index) =>
                <div
                    className={(index + 1) % 2 === 0 ? "light-row" : "dark-row"}
                    key={index}
                >
                    {index + 1}.
                    {moveNodePair?.[0] && <div className={"moveNodeWhite"}>{moveNodePair[0]}</div>}
                    {moveNodePair?.[1] && <div className={"moveNodeBlack"}>{moveNodePair[1]}</div>}
                </div>
            )}
        </div>
    );
};

export default MoveHistory;
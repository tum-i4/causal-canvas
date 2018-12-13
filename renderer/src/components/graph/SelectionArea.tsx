import * as React from 'react';
import { IPoint } from '../../types/GraphTypes';

export interface IAreaSelectionProps {
    source: IPoint;
    target: IPoint;
    viewPos: IPoint;
}

export const AreaSelection: React.SFC<IAreaSelectionProps> = ({ source, target, viewPos }) => {
    if (source.x === -1) {
        return null;
    }

    let x = source.x - viewPos.x;
    let y = source.y - viewPos.y;

    const width = target.x - viewPos.x - x;
    const height = target.y - viewPos.y - y;

    if (width < 0) {
        x += width;
    }
    if (height < 0) {
        y += height;
    }
    return (
        <g>
            <rect
                x={x} y={y} width={Math.abs(width)} height={Math.abs(height)}
                stroke="blue"
                strokeWidth="2"
                fill="blue"
                opacity="0.4"
            />
        </g>
    )
}
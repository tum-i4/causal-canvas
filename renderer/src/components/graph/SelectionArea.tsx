import * as React from 'react';
import { IPoint } from '../../types/GraphTypes';

export interface IAreaSelectionProps {
    source: IPoint;
    target: IPoint;
}

export const AreaSelection: React.SFC<IAreaSelectionProps> = ({ source, target }) => {
    if (source.x === -1) {
        return null;
    }

    let x = source.x;
    let y = source.y;

    const width = target.x - x;
    const height = target.y - y;

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
                stroke="#2c82c9"
                strokeWidth="2"
                fill="#2c82c9"
                opacity="0.4"
            />
        </g>
    )
}
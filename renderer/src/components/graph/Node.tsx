import * as React from 'react';
import { INode } from './GraphTypes';
import { ISelect, MoveType } from './Graph';

export interface INodeProps extends INode{
    selected: boolean;
    select: (event:React.MouseEvent,selected:ISelect)=>void;
    dragStart: (moveType:MoveType)=>void;
    startNewEdge: (sourceID:string)=>void;
    endNewEdge: (sourceID:string)=>void;
}

export const Node: React.SFC<INodeProps> = ({x,y,selected,select,id,dragStart,startNewEdge,endNewEdge,title})=>{
    return (
        <g
            onMouseDown={
                (ev)=>{
                    ev.stopPropagation();

                    if(!selected){
                        return;
                    }
                    if(ev.ctrlKey){
                        return dragStart(MoveType.Selection)
                    }

                    return startNewEdge(id);
                }
            }
            onMouseUp={
                (ev)=>{
                    if(!ev.ctrlKey){
                        return endNewEdge(id);
                    }
                }
            }
            onClick={(ev)=>select(ev,{nodes:[id],edges:[]})}
        >
            <ellipse
                cx={x}
                cy={y}
                rx="80"
                ry="30"
                stroke={selected?'blue':'black'}
                strokeWidth={2}
                fill="lightgrey"
            />
            <text textAnchor="middle" x={x} y={y} fill='#000000'>{title}</text>
        </g>
    )
}
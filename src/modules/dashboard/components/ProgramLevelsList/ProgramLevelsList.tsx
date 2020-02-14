import React, { useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import nanoid from 'nanoid';

import ListGroup, { ListGroupItem } from '~core/ListGroup';
import { OneProgram } from '~data/index';

interface Props {
  levelIds: OneProgram['levelIds'];
  levels: OneProgram['levels'];
}

const displayName = 'dashboard.ProgramLevelsList';

const ProgramLevelsList = ({ levels }: Props) => {
  const { current: droppdableId } = useRef<string>(nanoid());
  return (
    <DragDropContext>
      <Droppable droppableId={`program-levels-${droppdableId}`}>
        {({ innerRef, droppableProps }) => (
          <div ref={innerRef} {...droppableProps}>
            <ListGroup>
              {levels.map((level, idx) => (
                <Draggable key={level.id} draggableId={level.id} index={idx}>
                  <ListGroupItem>{level.title || 'Unknown'}</ListGroupItem>
                </Draggable>
              ))}
            </ListGroup>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

ProgramLevelsList.displayName = displayName;

export default ProgramLevelsList;

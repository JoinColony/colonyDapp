import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import nanoid from 'nanoid';

import ListGroup, { ListGroupItem } from '~core/ListGroup';
import { OneProgram, useReorderProgramLevelsMutation } from '~data/index';
import LevelsListItem from './LevelsListItem';

interface Props {
  colonyName: string;
  program: OneProgram;
}

const hasOrderChanged = (arr1: string[], arr2: string[]): boolean => {
  if (arr1.length !== arr2.length) return true;
  return arr1.some((el, idx) => el !== arr2[idx]);
};

const displayName = 'dashboard.LevelsList';

const LevelsList = ({
  colonyName,
  program: { id: programId, levelIds: levelIdsProp, levels: unsortedLevels },
}: Props) => {
  // Use local state to optimize optimistic UI - avoid FOIC `onDragEnd`
  const [levelIds, setLevelIds] = useState<Props['program']['levelIds']>(
    levelIdsProp,
  );

  const { current: droppdableId } = useRef<string>(nanoid());
  const lastLevelIdsRef = useRef<Props['program']['levelIds']>(levelIds);

  const [
    reorderProgramLevels,
    { data, error },
  ] = useReorderProgramLevelsMutation();

  const handleDragEnd = useCallback(
    async ({ destination, source }) => {
      // dropped outside the list
      if (!destination) {
        return;
      }

      const newLevelIds = [...levelIds];
      const [removed] = newLevelIds.splice(source.index, 1);
      newLevelIds.splice(destination.index, 0, removed);

      if (hasOrderChanged(newLevelIds, lastLevelIdsRef.current)) {
        setLevelIds(newLevelIds);

        await reorderProgramLevels({
          variables: { input: { id: programId, levelIds: newLevelIds } },
        });
      }
    },
    [levelIds, programId, reorderProgramLevels],
  );

  // Only update prev if the order has changed && mutation was successful
  useEffect(() => {
    if (hasOrderChanged(levelIds, lastLevelIdsRef.current) && data) {
      lastLevelIdsRef.current = levelIds;
    }
  }, [data, levelIds]);

  // Revert update if mutation fails
  useEffect(() => {
    if (error && lastLevelIdsRef.current) {
      setLevelIds(lastLevelIdsRef.current);
    }
  }, [error]);

  const levels = useMemo(
    () =>
      unsortedLevels.sort(
        ({ id: idA }, { id: idB }) =>
          levelIds.indexOf(idA) - levelIds.indexOf(idB),
      ),
    [levelIds, unsortedLevels],
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={`program-levels-${droppdableId}`}>
        {({ innerRef: droppableInnerRef, droppableProps }) => (
          <div ref={droppableInnerRef} {...droppableProps}>
            <ListGroup appearance={{ gaps: 'true' }}>
              {levels.map((level, idx) => (
                <Draggable
                  key={level.id}
                  draggableId={`draggableLevelId${level.id}`}
                  index={idx}
                >
                  {({
                    innerRef: draggableInnerRef,
                    draggableProps,
                    dragHandleProps,
                  }) => (
                    <ListGroupItem
                      innerRef={draggableInnerRef}
                      {...draggableProps}
                    >
                      <LevelsListItem
                        colonyName={colonyName}
                        dragHandleProps={dragHandleProps}
                        level={level}
                        programId={programId}
                      />
                    </ListGroupItem>
                  )}
                </Draggable>
              ))}
            </ListGroup>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

LevelsList.displayName = displayName;

export default LevelsList;

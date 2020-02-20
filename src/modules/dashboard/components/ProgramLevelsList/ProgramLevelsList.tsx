import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { defineMessages } from 'react-intl';
import nanoid from 'nanoid';

import Button from '~core/Button';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import ListGroup, { ListGroupItem } from '~core/ListGroup';
import { OneProgram, useReorderProgramLevelsMutation } from '~data/index';

import styles from './ProgramLevelsList.css';

const MSG = defineMessages({
  dragHandleTitle: {
    id: 'dashboard.ProgramLevelsList.dragHandleTitle',
    defaultMessage: 'Click, hold, and drag to re-order levels.',
  },
  linkView: {
    id: 'dashboard.ProgramLevelsList.linkView',
    defaultMessage: 'View',
  },
  untitledLevel: {
    id: 'dashboard.ProgramLevelsList.untitledLevel',
    defaultMessage: 'Untitled Level',
  },
});

interface Props {
  colonyName: string;
  programId: OneProgram['id'];
  levelIds: OneProgram['levelIds'];
  levels: OneProgram['levels'];
}

const hasOrderChanged = (arr1: string[], arr2: string[]): boolean => {
  if (arr1.length !== arr2.length) return true;
  return arr1.some((el, idx) => el !== arr2[idx]);
};

const displayName = 'dashboard.ProgramLevelsList';

const ProgramLevelsList = ({
  colonyName,
  programId,
  levelIds: levelIdsProp,
  levels: unsortedLevels,
}: Props) => {
  // Use local state to optimize optimistic UI - avoid FOIC `onDragEnd`
  const [levelIds, setLevelIds] = useState<Props['levelIds']>(levelIdsProp);

  const { current: droppdableId } = useRef<string>(nanoid());
  const lastLevelIdsRef = useRef<Props['levelIds']>(levelIds);

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
              {levels.map(({ id: levelId, title }, idx) => {
                const levelUrl = `/colony/${colonyName}/program/${programId}/level/${levelId}`;
                return (
                  <Draggable
                    key={levelId}
                    draggableId={`draggableLevelId${levelId}`}
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
                        <div className={styles.listItemInner}>
                          <div className={styles.dragHandleContainer}>
                            <div {...dragHandleProps}>
                              <Icon
                                className={styles.dragHandleIcon}
                                name="drag-handle"
                                title={MSG.dragHandleTitle}
                              />
                            </div>
                          </div>
                          {/* @todo Add level achievement here */}
                          <div className={styles.itemContentContainer}>
                            <Heading
                              appearance={{ margin: 'none', size: 'medium' }}
                              text={title || MSG.untitledLevel}
                            />
                          </div>
                          <div className={styles.itemActionContainer}>
                            <Button linkTo={levelUrl} text={MSG.linkView} />
                          </div>
                        </div>
                      </ListGroupItem>
                    )}
                  </Draggable>
                );
              })}
            </ListGroup>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

ProgramLevelsList.displayName = displayName;

export default ProgramLevelsList;

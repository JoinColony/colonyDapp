import React, { useRef, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { defineMessages } from 'react-intl';
import nanoid from 'nanoid';

import Button from '~core/Button';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import ListGroup, { ListGroupItem } from '~core/ListGroup';
import { OneProgram } from '~data/index';

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

const displayName = 'dashboard.ProgramLevelsList';

const ProgramLevelsList = ({ colonyName, programId, levels }: Props) => {
  const { current: droppdableId } = useRef<string>(nanoid());

  const handleDragEnd = useCallback(() => {
    return undefined;
  }, []);

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

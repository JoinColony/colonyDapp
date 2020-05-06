import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { OneLevel, OnePersistentTask } from '~data/index';

import TaskDisplay from './TaskDisplay';
import TaskEdit from './TaskEdit';

export interface RouteState {
  isEditingInitialTask: boolean;
}

interface Props {
  isEditing?: boolean;
  levelId: OneLevel['id'];
  persistentTask: OnePersistentTask;
}

const displayName = 'dashboard.LevelTasksEdit.LevelTaskListItem';

const LevelTaskListItem = ({
  isEditing: isEditingProp = false,
  levelId,
  persistentTask,
}: Props) => {
  const { state } = useLocation<RouteState>();
  const isEditingInitialTask = (state && state.isEditingInitialTask) || false;
  const [isEditing, setIsEditing] = useState<boolean>(
    isEditingProp || isEditingInitialTask,
  );
  return isEditing ? (
    <TaskEdit
      levelId={levelId}
      persistentTask={persistentTask}
      setIsEditing={setIsEditing}
    />
  ) : (
    <TaskDisplay persistentTask={persistentTask} setIsEditing={setIsEditing} />
  );
};

LevelTaskListItem.displayName = displayName;

export default LevelTaskListItem;

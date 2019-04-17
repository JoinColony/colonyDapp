import taskSkills from '../taskSkillsTree';

describe('taskSkillsTree data', () => {
  test('Contains only unique IDs', () => {
    const taskIds = taskSkills.map(({ id }) => id);
    expect(new Set(taskIds).size).toBe(taskSkills.length);
  });
  test('All items with parents have parents that exist', () => {
    const taskIds = taskSkills.map(({ id }) => id);
    const taskParentIds = taskSkills
      .filter(skill => !!skill.parent)
      .map(({ parent }) => parent);
    expect(
      taskParentIds.every(parentId => taskIds.includes(parentId)),
    ).toBeTruthy();
  });
});

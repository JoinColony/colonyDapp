export type InlineEditProps = {
  children?: string;
  editing?: boolean;
  name: string;
  required?: boolean;
  onCancel?: () => void;
  onEdit: () => void;
  limit: number;
  allowLineBreak?: boolean;
};

export type InlineEditState = {
  value: string;
  previousValue: string;
  isEditing: boolean;
  isSaved: boolean;
  limitReached: boolean;
};

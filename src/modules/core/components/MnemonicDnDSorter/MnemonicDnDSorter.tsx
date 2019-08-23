import { MessageDescriptor, MessageValues, defineMessages } from 'react-intl';
import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import InputLabel from '../Fields/InputLabel';
import asField from '../Fields/asField';
import Button from '../Button';
import { shuffle } from '../../../../utils/arrays';

// Maybe create grid using CSS?
import Grid from './grid.svg';

import styles from './MnemonicDnDSorter.css';

type StyleType = {
  [key: string]: string | number;
};

const MSG = defineMessages({
  buttonReset: {
    id: 'MnemonicDnDSorter.buttonReset',
    defaultMessage: 'Reset',
  },
});

interface Props {
  /** Mnemonic passphrase of space-separated words */
  passphrase: string;

  /** Connect to form state (will inject `$value`, `$id`, `$error`, `$touched`), is `true` by default */
  connect?: boolean;

  /** Just render the element without label */
  elementOnly?: boolean;

  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor;

  /** Label text */
  label: string | MessageDescriptor;

  /** Input field name (form variable) */
  name: string;

  /** @ignore Will be injected by `asField` */
  isSubmitting?: boolean;

  /** Placeholder text (can also be a MessageDescriptor) */
  placeholder?: string;

  /** @ignore Will be injected by `asField` */
  $id: string;

  /** @ignore Will be injected by `asField` */
  $error?: string;

  /** @ignore Will be injected by `asField` */
  $value?: string;

  /** @ignore Will be injected by `asField` */
  $touched?: boolean;

  /** @ignore Will be injected by `asField` */
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: MessageValues,
  ) => string;

  /** @ignore Will be injected by `asField` */
  setError: (val: any) => void;

  /** @ignore Will be injected by `asField` */
  setValue: (val: any) => void;

  /** @ignore Standard input field property */
  onBlur: Function;
}

type State = {
  selected: Droppable[];
  items: Droppable[];
};

class MnemonicDnDSorter extends Component<Props, State> {
  /**
   * Get items to sort from
   */
  static getItems(
    phrase: string,
    count: number,
    offset: number = 0,
  ): Droppable[] {
    const phraseArray = phrase.split(' ');
    const shuffled = shuffle(phraseArray);
    return Array.from({ length: count }, (word, index) => index).map(index => ({
      id: `item-${index + offset}`,
      sortOrder: index,
      content: String(shuffled[index]),
    }));
  }

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    selected: MnemonicDnDSorter.getItems(this.props.passphrase, 12),
    items: [],
  };

  id2List = {
    target: 'items',
    source: 'selected',
  };

  handleDrop = () => {
    const { setValue } = this.props;
    const { items } = this.state;
    if (items.length === 12) {
      const passphrase = items.map(element => element.content).join(' ');
      setValue(passphrase);
    }
  };

  // This eslint rule is broken for this case
  // eslint-disable-next-line react/destructuring-assignment
  getList = (id: string) => this.state[this.id2List[id]];

  /**
   * Push word in correct position
   */
  reorder = (
    list: Droppable[],
    startIndex: number,
    endIndex: number,
  ): Droppable[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * Bring back words into the source area and remove error
   */
  reset = () => {
    const { passphrase } = this.props;
    this.setState({
      selected: MnemonicDnDSorter.getItems(passphrase, 12),
      items: [],
    });
  };

  /**
   * Moves phrase from one list to another list.
   */
  move = (
    source: Droppable[],
    destination: any[],
    droppableSource: Droppable,
    droppableDestination: Droppable,
  ): any => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    let removed;
    if (droppableSource.index != null) {
      [removed] = sourceClone.splice(droppableSource.index, 1);
    }

    if (droppableDestination.index != null) {
      destClone.splice(droppableDestination.index, 0, removed);
    }

    const result = {};

    if (droppableSource.droppableId != null) {
      result[droppableSource.droppableId] = sourceClone;
    }
    if (droppableDestination.droppableId != null) {
      result[droppableDestination.droppableId] = destClone;
    }

    return result;
  };

  /**
   * This is dynamically adding styles to draggable items and their source and target containers,
   * it would be much smoother to take them out into a class.
   * When testing this they got partially overwritten.
   * Find a way to add them more elegantly in the next iteration
   */
  getItemStyle = (isDragging: boolean, draggableStyle: StyleType) => ({
    userSelect: 'none',
    padding: '0px 5px',
    margin: '7px 15px',
    textAlign: 'center',
    width: 80,
    height: 20,
    borderRadius: 3,
    color: 'black',
    background: isDragging ? 'rgb(207, 213, 229)' : 'rgb(207, 213, 229)',
    ...draggableStyle,
  });

  getTargetStyle = (isDraggingOver: boolean, hasError: boolean): any => ({
    background: isDraggingOver ? 'rgb(66, 129, 255)' : 'rgb(232, 236, 245)',
    display: 'flex',
    flexWrap: 'wrap',
    // alignContent: 'flex-start',
    justifyContent: 'center',
    width: 460,
    height: 110,
    border: '1px solid rgb(213, 213, 213)',
    backgroundColor: 'rgb(232, 236, 245)',
    borderLeft: hasError ? '1px solid rgb(248, 43, 101)' : undefined,
    borderRight: hasError ? '1px solid rgb(248, 43, 101)' : undefined,
    borderTop: hasError
      ? '1px solid rgb(248, 43, 101)'
      : '1px dashed rgb(0, 230, 196)',
    borderBottom: hasError
      ? '1px solid rgb(248, 43, 101)'
      : '1px dashed rgb(0, 230, 196)',
    boxShadow: hasError
      ? 'inset 2px 12px 20px -8px rgba(97,97,97,0.5)'
      : undefined,
  });

  getSourceStyle = (): any => ({
    display: 'flex',
    flexWrap: 'wrap',
    width: 460,
    height: 110,
  });

  onDragEnd = (result: any) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = this.reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index,
      );
      const state: any =
        source.droppableId === 'source' ? { selected: items } : { items };

      this.setState(state, this.handleDrop);
    } else {
      const position = this.move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination,
      );

      this.setState(
        {
          items: position.target,
          selected: position.source,
        },
        this.handleDrop,
      );
    }
  };

  render() {
    const svgStyle = {
      position: 'absolute',
    };
    const { items, selected } = this.state;
    const {
      $error,
      $id,
      elementOnly,
      label,
      help,
      placeholder,
      /* eslint-disable @typescript-eslint/no-unused-vars */
      $touched,
      $value,
      connect,
      formatIntl,
      isSubmitting,
      name,
      onBlur,
      setError,
      setValue,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...props
    } = this.props;

    // @ts-ignore
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        {!elementOnly && (
          <div className={styles.labelHeader}>
            <InputLabel inputId={$id} label={label} help={help} />
            <Button
              appearance={{ theme: 'ghost', size: 'small' }}
              type="button"
              onClick={this.reset}
              text={MSG.buttonReset}
            />
          </div>
        )}
        <Droppable droppableId="target" direction="horizontal">
          {(provided, snapshot) => (
            <div
              className={styles.main}
              ref={provided.innerRef}
              style={this.getTargetStyle(snapshot.isDraggingOver, !!$error)}
              id={$id}
              data-placeholder={items.length || $error ? null : placeholder}
              {...props}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(providedDrag, snapshotDrag) => (
                    <div
                      ref={providedDrag.innerRef}
                      {...providedDrag.draggableProps}
                      {...providedDrag.dragHandleProps}
                      style={this.getItemStyle(
                        snapshotDrag.isDragging,
                        providedDrag.draggableProps.style,
                      )}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {!!$error && (
                <>
                  <div className={styles.errorOverlay} />
                  <Grid style={svgStyle} />
                </>
              )}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="source" direction="horizontal">
          {provided => (
            <div ref={provided.innerRef} style={this.getSourceStyle()}>
              {selected.map((item, index) => (
                <Draggable
                  direction="horizontal"
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                >
                  {(providedSource, snapshotSource) => (
                    <div
                      ref={providedSource.innerRef}
                      {...providedSource.draggableProps}
                      {...providedSource.dragHandleProps}
                      style={this.getItemStyle(
                        snapshotSource.isDragging,
                        providedSource.draggableProps.style,
                      )}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default (asField() as any)(MnemonicDnDSorter);

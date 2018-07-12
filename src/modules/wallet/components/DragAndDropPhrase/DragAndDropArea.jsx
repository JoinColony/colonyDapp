/* @flow */

import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '../../../core/components/Button';
import Heading from '../../../core/components/Heading';
import { shuffle } from '../../../../utils/arrays';

import Grid from '../../../../img/icons/grid.svg';

import styles from './DragAndDropPhrase.css';

type StyleType = { [key: string]: string | number };

const MSG = defineMessages({
  placeholder: {
    id: 'DragAndDropArea.placeholder.title',
    defaultMessage: 'Drag & Drop',
  },
  placeholderSub: {
    id: 'DragAndDropArea.placeholder.subtitle',
    defaultMessage: 'Mnemonics here',
  },
  errorMessage: {
    id: 'DragAndDropArea.error.errorMessage',
    defaultMessage: 'That’s incorrect. Press the Reset button to try again.',
  },
  buttonRefresh: {
    id: 'DragAndDropArea.error.buttonRefresh',
    defaultMessage: 'Refresh',
  },
  titleBox: {
    id: 'DragAndDropArea.titles.titleBox',
    defaultMessage: 'Drag your Mnemonic Phrase in the right order',
  },
});

type Props = {
  passphrase: string,
  direction?: string,
  onAllDropped: () => void,
};

type State = {
  selected: Array<Droppable>,
  items: Array<Droppable>,
  matchingPhrase: boolean,
  checked: boolean,
  hasError: boolean,
};

class DragAndDropArea extends Component<Props, State> {
  /**
   * Get items to sort from
   */
  static getItems(
    phrase: string,
    count: number,
    offset: number = 0,
  ): Array<Droppable> {
    const phraseArray = phrase.split(' ');
    const shuffled = shuffle(phraseArray);
    return Array.from({ length: count }, (word, index) => index).map(index => ({
      id: `item-${index + offset}`,
      sortOrder: index,
      content: String(shuffled[index]),
    }));
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      selected: this.constructor.getItems(props.passphrase, 12),
      items: [],
      matchingPhrase: false,
      checked: false,
      hasError: false,
    };
  }

  id2List = {
    target: 'items',
    source: 'selected',
  };

  allDropped = (items: Array<Droppable>) => {
    const { onAllDropped } = this.props;
    if (items.length === 12) {
      onAllDropped();
    }
  };

  // This eslint rule is broken for this case
  // eslint-disable-next-line react/destructuring-assignment
  getList = (id: string) => this.state[this.id2List[id]];

  /**
   * Push word in correct position
   */
  reorder = (
    list: Array<Droppable>,
    startIndex: number,
    endIndex: number,
  ): Array<Droppable> => {
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
      selected: DragAndDropArea.getItems(passphrase, 12),
      items: [],
      hasError: false,
    });
  };

  /**
   * Moves phrase from one list to another list.
   */
  move = (
    source: Array<Droppable>,
    destination: Array<any>,
    droppableSource: Droppable,
    droppableDestination: Droppable,
  ) => {
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

  getTargetStyle = (isDraggingOver: boolean, hasError: boolean) => ({
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

  getSourceStyle = () => ({
    display: 'flex',
    flexWrap: 'wrap',
    width: 460,
    height: 110,
  });

  /**
   * Join array of words back into passphrase to compare with the original one
   */
  checkSorting = () => {
    const { items } = this.state;
    const { passphrase } = this.props;
    this.setState({ checked: true });
    const passPhraseToCheck = items.map(element => element.content).join(' ');

    const matches = passPhraseToCheck === passphrase;
    if (matches) {
      this.setState({ matchingPhrase: true, hasError: false });
    } else {
      this.setState({ hasError: true });
    }

    return matches;
  };

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

      let state = { items };

      if (source.droppableId === 'source') {
        state = { selected: items };
      }

      this.setState(state);
    } else {
      const position = this.move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination,
      );

      this.setState({
        items: position.target,
        selected: position.source,
      });

      this.allDropped(position.target);
    }
  };

  render() {
    const svgStyle = {
      position: 'absolute',
    };
    const { hasError, items, selected } = this.state;

    const Children = props => props.children;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className={styles.buttonsToMakeYouDrag}>
          <Heading
            appearance={{ size: 'small', width: 'bold' }}
            text={MSG.titleBox}
            className={styles.heading}
          />
          <Button
            appearance={{ theme: 'ghost', colorSchema: 'noBorderBlue' }}
            type="button"
            onClick={this.reset}
            value={MSG.buttonRefresh}
          />
        </div>
        <Droppable droppableId="target" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={this.getTargetStyle(snapshot.isDraggingOver, hasError)}
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
              {!!items.length === 0 && (
                <Children>
                  <div className={styles.placeholderTop}>
                    <FormattedMessage {...MSG.placeholder} />
                  </div>
                  <div className={styles.placeholder}>
                    <FormattedMessage {...MSG.placeholderSub} />
                  </div>
                </Children>
              )}
              {!!hasError && (
                <Children>
                  <div className={styles.errorOverlay} />
                  <Grid style={svgStyle} />
                </Children>
              )}
            </div>
          )}
        </Droppable>
        {!!hasError && (
          <div className={styles.errorMessage}>
            <FormattedMessage {...MSG.errorMessage} />
          </div>
        )}
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

export default DragAndDropArea;

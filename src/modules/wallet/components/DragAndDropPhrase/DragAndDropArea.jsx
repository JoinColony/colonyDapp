/* @flow */

import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';

import Grid from '../../../../img/icons/grid.svg';

import styles from './DragAndDropPhrase.css';

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
});

class DragAndDropArea extends Component {
  /**
   * Get items to sort from
   */
  static getItems(phrase, count, offset = 0) {
    const phraseArray = phrase.split(' ');
    const shuffled = DragAndDropArea.shuffle(phraseArray);
    return Array.from({ length: count }, (word, index) => index).map(index => ({
      id: `item-${index + offset}`,
      sortOrder: index,
      content: `${shuffled[index]}`,
    }));
  }

  /**
   * shuffle before offering drap and drop options
   */
  static shuffle = array => {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    const clone = array.slice(0);

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      clone[currentIndex] = clone[randomIndex];
      clone[randomIndex] = temporaryValue;
    }

    return clone;
  };

  state = {
    passphrase: this.props.phrase,
    selected: DragAndDropArea.getItems(this.props.phrase, 12),
    items: [],
    matchingPhrase: false,
    checked: false,
  };

  id2List = {
    target: 'items',
    source: 'selected',
  };

  getList = id => this.state[this.id2List[id]];

  /**
   * Push word in correct position
   */
  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * Moves phrase from one list to another list.
   */
  move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  /**
   * Dynamically add styles to all elements,
   * it would be much smoother to take them out into a class.
   * When testing this they got partially overwritten.
   * Find a way to add them more elegantly in the next iteration
   */
  getItemStyle = (isDragging, draggableStyle, isTarget) => ({
    userSelect: 'none',
    padding: '0px 5px',
    margin: isTarget ? '7px 25px' : '5px 10px',
    textAlign: 'center',
    width: 60,
    height: 20,
    borderRadius: 3,
    color: 'black',
    background: isDragging ? 'rgb(207, 213, 229)' : 'rgb(207, 213, 229)',
    ...draggableStyle,
  });

  getTargetStyle = (isDraggingOver, hasError) => ({
    background: isDraggingOver ? 'rgb(66, 129, 255)' : 'rgb(232, 236, 245)',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
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
  });

  getSourceStyle = () => ({
    display: 'flex',
    flexWrap: 'wrap',
    width: 460,
    height: 110,
    padding: '20px 0px',
  });

  // Join array of words back into passphrase to compare with the original one
  checkSorting = () => {
    this.setState({ checked: true });
    const passPhraseToCheck = this.state.items
      .map(element => element.content)
      .join(' ');

    const matches = passPhraseToCheck === this.state.passphrase;
    if (matches) {
      this.setState({ matchingPhrase: true });
    }
    return matches;
  };

  onDragEnd = result => {
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
    }
  };

  render() {
    const svgStyle = {
      position: 'absolute',
    };
    const hasError = this.state.checked && !this.state.matchingPhrase;

    const Children = props => props.children;
    return (
      <DragDropContext direction="horizontal" onDragEnd={this.onDragEnd}>
        <Droppable droppableId="target" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={this.getTargetStyle(snapshot.isDraggingOver, hasError)}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(providedDrag, snapshotDrag) => (
                    <div
                      ref={providedDrag.innerRef}
                      {...providedDrag.draggableProps}
                      {...providedDrag.dragHandleProps}
                      style={this.getItemStyle(
                        snapshotDrag.isDragging,
                        providedDrag.draggableProps.style,
                        true,
                      )}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {this.state.items.length === 0 ? (
                <Children>
                  <div className={`${styles.placeholderTop}`}>
                    <FormattedMessage {...MSG.placeholder} />
                  </div>,
                  <div className={`${styles.placeholder}`}>
                    <FormattedMessage {...MSG.placeholderSub} />
                  </div>,
                </Children>
              ) : null}
              {hasError ? (
                <Children>
                  <div className={`${styles.errorOverlay}`} />
                  <Grid style={svgStyle} />
                </Children>
              ) : null}
            </div>
          )}
        </Droppable>
        {hasError ? (
          <div className={`${styles.errorMessage}`}>
            <FormattedMessage {...MSG.errorMessage} />
          </div>
        ) : null}
        <Droppable droppableId="source" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={this.getSourceStyle(snapshot.isDraggingOver)}
            >
              {this.state.selected.map((item, index) => (
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
                        false,
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

DragAndDropArea.propTypes = {
  phrase: PropTypes.string,
};

export default DragAndDropArea;

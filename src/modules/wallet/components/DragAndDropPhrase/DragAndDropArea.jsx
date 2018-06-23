/* @flow */

import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';

/**
 * Push word in correct position
 */
const getItems = (phrase, count, offset = 0) => {
  const phraseArray = phrase.split(' ');
  return Array.from({ length: count }, (word, index) => index).map(index => ({
    id: `item-${index + offset}`,
    sortOrder: index,
    content: `${phraseArray[index]}`,
  }));
};

/**
 * Push word in correct position
 */
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves phrase from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: '0px 5px',
  margin: 5,
  textAlign: 'center',
  width: '14%',
  height: 20,
  borderRadius: 3,
  color: 'black',

  // TODO: add fancy shadow if dragging
  background: isDragging ? 'rgb(207, 213, 229)' : 'rgb(207, 213, 229)',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getTargetStyle = isDraggingOver => ({
  background: isDraggingOver ? 'rgb(66, 129, 255)' : 'rgb(232, 236, 245)',
  display: 'flex',
  flexWrap: 'wrap',
  alignContent: 'flex-start',
  width: 460,
  height: 86,
  border: '1px solid rgb(213, 213, 213)',
  borderRadius: 3,
  backgroundColor: 'rgb(232, 236, 245)',
});

const getSourceStyle = () => ({
  display: 'flex',
  flexWrap: 'wrap',
  width: 460,
  height: 86,
});

class DragAndDropArea extends Component {
  state = {
    passphrase: this.props.phrase,
    selected: getItems(this.props.phrase, 12),
    items: [],
  };

  id2List = {
    droppable: 'items',
    droppable2: 'selected',
  };

  getList = id => this.state[this.id2List[id]];

  onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index,
      );

      let state = { items };

      if (source.droppableId === 'droppable2') {
        state = { selected: items };
      }

      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination,
      );

      this.setState({
        items: result.droppable,
        selected: result.droppable2,
      });
    }
  };

  render() {
    return (
      <DragDropContext direction="horizontal" onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getTargetStyle(snapshot.isDraggingOver)}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
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
        <Droppable droppableId="droppable2" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getSourceStyle(snapshot.isDraggingOver)}
            >
              {this.state.selected.map((item, index) => (
                <Draggable
                  direction="horizontal"
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
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

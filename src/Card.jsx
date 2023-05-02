import React from 'react';
import './card.css';
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { useRef } from 'react';

function Card({ id, name, quantity, status, onQuantityAdd, index, onQuantitySubstract, moveCard, onStatusChange, statusIndex }) {
    const ref = useRef(null)

    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.CARD,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item, monitor) {
            if (!ref.current) {
                console.log("!ref.current")
                return
            }
            const dragIndex = item.statusIndex;
            const hoverIndex = statusIndex
            const dragStatus = item.status
            const hoverStatus = status
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }
            //  && 
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Get horozintal middle
            // Determine mouse position
            const clientOffset = monitor.getClientOffset()
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                // console.log("dragIndex < hoverIndex && hoverClientY < hoverMiddleY")
                return
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                // console.log("dragIndex < hoverIndex && hoverClientY < hoverMiddleY")
                return
            }
            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex, dragStatus, hoverStatus)
            // onStatusChange(id);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.statusIndex = hoverIndex
        },
    })
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: () => {
            console.log({ id, index, status, statusIndex });
            return { id, index, status, statusIndex }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })
    const opacity = isDragging ? 0 : 1
    drag(drop(ref));
    let marked;
    if (status === "completed") {
        marked = "uncompleted";
    }
    else {
        marked = "completed";
    }
    return (
        <div className={"card-box " + status}
            ref={ref}
            style={{ opacity }}
            data-handler-id={handlerId}>
            <h3>Name: {name}</h3>
            <h3>Quantity: {quantity}</h3>
            <div className="modify-buttons">
                <h3>Modify quantity:</h3>
                <button
                    type="button"
                    className="card-button add"
                    onClick={onQuantityAdd}>+</button>
                <button
                    type="button"
                    className="card-button substract"
                    onClick={onQuantitySubstract}
                >-</button>
            </div >
            <button
                type="button"
                className='status-button'
                onClick={onStatusChange}
            >Mark as {marked}</button>
        </div >
    );
}

export default Card;
import { dbService } from 'fbase';
import React, { useState, useRef, useEffect } from 'react';

const List = ({ completed, todos, selected, setSelected, setAsking, asking, setNeedRefresh }) => {
    const listRef = useRef();

    const handleClick = (e) => {
        const { dataset } = e.currentTarget;
        const { localName } = e.target;
        if(selected !== "" && (localName === "p" || localName === "small")){
            setSelected("")
        } else {
            setSelected(dataset.id);
        }
    }

    const handleDelete = () => {
        dbService.collection("todos").doc(selected).delete()
        .then(() => {
            console.log(selected, 'deleted successfully');
            setSelected("")
            setNeedRefresh(true);
        })
        .catch((error) => {
            console.error(error.message);
        })
    }

    const handleComplete = () => {
        dbService.collection("todos").doc(selected).update({ complete: true })
        .then(() => {
            console.log(selected, 'updated successfully');
            setSelected("");
            setAsking("");
            setNeedRefresh(true);
        })
        .catch((error) => {
            console.error(error.message);
        })
    }

    const handleAsking = (e) => {
        const object = {
            status: true,
            type: e.target.name,
        }
        setAsking(object);
    }

    const handleCancelAsking = (e) => {
        e.preventDefault();
        setAsking(false);
        console.log(e)
    }
    
    return (
        <div className = "list-container">
            <ul>
                {
                    todos ? 
                        todos.sort((a, b) => a.date - b.date).map((todo, i) => (
                            <li ref = { listRef } data-id = { todo.id } key = { todo.id } onClick = { handleClick } >
                                <p><small style = {{ textDecorationLine: todo.complete ? "line-through" : "inherit" }}>{ i + 1 }. { todo.text }</small></p>
                                {
                                    (todo.id === selected) ? 
                                    asking.status ? <div className = "asking-container" >
                                                <small>{ asking.type === "complete" ? "??????????????????????" : "?????? ????????? ?????????????????????????" }</small>
                                                <button onClick = { asking.type === "complete" ? handleComplete : handleDelete }>???</button>
                                                <button onClick = { handleCancelAsking }>?????????</button>
                                            </div>  
                                    :
                                    <div className = "menu-container">
                                        <small>
                                            { Math.floor((new Date(Date.now()) - new Date(todo.date)) / 1000 / 60 / 60) }??????&nbsp;
                                            { Math.floor((new Date(Date.now()) - new Date(todo.date)) / 1000 / 60) > 60 
                                                ? 0 
                                                : Math.floor((new Date(Date.now()) - new Date(todo.date)) / 1000 / 60) }
                                                ??? ?????? ??????&nbsp;
                                        </small>
                                        <span>
                                            <button name = "complete" disabled = { todo.complete ? true : false } onClick = { handleAsking}>??????</button>
                                            <button name = "delete" onClick = { handleAsking }>??????</button>
                                        </span>
                                    </div>
                                    : ""
                                }
                            </li>
                        )) : ""
                }
                <p><small>??? { todos.length }???, ?????? { completed }???, ?????? ??? ??? { todos.length - completed < 0 ? 0 : todos.length - completed }???</small></p>
            </ul>
        </div>
    );
}

export default List;
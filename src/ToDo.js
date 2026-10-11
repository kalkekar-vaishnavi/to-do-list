import React, { useEffect, useState } from 'react'
import "./ToDo.css"
import { MdOutlineDelete } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

const STORAGE_KEYS = {
    todos: 'todolist',
    completed: 'completedtodolist'
};

const createTodoId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const readStoredList = (key) => {
    try {
        const item = localStorage.getItem(key);
        if (!item) return [];

        const parsed = JSON.parse(item);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
};

const ToDo = () => {
    const [isCompleteScreen, setIsCompleteScreen] = useState(false);
    const [allTodos, setTodo] = useState([]);
    const [completedTodos, setCompletedTodos] = useState([]);
    const [newTitle, setTitle] = useState("");
    const [newDescription, setDescription] = useState("");

    const handleAddTodo = () => {
        if (!newTitle.trim() || !newDescription.trim()) return;

        const newTodoItem = {
            id: createTodoId(),
            title: newTitle.trim(),
            description: newDescription.trim()
        };

        const updatedTodo = [...allTodos, newTodoItem];
        setTodo(updatedTodo);
        localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(updatedTodo));

        setTitle("");
        setDescription("");
    };

    const handleDeleteTodo = (id) => {
        const updatedTodos = allTodos.filter((todo) => todo.id !== id);
        setTodo(updatedTodos);
        localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(updatedTodos));
    };

    const handleComplete = (id) => {
        const todoToComplete = allTodos.find((todo) => todo.id === id);
        if (!todoToComplete) return;

        const now = new Date();
        const completedOn =
            now.getDate() + "-" +
            (now.getMonth() + 1) + "-" +
            now.getFullYear() + " at " +
            now.getHours() + ":" +
            now.getMinutes() + ":" +
            now.getSeconds();

        const completedItem = {
            ...todoToComplete,
            completedOn
        };

        const updatedCompleted = [...completedTodos, completedItem];
        setCompletedTodos(updatedCompleted);
        localStorage.setItem(STORAGE_KEYS.completed, JSON.stringify(updatedCompleted));

        const updatedTodos = allTodos.filter((todo) => todo.id !== id);
        setTodo(updatedTodos);
        localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(updatedTodos));
    };

    const handleDeleteCompletedTodo = (id) => {
        const updatedCompleted = completedTodos.filter((todo) => todo.id !== id);
        setCompletedTodos(updatedCompleted);
        localStorage.setItem(STORAGE_KEYS.completed, JSON.stringify(updatedCompleted));
    };

    useEffect(() => {
        setTodo(readStoredList(STORAGE_KEYS.todos));
        setCompletedTodos(readStoredList(STORAGE_KEYS.completed));
    }, []);

    return (
        <div className='container'>
            <h1>To-Do-List</h1>

            <div className='task_form'>
                <div className='task_input'>
                    <div className='task_item'>
                        <label>Title</label>
                        <input
                            type='text'
                            value={newTitle}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder='What is the task title?'
                        />
                    </div>

                    <div className='task_item'>
                        <label>Description</label>
                        <input
                            type='text'
                            value={newDescription}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='What is the task description?'
                        />
                    </div>

                    <div className='task_item'>
                        <button className='add_button' onClick={handleAddTodo}>
                            Add
                        </button>
                    </div>
                </div>

                <div className='button_item'>
                    <button
                        className={`button_todo ${!isCompleteScreen && 'active'}`}
                        onClick={() => setIsCompleteScreen(false)}
                    >
                        TODO
                    </button>

                    <button
                        className={`button_todo ${isCompleteScreen && 'active'}`}
                        onClick={() => setIsCompleteScreen(true)}
                    >
                        Completed
                    </button>
                </div>

                <div className='todo_list'>
                    {!isCompleteScreen &&
                        allTodos.map((item) => (
                            <div className='todolist_item' key={item.id}>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>

                                <div>
                                    <MdOutlineDelete
                                        className='icon'
                                        onClick={() => handleDeleteTodo(item.id)}
                                    />
                                    <FaCheck
                                        className='check-icon'
                                        onClick={() => handleComplete(item.id)}
                                    />
                                </div>
                            </div>
                        ))}

                    {isCompleteScreen &&
                        completedTodos.map((item) => (
                            <div className='todolist_item' key={item.id}>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    <p><i>Completed on: {item.completedOn}</i></p>
                                </div>

                                <div>
                                    <MdOutlineDelete
                                        className='icon'
                                        onClick={() => handleDeleteCompletedTodo(item.id)}
                                    />
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ToDo;
import React, {useState} from 'react';
import './App.css';
import {Todolist} from './components/Todolist';
import {v1} from 'uuid';
import {UniversalAddItemForm} from './components/UniversalAddItemForm';
import {AppBarComponent} from './components/AppBarComponent';
import {Container, Grid, Paper} from '@mui/material';

export type TodolistFilterValuesType = 'all' | 'active' | 'completed';
export type TodolistType = {
    todolistId: string,
    todolistTitle: string,
    todolistFilter: TodolistFilterValuesType,
};

export type TaskType = {
    taskId: string,
    taskTitle: string,
    taskIsDoneStatus: boolean,
};
export type TasksType = {
    [key: string]: Array<TaskType>,
};

export function App() {

    const todolistID1 = v1();
    const todolistID2 = v1();

    const [todolists, setTodolists] = useState<Array<TodolistType>>([
        {todolistId: todolistID1, todolistTitle: 'What to learn', todolistFilter: 'all'},
        {todolistId: todolistID2, todolistTitle: 'What to buy', todolistFilter: 'all'},
    ]);

    const [tasks, setTasks] = useState<TasksType>({
        [todolistID1]:
            [
                {taskId: v1(), taskTitle: 'HTML&CSS', taskIsDoneStatus: true},
                {taskId: v1(), taskTitle: 'JS', taskIsDoneStatus: true},
                {taskId: v1(), taskTitle: 'ReactJS', taskIsDoneStatus: false},
                {taskId: v1(), taskTitle: 'Rest API', taskIsDoneStatus: false},
                {taskId: v1(), taskTitle: 'GraphQL', taskIsDoneStatus: false},
            ],
        [todolistID2]:
            [
                {taskId: v1(), taskTitle: 'Book', taskIsDoneStatus: true},
                {taskId: v1(), taskTitle: 'Milk', taskIsDoneStatus: false},
                {taskId: v1(), taskTitle: 'Bred', taskIsDoneStatus: true},
                {taskId: v1(), taskTitle: 'Pasta', taskIsDoneStatus: false},
                {taskId: v1(), taskTitle: 'Pencil', taskIsDoneStatus: true},
            ],
    });

    function addTodolist(titleOfNewTodolist:string):void {
        const newTodolist:TodolistType = {todolistId: v1(), todolistTitle: titleOfNewTodolist, todolistFilter: 'all'}
        setTodolists([newTodolist, ...todolists])
        setTasks({[newTodolist.todolistId]: [], ...tasks})
    }
    function removeTodolist(todolistID:string):void {
        setTodolists(todolists.filter(tl => tl.todolistId !== todolistID));
        delete tasks[todolistID];
        setTasks({...tasks});
    }
    function changeTodolistTitle(todolistID:string, newTodolistTitle:string):void {
        setTodolists(todolists.map(tl => tl.todolistId === todolistID ? {...tl, todolistTitle: newTodolistTitle} : tl))
    }
    function changeTodolistFilter(todolistID:string, newTodolistFilter:TodolistFilterValuesType):void {
        setTodolists(todolists.map(tl => tl.todolistId === todolistID ? {...tl, todolistFilter: newTodolistFilter} : tl));
    }

    function addTask(todolistID:string, titleOfNewTask:string):void {
        const newTask:TaskType = {taskId: v1(), taskTitle: titleOfNewTask, taskIsDoneStatus: false};
        setTasks({...tasks, [todolistID]: [newTask, ...tasks[todolistID]]});
    }
    function removeTask(todolistID:string, taskID:string):void {
        setTasks({...tasks, [todolistID]: tasks[todolistID].filter(task => task.taskId !== taskID)});
    }
    function changeTaskTitle(todolistID:string, taskID:string, newTaskTitle:string):void {
        setTasks({...tasks, [todolistID]: tasks[todolistID].map(task => task.taskId === taskID ? {...task, taskTitle: newTaskTitle} : task)})
    }
    function changeTaskStatus(todolistID:string, taskID:string, taskStatus:boolean):void {
        setTasks({...tasks, [todolistID]: tasks[todolistID].map(task => task.taskId === taskID ? {...task, taskIsDoneStatus: taskStatus} : task)})
    }

    return (
        <div className="App">
            <AppBarComponent/>
            <Container style={{padding: '30px', margin: '0', maxWidth: '100%'}} fixed>
                <Grid container>
                    <Paper style={{padding: '10px', backgroundColor: ''}} elevation={3}>
                        <Grid item>
                            <div>
                                <h3 style={{display: 'inline'}}>Add new todolist</h3>
                                <UniversalAddItemForm what={'todolist title'} callback={addTodolist}/>
                            </div>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid style={{marginTop: '30px', justifyContent: 'flex-start', gap: '30px'}} container>
                    {todolists.map(tl => {

                        let filteredTasksByFilter = tasks[tl.todolistId];
                        if (tl.todolistFilter === 'active') {
                            filteredTasksByFilter = tasks[tl.todolistId].filter(task => !task.taskIsDoneStatus);
                        }
                        if (tl.todolistFilter === 'completed') {
                            filteredTasksByFilter = tasks[tl.todolistId].filter(task => task.taskIsDoneStatus);
                        }

                        return (
                            <Paper style={{padding: '10px'}} elevation={3}>
                                <Grid item>
                                    <Todolist
                                        key={tl.todolistId}
                                        todolistId={tl.todolistId}
                                        todolistTitle={tl.todolistTitle}
                                        todolistFilter={tl.todolistFilter}
                                        tasks={filteredTasksByFilter}

                                        removeTodolist={removeTodolist}
                                        changeTodolistTitle={changeTodolistTitle}
                                        changeTodolistFilter={changeTodolistFilter}

                                        addTask={addTask}
                                        removeTask={removeTask}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTaskStatus={changeTaskStatus}
                                    />
                                </Grid>
                            </Paper>
                        )
                    })}
                </Grid>
            </Container>
        </div>
    );
}
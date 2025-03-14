import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit, MdConfirmationNumber } from "react-icons/md";
import axios from "axios";
import { format } from 'date-fns'


// IMPORT COMPONENT


const index = () => {
  const [editText, setEditText] = useState();
  const [todos, setTodos] = useState([])
  const [todosCopy, setTodosCopy] = useState(todos)
  const [todoInput, setTodoInput] = useState("")
  const [editIndex, setEditIndex] = useState(-1)
  const [searchInput, setSearchInput] = useState("")
  const [searchResult, setSearchResult] = useState([])

  //STATE MANAGEMENT
  const [count, setCount] = useState(0)
  const [search, setSearch] = useState("")
  const [searchItem, setSearchItem] = useState(search);

  //API CALL
  useEffect(() => {
    //fetch todos
    fetchTodos();
  }, [count])


  const editTodo = (index) => {
    setTodoInput(todos[index].title)
    setEditIndex(index)
  };


  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8080/todos")
      console.log(response);
      setTodos(response.data);
      setTodosCopy(response.data);
    } catch (error) {
      console.log(error)
    }
  }

  const addTodo = async () => {
    try {
      if (editIndex === -1) {
        //ADD NEW TODO
        const response = await axios.post("http://127.0.0.1:8080/todos", {
          title: todoInput,
          completed: false
        });
        setTodos(response.data);
        setTodosCopy(response.data);
        setTodoInput("");
      } else {
        //Update TODO
        const todoUpdate = { ...todos[editIndex], title: todoInput }
        const response = await axios.put(`http://127.0.0.1:8080/todos/${todoUpdate.id}`, {
          todoUpdate
        });
        console.log(response);
        const updatedTodos = [...todos];
        updatedTodos[editIndex] = response.data
        setTodos(updatedTodos)
        setTodoInput("")
        setEditIndex(-1)
        setCount(count + 1);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8080/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  const toggleCompleted = async (index) => {
    try {
      const todoToUpdate = { ...todos[index], completed: !todos[index].completed };
      const response = await axios.delete(`http://127.0.0.1:8080/todos/${todoToUpdate.id}`);
      const updatedTodos = [...todos];
      updatedTodos[index] = response.data
      setTodos(updatedTodos)
      setCount(count + 1);
    } catch (error) {
      console.log(error);
    }
  }

  const searchTodo = () => {
    const results = todos.filter((todo) => todo.title.toLowerCase().includes(searchInput.toLowerCase()));
    setSearchResult(results);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Invalid date" : format(date, "yyyy-MM-dd HH:mm:ss");
    } catch (error) {
      console.log(error)
    }
  }

  const renderTodos = (todosTorender) => {
    return todosTorender.map((todo, index) => (
      <li key={index} className="li">
        <label htmlFor="" className="form-check-label"></label>
        <span className="todo-text">
          {`${todo.title} ${formatDate(todo.created_at)} `}
        </span>
        <span className="span-button" onClick={() => deleteTodo(todo.id)}>
          <i className="fa-solid fa-trash">
            <MdDelete />
          </i>
        </span>
        <span className="span-button" onClick={() => editIndex(index)}>
          <i className="fa-solid fa-trash">
            <MdEdit />
          </i>
        </span>
      </li>
    ))
  }

  // FILTER
  const onHandleSearch = (value) => {
    const filteredTodo = todos.filter((title) => title.toLowerCase().includes(value.toLowerCase()));
    if(filteredTodo.length === 0) {
      setTodos(todosCopy)
    } else {
      setTodos(filteredTodo)
    }
  }


  const onClearSearch = () => {
    if ( todos.length && todosCopy.length) {
      setTodos(todosCopy);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchItem), 1000);
    return () => clearTimeout(timer);
  },[searchItem])

  useEffect(() => {
    if (search) {
      onHandleSearch()
    } else {
      onClearSearch();
    }
  },[search])


  return <div className="main-body">
    <div className="todo-app">
      <div className="input-section">
        <input
          type="text"
          id="todoInput"
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button onClick={() => addTodo()} className="add">
          {editIndex === -1 ? "Add" : "Update"}
        </button>
        <input
          type="text"
          id="search-input"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
          placeholder="Search"
        />
        <button onClick={() => { }}>
          Search
        </button>
      </div>
      {/* body */}
      <div className="todos">
        <ul className="todo-list">
          {
            renderTodos(todos)
          }
        </ul>
          {
            todos.length === 0 && (
              <div>
                <img className="face" src="/theblockchaincoders.jpg" alt="" />
                <h1 className="not-found">NOT FOUND</h1>
              </div>
            )
          }
      </div>
    </div>
  </div>;
};

export default index;

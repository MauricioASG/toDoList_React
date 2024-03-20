// Importamos React y useState desde la biblioteca 'react'
import React, {useState,useEffect} from "react";
// Importamos el archivo CSS de la aplicación
import "./App.css";




// Definimos nuestro componente funcional llamado App
const App = () => {
  // Definimos el estado 'todos' que mantiene una lista de todas las tareas
  // 'setTodos' es una función que nos permite cambiar el estado del componente
  const [todos, setTodos] = useState([]);
  const [todoEditing, setTodoEditing] = useState(null); // Nuevo estado para el ID de la tarea en modo de edición
  



// Hook useEffect para cargar las tareas almacenadas en el localStorage al cargar la aplicación
useEffect(() => {
  const json = localStorage.getItem("todos"); // Obtenemos las tareas almacenadas en formato JSON desde el localStorage
  const loadedTodos = JSON.parse(json); // Convertimos las tareas JSON a un objeto JavaScript
  if (loadedTodos) {
    // Verificamos si hay tareas cargadas
    setTodos(loadedTodos); // Establecemos las tareas cargadas en el estado 'todos'
  }
}, []);

// Hook useEffect para guardar las tareas en el localStorage cada vez que cambian
useEffect(() => {
  if (todos.length > 0) {
    // Verificamos si hay tareas en el estado 'todos'
    const json = JSON.stringify(todos); // Convertimos las tareas a formato JSON
    localStorage.setItem("todos", json); // Almacenamos las tareas JSON en el localStorage
  }
}, [todos]);




  // Función para manejar la presentación del formulario
  function handleSubmit(e) {
    // Evita el comportamiento predeterminado del evento (envío del formulario)
    e.preventDefault();
    
    // Obtiene el valor del campo de entrada de la tarea
    let todo = document.getElementById('todoAdd').value;
    
    // Crea un nuevo objeto de tarea con un ID único generado a partir de la fecha y hora actual
    // El texto de la tarea se toma del campo de entrada y se eliminan los espacios al principio y al final
    const newTodo = {
      id: new Date().getTime(), // ID único generado a partir de la fecha y hora actual
      text: todo.trim(), // Texto de la tarea sin espacios al principio o al final
      completed: false, // Estado completado inicializado como falso
    };
    // Valida que el texto de la tarea no esté vacío
    if (newTodo.text.length > 0) {
      // Agrega la nueva tarea a la lista de tareas pendientes
      setTodos([...todos].concat(newTodo));
    } else {
      // Muestra una alerta si el texto de la tarea es inválido
      alert("Enter Valid Task");
    }
    // Limpia el campo de entrada para la próxima tarea
    document.getElementById('todoAdd').value = "";
  }





// Función para eliminar una tarea de la lista
function deleteTodo(id) {
// Declaramos un nuevo arreglo llamado updatedTodos, donde almacenaremos una copia de 'todos' excluyendo la tarea con el ID proporcionado
  let updatedTodos = [...todos].filter((todo) => todo.id !== id);
// Actualizamos el estado 'todos' con el nuevo arreglo que no incluye la tarea eliminada
  setTodos(updatedTodos);
}



function toggleComplete(id) {
  // Creamos una copia actualizada de la lista de tareas utilizando el spread operator (...) para mantener la inmutabilidad
  let updatedTodos = [...todos].map((todo) => {
    // Iteramos sobre cada tarea en la lista de tareas
    if (todo.id === id) {
      // Comprobamos si la tarea actual tiene el mismo ID que la tarea que queremos marcar como completada
      // Si es así, cambiamos el estado de completado de la tarea utilizando el operador de negación (!)
      todo.completed = !todo.completed;
    }
    // Retornamos la tarea actual, ya sea modificada o sin cambios
    return todo;
  });
  // Actualizamos el estado de las tareas con la nueva lista de tareas actualizadas
  setTodos(updatedTodos);
}

  // Función para enviar las ediciones realizadas en una tarea
  function submitEdits(newtodo) {
    const updatedTodos = [...todos].map((todo) => {
      if (todo.id === newtodo.id) {
        todo.text = document.getElementById(newtodo.id).value; // Actualizamos el texto de la tarea con el valor del campo de entrada
      }
      return todo;
    });
    setTodos(updatedTodos); // Actualizamos el estado de las tareas con la nueva lista de tareas actualizadas
    setTodoEditing(null); // Desactivamos el modo de edición
  }





  // Retorna el contenido JSX del componente
  return (
    <div id="todo-list">
      {/* Encabezado de la lista de tareas */}
      <h1>Todo List</h1>
      {/* Formulario para agregar nuevas tareas */}
      <form onSubmit={handleSubmit}>
        {/* Campo de entrada para la nueva tarea */}
        <input
          type="text"
          id='todoAdd'
        />
        {/* Botón para agregar una nueva tarea */}
        <button type="submit">Add Todo</button>
      </form>
      {/* Mapea cada tarea en la lista y renderiza su texto */}
      {todos.map((todo) => (
        <div key={todo.id} className="todo">
          <div className="todo-text">
            {/* Add checkbox for toggle complete */}
            <input
              type="checkbox"
              id="completed"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />
            {/* if it is edit mode, display input box, else display text */}
            {todo.id === todoEditing ?
              (<input
                type="text"
                id={todo.id}
                defaultValue={todo.text}
              />) :
              (<div>{todo.text}</div>)
            }
          </div>
          <div className="todo-actions">
            {/* if it is edit mode, allow submit edit, else allow edit */}
            {todo.id === todoEditing ?
              (
                <button onClick={() => submitEdits(todo)}>Submit Edits</button>
              ) :
              (
                <button onClick={() => setTodoEditing(todo.id)}>Edit</button>
              )}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App; // Exportamos el componente App para que pueda ser utilizado en otros archivos
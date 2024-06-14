document.getElementById('taskForm').addEventListener('submit', addTask);
document.getElementById('searchTerm').addEventListener('input', searchTasks);

function addTask(event) {
    event.preventDefault();
    
    const taskName = document.getElementById('NombreTarea').value;
    const startDate = document.getElementById('FechaAsignacion').value;
    const endDate = document.getElementById('FechaEntrega').value;
    const responsible = document.getElementById('responsable').value;

    const errorMessage = validateDates(startDate, endDate);
    if (errorMessage) {
        document.getElementById('error-message').textContent = errorMessage;
        return;
    }

    const task = {
        taskName,
        startDate,
        endDate,
        responsible,
        completed: false
    };

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    document.getElementById('taskForm').reset();
    document.getElementById('error-message').textContent = '';
    displayTasks();
}

function validateDates(startDate, endDate) {
    if (new Date(endDate) < new Date(startDate)) {
        return 'La fecha de entrega no puede ser anterior a la fecha de asignación.';
    }
    return '';
}

function displayTasks(tasks = JSON.parse(localStorage.getItem('tasks')) || []) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const searchTerm = document.getElementById('searchTerm').value.toLowerCase();

    tasks = tasks.filter(task => {
        return task.taskName.toLowerCase().includes(searchTerm) || task.responsible.toLowerCase().includes(searchTerm);
    });

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('list-group-item');

        const currentDate = new Date().toISOString().split('T')[0];

        if (task.completed) {
            taskItem.classList.add('task-completed');
        } else if (currentDate > task.endDate) {
            taskItem.classList.add('task-expired');
        } else {
            taskItem.classList.add('task-pending');
        }

        taskItem.innerHTML = `
            <span>Tarea: ${task.taskName} - Responsable: ${task.responsible} - Asignado el ${task.startDate} hasta el ${task.endDate}</span>
            <div>
                <button class="btn btn-success btn-sm" onclick="markAsCompleted(${index})">Completado</button>
                <button class="btn btn-warning btn-sm" onclick="unmarkAsCompleted(${index})">Desmarcar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})">Eliminar</button>
            </div>
        `;

        taskList.appendChild(taskItem);
    });
}

function markAsCompleted(index) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (new Date(tasks[index].endDate) >= new Date()) {
        tasks[index].completed = true;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
    } else {
        alert('No se puede marcar como completado. La fecha de entrega ha expirado.');
    }
}

function unmarkAsCompleted(index) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks[index].completed = false;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function deleteTask(index) {
    if (confirm('¿Estás seguro que quieres borrar esta tarea?')) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
    }
}

function searchTasks() {
    displayTasks();
}

document.addEventListener('DOMContentLoaded', displayTasks);
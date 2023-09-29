const themeIcon = document.querySelector('.theme-icon');
const toDoForm = document.querySelector('form');
const toDoDisplay = document.querySelector('.todo-display');
const allToDos = document.querySelector('.all');
const activeToDos = document.querySelector('.active');
const completedToDos = document.querySelector('.completed');
const statusButtons = document.querySelectorAll('.status');
const toDosCountElement = document.querySelector('.todo-left-counter');
const toDosElement = document.getElementsByName('todo-status');

let allToDosList = JSON.parse(localStorage.getItem("toDosData"));
let activeToDosList = [];
let completedToDosList = [];

if (allToDosList == null) {
    allToDosList = {};
}

themeIcon.addEventListener('click', () => {
    if (document.body.classList.contains("dark-theme")) {
        document.body.classList = "light-theme";
    } else {
        document.body.classList = "dark-theme";
    }
})

toDoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(toDoForm);

    let toDo = {
        id: Date.now(),
        title: formData.get("todo-input"),
        isCompleted: false
    }

    toDosList.push(toDo);
    toDoForm.reset();

    localStorage.setItem("toDosData", JSON.stringify(toDosList));

    generateToDos(allToDosList);
})

const generateToDos = (toDosList) => {
    if (toDosList == null) {
        return
    }

    let toDos = '';

    toDosList.forEach((toDo) => {
        var id = toDo.id;
        var title = toDo.title;
        var isChecked = toDo.isCompleted ? "checked" : "";

        toDos += `
            <div class="todo">
                <div class="todo-details">
                    <label for="${id}">
                        <img class="check-icon" src="./images/icon-check.svg" alt="check-icon">
                    </label>
                    <input type="checkbox" ${isChecked} name="todo-status" id="${id}">
                    <p class="todo-title">${title}</p>
                </div>
                <img class="cross-icon" src="./images/icon-cross.svg" alt="cross-icon" onclick="deleteTodo(${id})">
            </div>
        `
    });

    toDoDisplay.innerHTML = toDos;
    updateToDoCount();
}

const countActiveAndCompleted = () => {

    activeToDosList = []
    completedToDosList = []

    allToDosList.forEach((toDo) => {
        if (!toDo.isCompleted) {
            activeToDosList.push(toDo);
        } else {
            completedToDosList.push(toDo);
        }
    })
}

const deleteTodo = (toDoId) => {
    allToDosList.forEach((toDo) => {
        if (toDo.id === toDoId) {
            allToDosList.splice(allToDosList.indexOf(toDo), 1);
        }
    });

    generateToDos(allToDosList);
}


const updateToDoCount = () => {
    let itemsLeft = 0;

    allToDosList.forEach((todo) => {
        if (!todo.isCompleted) {
            itemsLeft += 1;
        }
    })

    toDosCountElement.innerHTML = itemsLeft;
    countActiveAndCompleted()
}

generateToDos(allToDosList);

for (let toDoElement of toDosElement) {
    toDoElement.addEventListener('click', () => {
        var isCompleted = toDoElement.checked;
        updateToDoStatus(toDoElement.id, isCompleted);
        updateToDoCount();
    })
}

const updateToDoStatus = (id, isCompleted) => {
    allToDosList.forEach((toDo) => {
        if (toDo.id === parseInt(id)) {
            toDo.isCompleted = isCompleted;
        }
    })
    generateToDos(allToDosList);
}

activeToDos.addEventListener('click', () => {
    if (activeToDos.classList.contains('selected')) {
        return;
    } else {
        allToDos.classList.remove('selected')
        completedToDos.classList.remove('selected')
        activeToDos.classList.add('selected')
        generateToDos(activeToDosList);
    }
})

completedToDos.addEventListener('click', () => {
    if (completedToDos.classList.contains('selected')) {
        return;
    } else {
        allToDos.classList.remove('selected')
        activeToDos.classList.remove('selected')
        completedToDos.classList.add('selected')
        generateToDos(completedToDosList);
    }
})

allToDos.addEventListener('click', () => {
    if (allToDos.classList.contains('selected')) {
        return;
    } else {
        activeToDos.classList.remove('selected')
        completedToDos.classList.remove('selected')
        allToDos.classList.add('selected')
        generateToDos(allToDosList);
    }
})
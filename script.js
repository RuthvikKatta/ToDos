const themeIcon = document.querySelector('.theme-icon');
const toDoForm = document.querySelector('form');
const toDoDisplay = document.querySelector('.todo-display');
const allToDos = document.querySelector('.all');
const activeToDos = document.querySelector('.active');
const completedToDos = document.querySelector('.completed');
const statusButtons = document.querySelectorAll('.status');
const toDosCountElement = document.querySelector('.todo-left-counter');
const clearCompleted = document.querySelector('.clear');

let allToDosList = JSON.parse(localStorage.getItem("toDosData")) || [];
let currrentTheme = JSON.parse(localStorage.getItem("theme")) || "light-theme";
let activeToDosList = [];
let completedToDosList = [];

document.body.classList = currrentTheme;

themeIcon.addEventListener('click', () => {
    currrentTheme = document.body.classList.contains("dark-theme") ? "light-theme" : "dark-theme";
    document.body.classList = currrentTheme;
    localStorage.setItem("theme", JSON.stringify(currrentTheme))
})

toDoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(toDoForm);
    const toDoTitle = formData.get("todo-input")

    let toDo = {
        id: Date.now(),
        title: toDoTitle,
        isCompleted: false
    }

    allToDosList.splice(0, 0, toDo);
    toDoForm.reset();

    generateToDos(allToDosList, true);
})

const generateToDos = (toDosList, isDraggable) => {
    if (toDosList == null) {
        return
    }

    let toDosString = '';

    toDosList.forEach((toDo) => {
        var id = toDo.id;
        var title = toDo.title;
        var isChecked = toDo.isCompleted ? "checked" : "";

        toDosString += `
            <div class="todo" draggable="${isDraggable}" id=${id + "_root"}>
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

    toDoDisplay.innerHTML = toDosString;

    const toDosElement = document.getElementsByName('todo-status');
    const toDos = document.querySelectorAll('.todo');

    updateToDoCount();

    for (let toDoElement of toDosElement) {
        toDoElement.addEventListener('click', (e) => {
            const isCompleted = toDoElement.checked;
            const todoId = parseInt(e.target.id);
            const todoToUpdate = allToDosList.find(todo => todo.id === todoId);

            if (todoToUpdate) {
                todoToUpdate.isCompleted = isCompleted;
                updateToDoCount();
            }
        });
    }

    toDos.forEach((currTodo) => {

        currTodo.addEventListener('drag', (e) => {

            var prevTodo = currTodo.previousElementSibling;
            var nextTodo = currTodo.nextElementSibling;
            var mousePointerY = e.pageY;

            // move down
            if (null != nextTodo) {
                var nextTodoY = nextTodo.getBoundingClientRect().y;

                if (mousePointerY >= nextTodoY && mousePointerY != 0) {
                    toDoDisplay.insertBefore(currTodo, nextTodo.nextElementSibling);
                }
            }

            // move up
            if (null != prevTodo) {
                var prevTodoY = prevTodo.getBoundingClientRect().y;

                if (mousePointerY - 50 <= prevTodoY && mousePointerY != 0) {
                    toDoDisplay.insertBefore(currTodo, prevTodo);
                }
            }
        })

        currTodo.addEventListener('dragend', () => {
            updateToDosOrder();
            currTodo.classList.remove('custom-grabbing-cursor');
        })
    })
}

const updateToDosOrder = () => {
    const toDos = document.getElementsByName('todo-status');

    allToDosList = [];

    toDos.forEach((todo) => {
        let newToDo = {
            id: parseInt(todo.id),
            title: todo.nextElementSibling.innerText,
            isCompleted: todo.checked
        };

        allToDosList.push(newToDo);
    })

    generateToDos(allToDosList, true)
}

const deleteTodo = (toDoId) => {
    allToDosList = allToDosList.filter((toDo) => toDo.id !== toDoId);
    generateToDos(allToDosList, true);
};

const updateToDoCount = () => {
    let itemsLeft = 0;
    activeToDosList = [];
    completedToDosList = [];

    allToDosList.forEach((todo) => {
        if (!todo.isCompleted) {
            itemsLeft += 1;
            activeToDosList.push(todo);
        } else {
            completedToDosList.push(todo);
        }
    });

    localStorage.setItem("toDosData", JSON.stringify(allToDosList));
    toDosCountElement.textContent = itemsLeft;
};

generateToDos(allToDosList, true);

allToDos.addEventListener('click', () => {
    allToDos.classList.add('selected');
    activeToDos.classList.remove('selected');
    completedToDos.classList.remove('selected');
    generateToDos(allToDosList, true);
});

activeToDos.addEventListener('click', () => {
    allToDos.classList.remove('selected');
    activeToDos.classList.add('selected');
    completedToDos.classList.remove('selected');
    generateToDos(activeToDosList, false);
});

completedToDos.addEventListener('click', () => {
    allToDos.classList.remove('selected');
    activeToDos.classList.remove('selected');
    completedToDos.classList.add('selected');
    generateToDos(completedToDosList, false);
});

clearCompleted.addEventListener('click', () => {
    completedToDosList.forEach((toDo) => {
        deleteTodo(toDo.id);
    });
});
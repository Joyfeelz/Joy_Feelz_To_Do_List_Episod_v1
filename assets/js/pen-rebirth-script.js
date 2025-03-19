document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("penrebirth-task-list");
    const addTaskButton = document.getElementById("penrebirth-add-task");
    const taskInput = document.getElementById("penrebirth-task-input");
    const descriptionInput = document.getElementById("penrebirth-description-input");
    const searchInput = document.getElementById("penrebirth-search");
    const toggleThemeButton = document.getElementById("penrebirth-toggle-theme-later");

    const clickSound = new Audio("./audio/click.wav");
    const successSound = new Audio("./audio/success.wav");

    const savedTasks = JSON.parse(localStorage.getItem("penrebirthTasks")) || [];
    savedTasks.forEach(task => addTaskToDOM(task.title, task.description));

    addTaskButton.addEventListener("click", () => {
        const taskTitle = taskInput.value.trim();
        const taskDescription = descriptionInput.value.trim();
        
        if (taskTitle) {
            clickSound.play();
            addTaskToDOM(taskTitle, taskDescription);
            saveTasksToLocalStorage();
            triggerConfetti();
            successSound.play();
            taskInput.value = "";
            descriptionInput.value = "";
        }
    });

    taskList.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            clickSound.play();
            const taskItem = e.target.closest(".penrebirth-task");
            const taskTitle = taskItem.querySelector("span").textContent;

            if (e.target.textContent === "Delete") {
                taskItem.style.animation = "fadeOut 0.3s forwards";
                setTimeout(() => {
                    taskItem.remove();
                    saveTasksToLocalStorage();
                }, 300);
            }

            if (e.target.textContent === "Edit") {
                const newTitle = prompt("Edit Task Title:", taskTitle);
                const newDescription = prompt("Edit Task Description:", taskItem.querySelector(".description").textContent);
                
                if (newTitle !== null && newDescription !== null) {
                    taskItem.querySelector("span").textContent = newTitle;
                    taskItem.querySelector(".description").textContent = newDescription;
                    saveTasksToLocalStorage();
                }
            }
        }
    });

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const tasks = document.querySelectorAll(".penrebirth-task");
        
        tasks.forEach(task => {
            const title = task.querySelector("span").textContent.toLowerCase();
            const description = task.querySelector(".description").textContent.toLowerCase();
            task.style.display = (title.includes(query) || description.includes(query)) ? "block" : "none";
        });
    });

    toggleThemeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    function addTaskToDOM(title, description) {
        const taskItem = document.createElement("li");
        taskItem.classList.add("penrebirth-task", "new-task");
        
        taskItem.innerHTML = `
            <span>${title}</span>
            <p class="description">${description}</p>
            <div class="task-buttons">
                <button>Edit</button>
                <button>Delete</button>
            </div>
        `;
        
        taskList.appendChild(taskItem);
    }

    function saveTasksToLocalStorage() {
        const tasks = [];
        document.querySelectorAll(".penrebirth-task").forEach(task => {
            tasks.push({
                title: task.querySelector("span").textContent,
                description: task.querySelector(".description").textContent
            });
        });
        localStorage.setItem("penrebirthTasks", JSON.stringify(tasks));
    }

    function triggerConfetti() {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 1500);
    }
});

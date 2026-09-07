/* =========================================================
   TASK DATA
========================================================= */

let tasks =
    JSON.parse(
        localStorage.getItem("tasks")
    ) || [];


let currentFilter =
    "all";


let editingTaskId =
    null;


/* =========================================================
   SAVE TASKS
========================================================= */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


/* =========================================================
   ADD TASK
========================================================= */

function addTask() {


    const input =
        document.getElementById(
            "taskInput"
        );


    const priority =
        document.getElementById(
            "priority"
        );


    const deadline =
        document.getElementById(
            "deadline"
        );


    const text =
        input.value.trim();


    if (text === "") {

        alert(
            "Введите задачу!"
        );

        input.focus();

        return;

    }


    const task = {

        id:
            Date.now(),

        text:
            text,

        priority:
            priority.value,

        deadline:
            deadline.value,

        percent:
            0,

        completed:
            false,

        createdAt:
            new Date().toISOString(),

        completedAt:
            null

    };


    tasks.push(task);


    saveTasks();


    input.value = "";

    deadline.value = "";


    renderTasks();

}


/* =========================================================
   DELETE TASK
========================================================= */

function deleteTask(id) {


    if (
        !confirm(
            "Удалить эту задачу?"
        )
    ) {

        return;

    }


    tasks =
        tasks.filter(
            task =>
                task.id !== id
        );


    saveTasks();


    renderTasks();

}


/* =========================================================
   CHECKBOX
========================================================= */

function toggleTask(id) {


    const task =
        tasks.find(
            task =>
                task.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    if (task.completed) {

        task.percent =
            100;

        task.completedAt =
            new Date().toISOString();

    }
    else {

        task.percent =
            0;

        task.completedAt =
            null;

    }


    saveTasks();


    renderTasks();

}


/* =========================================================
   OPEN EDIT MODAL
========================================================= */

function editTask(id) {


    const task =
        tasks.find(
            task =>
                task.id === id
        );


    if (!task) return;


    editingTaskId =
        id;


    document.getElementById(
        "editTaskInput"
    ).value =
        task.text;


    document.getElementById(
        "editPriority"
    ).value =
        task.priority;


    document.getElementById(
        "editDeadline"
    ).value =
        task.deadline;


    document.getElementById(
        "editPercent"
    ).value =
        task.percent;


    updateRangeValue();


    document.getElementById(
        "editModal"
    ).classList.add(
        "active"
    );


    document.getElementById(
        "editTaskInput"
    ).focus();

}


/* =========================================================
   RANGE
========================================================= */

function updateRangeValue() {


    const value =
        document.getElementById(
            "editPercent"
        ).value;


    document.getElementById(
        "rangeValue"
    ).textContent =
        value + "%";

}


/* =========================================================
   SAVE EDITED TASK
========================================================= */

function saveEditedTask() {


    const task =
        tasks.find(
            task =>
                task.id ===
                editingTaskId
        );


    if (!task) return;


    const text =
        document.getElementById(
            "editTaskInput"
        ).value.trim();


    const priority =
        document.getElementById(
            "editPriority"
        ).value;


    const deadline =
        document.getElementById(
            "editDeadline"
        ).value;


    const percent =
        Number(
            document.getElementById(
                "editPercent"
            ).value
        );


    if (text === "") {

        alert(
            "Название не может быть пустым!"
        );

        return;

    }


    task.text =
        text;


    task.priority =
        priority;


    task.deadline =
        deadline;


    task.percent =
        percent;


    if (percent === 100) {

        task.completed =
            true;


        task.completedAt =
            task.completedAt ||
            new Date().toISOString();

    }
    else {

        task.completed =
            false;


        task.completedAt =
            null;

    }


    saveTasks();


    closeModal();


    renderTasks();

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {


    document.getElementById(
        "editModal"
    ).classList.remove(
        "active"
    );


    editingTaskId =
        null;

}


/* =========================================================
   CLOSE MODAL BY CLICKING OUTSIDE
========================================================= */

document.getElementById(
    "editModal"
).addEventListener(
    "click",
    function(event) {


        if (
            event.target ===
            this
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   FILTER
========================================================= */

function setFilter(
    filter,
    button
) {


    currentFilter =
        filter;


    document
        .querySelectorAll(
            ".filter-button"
        )
        .forEach(
            btn =>
                btn.classList
                    .remove(
                        "active"
                    )
        );


    button.classList.add(
        "active"
    );


    renderTasks();

}


/* =========================================================
   RENDER TASKS
========================================================= */

function renderTasks() {


    const list =
        document.getElementById(
            "taskList"
        );


    const search =
        document.getElementById(
            "searchInput"
        ).value
        .toLowerCase();


    list.innerHTML = "";


    let filtered =
        tasks.filter(
            task => {


                const matchesSearch =
                    task.text
                        .toLowerCase()
                        .includes(
                            search
                        );


                if (
                    !matchesSearch
                ) {

                    return false;

                }


                if (
                    currentFilter ===
                    "active"
                ) {

                    return !task.completed;

                }


                if (
                    currentFilter ===
                    "completed"
                ) {

                    return task.completed;

                }


                if (
                    currentFilter ===
                    "high"
                ) {

                    return (
                        task.priority ===
                        "high"
                    );

                }


                return true;

            }
        );


    /* =====================================================
       SORT
    ===================================================== */

    const priorityOrder = {

        high: 1,

        medium: 2,

        low: 3

    };


    filtered.sort(
        (a, b) => {


            if (
                a.completed !==
                b.completed
            ) {

                return (
                    a.completed -
                    b.completed
                );

            }


            return (
                priorityOrder[
                    a.priority
                ] -
                priorityOrder[
                    b.priority
                ]
            );

        }
    );


    /* =====================================================
       EMPTY
    ===================================================== */

    if (
        filtered.length === 0
    ) {

        list.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    🎉
                </div>

                <div>
                    Здесь пока ничего нет
                </div>

            </div>

        `;

    }


    /* =====================================================
       TASK HTML
    ===================================================== */

    filtered.forEach(
        task => {


            /* Compatibility with old tasks */

            if (
                typeof task.percent !==
                "number"
            ) {

                task.percent =
                    task.completed
                        ? 100
                        : 0;

            }


            const li =
                document.createElement(
                    "li"
                );


            li.className =
                "task";


            if (
                task.completed
            ) {

                li.classList.add(
                    "completed"
                );

            }


            /* =================================================
               PRIORITY
            ================================================= */

            let priorityHTML =
                "";


            if (
                task.priority ===
                "high"
            ) {

                priorityHTML = `

                    <span class="high">
                        🔴 Высокий
                    </span>

                `;

            }


            if (
                task.priority ===
                "medium"
            ) {

                priorityHTML = `

                    <span class="medium">
                        🟡 Средний
                    </span>

                `;

            }


            if (
                task.priority ===
                "low"
            ) {

                priorityHTML = `

                    <span class="low">
                        🟢 Низкий
                    </span>

                `;

            }


            /* =================================================
               DEADLINE
            ================================================= */

            let deadlineHTML =
                "";


            if (
                task.deadline
            ) {


                const today =
                    new Date()
                        .toISOString()
                        .split("T")[0];


                if (
                    task.deadline <
                    today &&
                    !task.completed
                ) {

                    deadlineHTML = `

                        <span class="overdue">

                            ⚠️ Просрочено:
                            ${formatDate(
                                task.deadline
                            )}

                        </span>

                    `;

                }
                else {

                    deadlineHTML = `

                        <span>

                            📅
                            ${formatDate(
                                task.deadline
                            )}

                        </span>

                    `;

                }

            }


            /* =================================================
               TASK
            ================================================= */

            li.innerHTML = `

                <input

                    type="checkbox"

                    class="check"

                    ${
                        task.completed
                        ? "checked"
                        : ""
                    }

                    onchange="
                        toggleTask(
                            ${task.id}
                        )
                    "

                >


                <div
                    class="task-content">


                    <div
                        class="task-title">

                        ${escapeHTML(
                            task.text
                        )}

                    </div>


                    <div
                        class="task-progress-wrapper">


                        <div
                            class="task-progress">

                            <div

                                class="task-progress-bar"

                                style="
                                    width:
                                    ${task.percent}%
                                "

                            ></div>

                        </div>


                        <span
                            class="task-percent">

                            ${task.percent}%

                        </span>


                    </div>


                    <div
                        class="task-info">

                        ${priorityHTML}

                        ${deadlineHTML}

                    </div>


                </div>


                <div
                    class="task-actions">


                    <button

                        class="action-button"

                        onclick="
                            editTask(
                                ${task.id}
                            )
                        "

                        title="Редактировать"

                    >

                        ✏️

                    </button>


                    <button

                        class="
                            action-button
                            delete
                        "

                        onclick="
                            deleteTask(
                                ${task.id}
                            )
                        "

                        title="Удалить"

                    >

                        🗑️

                    </button>


                </div>

            `;


            list.appendChild(
                li
            );

        }
    );


    updateStats();

    drawCharts();

    updateXP();

    updateAchievements();

}


/* =========================================================
   STATISTICS
========================================================= */

function updateStats() {


    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;


    const active =
        total -
        completed;


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const overdue =
        tasks.filter(
            task =>
                task.deadline &&
                task.deadline <
                    today &&
                !task.completed
        ).length;


    /* =====================================================
       OVERALL PERCENT
    ===================================================== */

    const average =
        total === 0
            ? 0
            : Math.round(
                tasks.reduce(
                    (
                        sum,
                        task
                    ) => {

                        return (
                            sum +
                            (
                                typeof task.percent ===
                                "number"
                                    ? task.percent
                                    : (
                                        task.completed
                                            ? 100
                                            : 0
                                    )
                            )
                        );

                    },
                    0
                ) / total
            );


    document.getElementById(
        "totalTasks"
    ).textContent =
        total;


    document.getElementById(
        "completedTasks"
    ).textContent =
        completed;


    document.getElementById(
        "activeTasks"
    ).textContent =
        active;


    document.getElementById(
        "overdueTasks"
    ).textContent =
        overdue;


    document.getElementById(
        "overallPercent"
    ).textContent =
        average + "%";


    document.getElementById(
        "overallBar"
    ).style.width =
        average + "%";


    document.getElementById(
        "taskCounter"
    ).textContent =
        active +
        " активных задач";

}


/* =========================================================
   CLEAR COMPLETED
========================================================= */

function clearCompleted() {


    const count =
        tasks.filter(
            task =>
                task.completed
        ).length;


    if (count === 0) {

        alert(
            "Нет выполненных задач."
        );

        return;

    }


    if (
        !confirm(
            "Удалить все выполненные задачи?"
        )
    ) {

        return;

    }


    tasks =
        tasks.filter(
            task =>
                !task.completed
        );


    saveTasks();


    renderTasks();

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(
    date
) {


    const parts =
        date.split("-");


    return (
        parts[2] +
        "." +
        parts[1] +
        "." +
        parts[0]
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    text
) {


    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================================
   THEME
========================================================= */

function toggleTheme() {


    document.body
        .classList
        .toggle("dark");


    const dark =
        document.body
            .classList
            .contains("dark");


    localStorage.setItem(
        "theme",
        dark
            ? "dark"
            : "light"
    );


    document.getElementById(
        "themeButton"
    ).textContent =
        dark
            ? "☀️"
            : "🌙";


    drawCharts();

}


/* =========================================================
   LAST 7 DAYS
========================================================= */

function getLastSevenDays() {


    const result =
        [];


    for (
        let i = 6;
        i >= 0;
        i--
    ) {


        const date =
            new Date();


        date.setDate(
            date.getDate() - i
        );


        const iso =
            date
                .toISOString()
                .split("T")[0];


        const label =
            date.toLocaleDateString(
                "ru-RU",
                {
                    weekday:
                        "short"
                }
            );


        const count =
            tasks.filter(
                task => {


                    if (
                        !task.completedAt
                    ) {

                        return false;

                    }


                    return (
                        task.completedAt
                            .split("T")[0]
                        === iso
                    );

                }
            ).length;


        result.push({

            label:
                label,

            count:
                count

        });

    }


    return result;

}


/* =========================================================
   DRAW CHARTS
========================================================= */

function drawCharts() {

    drawProductivityChart();

    drawPriorityChart();

}


/* =========================================================
   PRODUCTIVITY CHART
========================================================= */

function drawProductivityChart() {


    const canvas =
        document.getElementById(
            "productivityChart"
        );


    if (!canvas) return;


    const ctx =
        canvas.getContext(
            "2d"
        );


    const rect =
        canvas.getBoundingClientRect();


    const dpr =
        window.devicePixelRatio ||
        1;


    canvas.width =
        rect.width *
        dpr;


    canvas.height =
        250 *
        dpr;


    ctx.scale(
        dpr,
        dpr
    );


    const width =
        rect.width;


    const height =
        250;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const data =
        getLastSevenDays();


    const max =
        Math.max(
            ...data.map(
                item =>
                    item.count
            ),
            1
        );


    const styles =
        getComputedStyle(
            document.body
        );


    const border =
        styles.getPropertyValue(
            "--border"
        );


    const primary =
        styles.getPropertyValue(
            "--primary"
        );


    const secondary =
        styles.getPropertyValue(
            "--secondary"
        );


    /* =====================================================
       GRID
    ===================================================== */

    ctx.strokeStyle =
        border;


    ctx.lineWidth =
        1;


    for (
        let i = 0;
        i <= 4;
        i++
    ) {


        const y =
            25 +
            i *
            (
                170 / 4
            );


        ctx.beginPath();


        ctx.moveTo(
            35,
            y
        );


        ctx.lineTo(
            width - 15,
            y
        );


        ctx.stroke();

    }


    /* =====================================================
       BARS
    ===================================================== */

    const barWidth =
        (
            width -
            65
        ) / 7;


    data.forEach(
        (
            item,
            index
        ) => {


            const barHeight =
                (
                    item.count /
                    max
                ) * 150;


            const x =
                45 +
                index *
                barWidth;


            const y =
                195 -
                barHeight;


            ctx.fillStyle =
                primary;


            ctx.fillRect(
                x,
                y,
                barWidth - 15,
                barHeight
            );


            ctx.fillStyle =
                secondary;


            ctx.font =
                "12px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(
                item.label,
                x +
                (
                    barWidth - 15
                ) / 2,
                220
            );


            ctx.fillText(
                item.count,
                x +
                (
                    barWidth - 15
                ) / 2,
                y - 7
            );

        }
    );

}


/* =========================================================
   PRIORITY CHART
========================================================= */

function drawPriorityChart() {


    const canvas =
        document.getElementById(
            "priorityChart"
        );


    if (!canvas) return;


    const ctx =
        canvas.getContext(
            "2d"
        );


    const rect =
        canvas.getBoundingClientRect();


    const dpr =
        window.devicePixelRatio ||
        1;


    canvas.width =
        rect.width *
        dpr;


    canvas.height =
        250 *
        dpr;


    ctx.scale(
        dpr,
        dpr
    );


    const width =
        rect.width;


    const height =
        250;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const high =
        tasks.filter(
            task =>
                task.priority ===
                "high"
        ).length;


    const medium =
        tasks.filter(
            task =>
                task.priority ===
                "medium"
        ).length;


    const low =
        tasks.filter(
            task =>
                task.priority ===
                "low"
        ).length;


    const data = [

        {
            name:
                "Высокий",

            value:
                high
        },

        {
            name:
                "Средний",

            value:
                medium
        },

        {
            name:
                "Низкий",

            value:
                low
        }

    ];


    const max =
        Math.max(
            ...data.map(
                item =>
                    item.value
            ),
            1
        );


    const styles =
        getComputedStyle(
            document.body
        );


    const primary =
        styles.getPropertyValue(
            "--primary"
        );


    const secondary =
        styles.getPropertyValue(
            "--secondary"
        );


    const barWidth =
        (
            width -
            80
        ) / 3;


    data.forEach(
        (
            item,
            index
        ) => {


            const barHeight =
                (
                    item.value /
                    max
                ) * 150;


            const x =
                45 +
                index *
                (
                    barWidth +
                    15
                );


            const y =
                195 -
                barHeight;


            ctx.fillStyle =
                primary;


            ctx.fillRect(
                x,
                y,
                barWidth,
                barHeight
            );


            ctx.fillStyle =
                secondary;


            ctx.font =
                "12px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(
                item.name,
                x +
                barWidth / 2,
                220
            );


            ctx.fillText(
                item.value,
                x +
                barWidth / 2,
                y - 7
            );

        }
    );

}


/* =========================================================
   XP
========================================================= */

function calculateXP() {


    let xp =
        0;


    tasks.forEach(
        task => {


            if (
                task.completed
            ) {


                if (
                    task.priority ===
                    "high"
                ) {

                    xp += 30;

                }
                else if (
                    task.priority ===
                    "medium"
                ) {

                    xp += 20;

                }
                else {

                    xp += 10;

                }

            }

        }
    );


    return xp;

}


/* =========================================================
   UPDATE XP
========================================================= */

function updateXP() {


    const xp =
        calculateXP();


    const level =
        Math.floor(
            xp / 100
        ) + 1;


    const currentXP =
        xp % 100;


    document.getElementById(
        "levelText"
    ).textContent =
        "⭐ Уровень " +
        level;


    document.getElementById(
        "xpText"
    ).textContent =
        currentXP +
        " / 100 XP";


    document.getElementById(
        "xpBar"
    ).style.width =
        currentXP + "%";

}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

function updateAchievements() {


    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;


    const xp =
        calculateXP();


    unlock(
        "achievement1",
        tasks.length >= 1
    );


    unlock(
        "achievement2",
        completed >= 5
    );


    unlock(
        "achievement3",
        completed >= 10
    );


    unlock(
        "achievement4",
        completed >= 25
    );


    unlock(
        "achievement5",
        tasks.length > 0 &&
        completed === tasks.length
    );


    unlock(
        "achievement6",
        tasks.some(
            task =>
                task.completed &&
                task.priority ===
                "high"
        )
    );


    unlock(
        "achievement7",
        xp >= 50
    );


    unlock(
        "achievement8",
        Math.floor(
            xp / 100
        ) + 1 >= 5
    );

}


/* =========================================================
   UNLOCK ACHIEVEMENT
========================================================= */

function unlock(
    id,
    condition
) {


    const element =
        document.getElementById(
            id
        );


    if (!element) return;


    if (condition) {

        element.classList.add(
            "unlocked"
        );

    }
    else {

        element.classList.remove(
            "unlocked"
        );

    }

}


/* =========================================================
   ENTER KEY
========================================================= */

document.getElementById(
    "taskInput"
).addEventListener(
    "keydown",
    function(event) {


        if (
            event.key ===
            "Enter"
        ) {

            addTask();

        }

    }
);


document.getElementById(
    "editTaskInput"
).addEventListener(
    "keydown",
    function(event) {


        if (
            event.key ===
            "Enter"
        ) {

            saveEditedTask();

        }

    }
);


/* =========================================================
   LOAD THEME
========================================================= */

if (
    localStorage.getItem(
        "theme"
    ) === "dark"
) {


    document.body
        .classList
        .add("dark");


    document.getElementById(
        "themeButton"
    ).textContent =
        "☀️";

}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    function() {

        drawCharts();

    }
);


/* =========================================================
   START APPLICATION
========================================================= */

renderTasks();
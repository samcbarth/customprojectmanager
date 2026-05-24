const workspaceDefinitions = [
  {
    id: "cc-llc",
    name: "CC LLC",
    description: "Core company operations, client delivery, and internal follow-through.",
    password: "CCLLC",
    accent: "Delivery Workspace",
    tasks: [
      {
        id: crypto.randomUUID(),
        group: "Operations",
        name: "Weekly leadership review",
        status: "Working On It",
        owner: "Sam",
        priority: "High",
        dueDate: "2026-05-29",
        notes: "Prepare active jobs and outstanding blockers."
      },
      {
        id: crypto.randomUUID(),
        group: "Clients",
        name: "Finalize onboarding checklist",
        status: "Review",
        owner: "Admin",
        priority: "Medium",
        dueDate: "2026-05-27",
        notes: "Keep it lightweight and easy to repeat."
      },
      {
        id: crypto.randomUUID(),
        group: "Finance",
        name: "Approve invoice batch",
        status: "Done",
        owner: "Accounting",
        priority: "Low",
        dueDate: "2026-05-23",
        notes: "Completed ahead of the next cycle."
      }
    ]
  },
  {
    id: "laire",
    name: "LAIRE",
    description: "Creative planning, campaigns, and brand execution in one simplified board.",
    password: "LAIRE",
    accent: "Creative Workspace",
    tasks: [
      {
        id: crypto.randomUUID(),
        group: "Brand",
        name: "Homepage concept refresh",
        status: "Working On It",
        owner: "Design",
        priority: "High",
        dueDate: "2026-05-31",
        notes: "Aim for a more premium first impression."
      },
      {
        id: crypto.randomUUID(),
        group: "Content",
        name: "Approve launch copy",
        status: "Stuck",
        owner: "Marketing",
        priority: "High",
        dueDate: "2026-05-28",
        notes: "Waiting on final offer details."
      },
      {
        id: crypto.randomUUID(),
        group: "Social",
        name: "June posting schedule",
        status: "Review",
        owner: "Olivia",
        priority: "Medium",
        dueDate: "2026-05-30",
        notes: "Need final asset list."
      }
    ]
  },
  {
    id: "ollie",
    name: "OLLIE",
    description: "A lightweight workspace for day-to-day tasks, launches, and owner visibility.",
    password: "OLLIE",
    accent: "Growth Workspace",
    tasks: [
      {
        id: crypto.randomUUID(),
        group: "Launch",
        name: "Confirm rollout timeline",
        status: "Working On It",
        owner: "Project Lead",
        priority: "High",
        dueDate: "2026-06-02",
        notes: "Keep the rollout path simple."
      },
      {
        id: crypto.randomUUID(),
        group: "Support",
        name: "Triage feedback queue",
        status: "Review",
        owner: "Support",
        priority: "Medium",
        dueDate: "2026-05-26",
        notes: "Tag repeats and quick wins."
      },
      {
        id: crypto.randomUUID(),
        group: "QA",
        name: "Smoke test final update",
        status: "Done",
        owner: "QA",
        priority: "Low",
        dueDate: "2026-05-24",
        notes: "No blockers found in final pass."
      }
    ]
  }
];

const state = {
  activeWorkspaceId: null,
  pendingWorkspaceId: null,
  searchTerm: ""
};

const workspaceSelector = document.getElementById("workspaceSelector");
const managerPanel = document.getElementById("managerPanel");
const workspaceTitle = document.getElementById("workspaceTitle");
const summaryGrid = document.getElementById("summaryGrid");
const taskTableBody = document.getElementById("taskTableBody");
const taskSearch = document.getElementById("taskSearch");
const passwordDialog = document.getElementById("passwordDialog");
const passwordForm = document.getElementById("passwordForm");
const workspacePassword = document.getElementById("workspacePassword");
const passwordError = document.getElementById("passwordError");
const dialogWorkspaceTitle = document.getElementById("dialogWorkspaceTitle");
const taskDialog = document.getElementById("taskDialog");
const taskForm = document.getElementById("taskForm");
const switchWorkspaceButton = document.getElementById("switchWorkspaceButton");
const addTaskButton = document.getElementById("addTaskButton");
const cancelDialogButton = document.getElementById("cancelDialogButton");
const cancelTaskDialogButton = document.getElementById("cancelTaskDialogButton");

function getWorkspaceStorageKey(workspaceId) {
  return `custom-project-manager:${workspaceId}`;
}

function getWorkspaceById(workspaceId) {
  return workspaceDefinitions.find((workspace) => workspace.id === workspaceId);
}

function loadTasks(workspaceId) {
  const workspace = getWorkspaceById(workspaceId);
  const storedTasks = localStorage.getItem(getWorkspaceStorageKey(workspaceId));

  if (!storedTasks) {
    return structuredClone(workspace.tasks);
  }

  try {
    return JSON.parse(storedTasks);
  } catch {
    return structuredClone(workspace.tasks);
  }
}

function saveTasks(workspaceId, tasks) {
  localStorage.setItem(getWorkspaceStorageKey(workspaceId), JSON.stringify(tasks));
}

function normalizeLabel(value) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

function renderWorkspaceCards() {
  workspaceSelector.innerHTML = "";

  workspaceDefinitions.forEach((workspace) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "workspace-card";
    button.innerHTML = `
      <h3>${workspace.name}</h3>
      <p>${workspace.description}</p>
      <span class="workspace-tag">${workspace.accent}</span>
    `;
    button.addEventListener("click", () => openPasswordDialog(workspace.id));
    workspaceSelector.appendChild(button);
  });
}

function openPasswordDialog(workspaceId) {
  state.pendingWorkspaceId = workspaceId;
  const workspace = getWorkspaceById(workspaceId);
  dialogWorkspaceTitle.textContent = `${workspace.name} Password`;
  workspacePassword.value = "";
  passwordError.textContent = "";
  passwordDialog.showModal();
  setTimeout(() => workspacePassword.focus(), 20);
}

function enterWorkspace(workspaceId) {
  state.activeWorkspaceId = workspaceId;
  managerPanel.classList.remove("hidden");
  renderActiveWorkspace();
  managerPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getActiveTasks() {
  return loadTasks(state.activeWorkspaceId);
}

function setActiveTasks(tasks) {
  saveTasks(state.activeWorkspaceId, tasks);
}

function renderActiveWorkspace() {
  const workspace = getWorkspaceById(state.activeWorkspaceId);
  const tasks = getActiveTasks();
  workspaceTitle.textContent = workspace.name;
  renderSummary(tasks);
  renderTaskRows(tasks);
}

function renderSummary(tasks) {
  const doneCount = tasks.filter((task) => task.status === "Done").length;
  const workingCount = tasks.filter((task) => task.status === "Working On It").length;
  const stuckCount = tasks.filter((task) => task.status === "Stuck").length;
  const upcomingCount = tasks.filter((task) => isUpcoming(task.dueDate)).length;

  const metrics = [
    { label: "Board Items", value: tasks.length },
    { label: "Working On It", value: workingCount },
    { label: "Stuck", value: stuckCount },
    { label: "Due Soon", value: upcomingCount }
  ];

  summaryGrid.innerHTML = metrics
    .map(
      (metric) => `
        <article class="summary-card">
          <p>${metric.label}</p>
          <h3>${metric.value}</h3>
        </article>
      `
    )
    .join("");
}

function isUpcoming(dateValue) {
  const now = new Date();
  const dueDate = new Date(dateValue);
  const diff = dueDate.getTime() - now.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 7;
}

function renderTaskRows(tasks) {
  const filteredTasks = tasks.filter((task) => {
    const haystack = `${task.group} ${task.name} ${task.owner} ${task.notes}`.toLowerCase();
    return haystack.includes(state.searchTerm.toLowerCase());
  });

  taskTableBody.innerHTML = filteredTasks
    .map(
      (task) => `
        <tr>
          <td><span class="group-pill">${task.group}</span></td>
          <td>${task.name}</td>
          <td>${renderStatusSelect(task)}</td>
          <td>${renderInlineInput(task, "owner")}</td>
          <td>${renderPrioritySelect(task)}</td>
          <td>${renderDateInput(task)}</td>
          <td>${renderInlineTextarea(task, "notes")}</td>
          <td><button class="delete-button" type="button" data-action="delete" data-task-id="${task.id}">Remove</button></td>
        </tr>
      `
    )
    .join("");
}

function renderStatusSelect(task) {
  const options = ["Working On It", "Stuck", "Review", "Done"];
  return `
    <label class="sr-only" for="status-${task.id}">Status</label>
    <select id="status-${task.id}" data-action="status" data-task-id="${task.id}" class="status-pill status-${normalizeLabel(task.status)}">
      ${options
        .map((option) => `<option value="${option}" ${option === task.status ? "selected" : ""}>${option}</option>`)
        .join("")}
    </select>
  `;
}

function renderPrioritySelect(task) {
  const options = ["High", "Medium", "Low"];
  return `
    <label class="sr-only" for="priority-${task.id}">Priority</label>
    <select id="priority-${task.id}" data-action="priority" data-task-id="${task.id}" class="priority-pill priority-${normalizeLabel(task.priority)}">
      ${options
        .map((option) => `<option value="${option}" ${option === task.priority ? "selected" : ""}>${option}</option>`)
        .join("")}
    </select>
  `;
}

function renderDateInput(task) {
  return `
    <label class="sr-only" for="due-${task.id}">Due Date</label>
    <input id="due-${task.id}" data-action="dueDate" data-task-id="${task.id}" type="date" value="${task.dueDate}">
  `;
}

function renderInlineInput(task, field) {
  return `
    <label class="sr-only" for="${field}-${task.id}">${field}</label>
    <input id="${field}-${task.id}" data-action="${field}" data-task-id="${task.id}" type="text" value="${task[field]}">
  `;
}

function renderInlineTextarea(task, field) {
  return `
    <label class="sr-only" for="${field}-${task.id}">${field}</label>
    <textarea id="${field}-${task.id}" data-action="${field}" rows="2">${task[field]}</textarea>
  `;
}

function updateTask(taskId, field, value) {
  const tasks = getActiveTasks().map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    return { ...task, [field]: value };
  });

  setActiveTasks(tasks);
  renderActiveWorkspace();
}

function persistTaskField(taskId, field, value) {
  const tasks = getActiveTasks().map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    return { ...task, [field]: value };
  });

  setActiveTasks(tasks);
}

function deleteTask(taskId) {
  const tasks = getActiveTasks().filter((task) => task.id !== taskId);
  setActiveTasks(tasks);
  renderActiveWorkspace();
}

function addTask(formData) {
  const tasks = getActiveTasks();
  tasks.unshift({
    id: crypto.randomUUID(),
    group: formData.get("taskGroup").trim(),
    name: formData.get("taskName").trim(),
    status: formData.get("taskStatus"),
    owner: formData.get("taskOwner").trim(),
    priority: formData.get("taskPriority"),
    dueDate: formData.get("taskDueDate"),
    notes: formData.get("taskNotes").trim()
  });
  setActiveTasks(tasks);
  renderActiveWorkspace();
}

workspaceSelector.addEventListener("click", (event) => {
  const button = event.target.closest(".workspace-card");
  if (!button) {
    return;
  }

  button.blur();
});

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const workspace = getWorkspaceById(state.pendingWorkspaceId);

  if (workspacePassword.value !== workspace.password) {
    passwordError.textContent = "Incorrect password. Try again.";
    return;
  }

  passwordDialog.close();
  enterWorkspace(workspace.id);
});

taskTableBody.addEventListener("change", (event) => {
  const target = event.target;
  const taskId = target.dataset.taskId;
  const action = target.dataset.action;

  if (!taskId || !action) {
    return;
  }

  updateTask(taskId, action, target.value);
});

taskTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action='delete']");

  if (!button) {
    return;
  }

  deleteTask(button.dataset.taskId);
});

taskTableBody.addEventListener("input", (event) => {
  const target = event.target;
  if (target.tagName !== "TEXTAREA" && (target.tagName !== "INPUT" || target.type !== "text")) {
    return;
  }

  persistTaskField(target.dataset.taskId, target.dataset.action, target.value);
});

taskSearch.addEventListener("input", (event) => {
  state.searchTerm = event.target.value;
  renderTaskRows(getActiveTasks());
});

switchWorkspaceButton.addEventListener("click", () => {
  state.activeWorkspaceId = null;
  state.searchTerm = "";
  taskSearch.value = "";
  managerPanel.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

addTaskButton.addEventListener("click", () => {
  taskForm.reset();
  taskDialog.showModal();
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask(new FormData(taskForm));
  taskDialog.close();
});

cancelDialogButton.addEventListener("click", () => passwordDialog.close());
cancelTaskDialogButton.addEventListener("click", () => taskDialog.close());

renderWorkspaceCards();

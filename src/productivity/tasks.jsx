import React from 'react';

// import './players.css';

export function Tasks({ tasks, groups }) {
  function dueDateClassName(task) {
    let due = new Date(task.due);
    if (due < Date.now()) {
      return "table-danger";
    }
    else if (due < Date.now() + 24 * 60 * 60 * 1000) {
      return "table-warning";
    }
    else {
      return "";
    }
  }

  function createList() {
    tasks.sort((a, b) => new Date(a.due) - new Date(b.due));
    const taskArray = [];
    let key = 1;
    tasks.forEach((task) => {
      taskArray.push(
        <tr key={key} className={dueDateClassName(task)}>
          <td>{task.name}</td>
          <td>{(groups.find((classItem) => classItem.id == task.group) || { name: "Unknown" }).name}</td>
          <td>{new Date(task.due).toLocaleString().toString()}</td>
        </tr>
      );
      key++;
    });
    return taskArray;
  }

  return (
    <div>
      <h2>Due Soon</h2>
      <table className="table table-dark table-bordered table-hover">
        <thead>
          <tr>
            <th>Assignment Name</th>
            <th>Class</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody id="normalAssignmentList">{createList()}</tbody>
      </table>
    </div>
  );
}
import React from 'react';

// import './players.css';

export function Projects({ projects, groups }) {
  function dueDateClassName(project) {
    let due = new Date(project.due);
    if (due < Date.now()) {
      return "table-danger";
    }
    else if (due < Date.now() + 24 * 60 * 60 * 1000 * 7) {
      return "table-warning";
    }
    else {
      return "";
    }
  }

  function createList() {
    projects.sort((a, b) => new Date(a.due) - new Date(b.due));
    const projectArray = [];
    let key = 1;
    projects.forEach((project) => {
      projectArray.push(
        <tr key={key} className={dueDateClassName(project)}>
          <td>{project.name}</td>
          <td>{(groups.find((classItem) => classItem.id == project.group) || { name: "Unknown" }).name}</td>
          <td>{project.hours.toString() + " Hours"}</td>
          <td>{new Date(project.due).toLocaleString().toString()}</td>
        </tr>
      );
      key++;
    });
    return projectArray;
  }

  return (
    <div>
      <h2>Large Projects</h2>
      <table className="table table-dark table-bordered table-hover">
        <thead>
          <tr>
            <th>Assignment Name</th>
            <th>Class</th>
            <th>Time Left</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody id="largeAssignmentList">{createList()}</tbody>
      </table>
    </div>
  );
}
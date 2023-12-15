import React from 'react';

export function Groups({ groups }) {

  function createList() {
    const groupArray = [];
    let key = 1;
    groups.forEach((group) => {
      groupArray.push(
        <tr key={key}>
          <td>{group.name}</td>
        </tr>
      );
      key++;
    });
    return groupArray;
  }

  return (
    <div>
      <h2>Classes</h2>
      <table className="table table-dark table-bordered table-hover">
        <thead>
          <tr>
            <th>Class Name</th>
          </tr>
        </thead>
        <tbody id="classes">{createList()}</tbody>
      </table>
    </div>
  );
}
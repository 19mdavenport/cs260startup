import React from 'react';

import { Tasks } from './tasks';
import { Projects } from './projects';
import { Groups } from './groups';

export function Productivity() {
  const [tasks, setTasks] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [groups, setGroups] = React.useState([]);

  async function getData() {
    const assignmentsResponse = await fetch(`/api/task`);
    setTasks(await assignmentsResponse.json());

    const projectsResponse = await fetch(`/api/project`);
    setProjects(await projectsResponse.json());
    
    const classesResponse = await fetch(`/api/group`);
    setGroups(await classesResponse.json());
  }

  if(tasks.length === 0) {
    getData();
  }
  return (
    <main className='bg-secondary'>
      <Tasks tasks={tasks} groups={groups} />
      <Projects projects={projects} groups={groups} />
      <Groups groups={groups}/>
    </main>
  );
}

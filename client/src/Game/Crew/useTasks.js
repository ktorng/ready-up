import { useMemo } from 'react';

const tasksTemplate = () => ({
    unordered: [],
    ordered: [],
    first: null,
    last: null,
});

// Sorts through the tasks dict into assignments for each user or unassigned
export const useTasks = (tasks, userIds) => {
    return useMemo(() => {
        const dict = { unassigned: tasksTemplate() };

        userIds.forEach((id) => {
            dict[id] = tasksTemplate();
        });

        tasks.ordered.forEach((task) => {
            dict[task.userId || 'unassigned'].ordered.push(task);
        });
        tasks.unordered.forEach((task) => {
            dict[task.userId || 'unassigned'].unordered.push(task);
        });
        if (tasks.first) {
            dict[tasks.first.userId || 'unassigned'].first = tasks.first;
        }
        if (tasks.last) {
            dict[tasks.last.userId || 'unassigned'].last = tasks.last;
        }

        return dict;
    }, [tasks, userIds]);
};

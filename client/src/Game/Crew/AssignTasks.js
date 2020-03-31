import React from 'react';
import T from 'prop-types';

import useCrewStyles from './useCrewStyles';
import Card from './Card';

const AssignTasks = ({ tasks }) => {
    const crewClasses = useCrewStyles();

    return (
        <div>
            Assign tasks
            <div className={crewClasses.cardContainer}>
                {[
                    ...(tasks.first ? (
                        <Card card={tasks.first} isTask taskReq={{ isFirst: true }} />
                    ) : (
                        []
                    )),
                    ...tasks.ordered.map((task, i) => (
                        <Card
                            key={`task-ordered-${i}`}
                            card={task}
                            isTask
                            taskReq={{ order: i + 1 }}
                        />
                    )),
                    ...(tasks.last ? (
                        <Card card={tasks.last} isTask taskReq={{ isLast: true }} />
                    ) : (
                        []
                    )),
                    ...tasks.unordered.map((task, i) => (
                        <Card key={`task-unordered=${i}`} card={task} isTask />
                    ))
                ]}
            </div>
        </div>
    );
};

AssignTasks.propTypes = {
    tasks: T.shape({
        ordered: T.array,
        unordered: T.array,
        first: T.object,
        last: T.object
    })
};

export default AssignTasks;

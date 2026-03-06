import React from 'react';
import { Calendar, Briefcase } from 'lucide-react';
import type { Task } from '../../@types/interface/TasksInterface';

interface TasksTabProps {
    tasks: Task[];
}

const TasksTab: React.FC<TasksTabProps> = ({ tasks }) => {
    return (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Assigned Tasks</h3>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                    {tasks.length} Total
                </span>
            </div>
            {tasks.map((task) => (
                <div key={task._id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-gray-900">{task.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                            <div className="flex items-center gap-4 mt-3">
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                                </span>
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${task.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    {task.priority} Priority
                                </span>
                            </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${task.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-indigo-50 text-indigo-700'
                            }`}>
                            {task.status}
                        </span>
                    </div>
                </div>
            ))}
            {tasks.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">No tasks found for your account.</p>
                </div>
            )}
        </div>
    );
};

export default TasksTab;

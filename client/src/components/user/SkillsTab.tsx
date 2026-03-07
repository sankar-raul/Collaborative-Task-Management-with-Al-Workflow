import React from 'react';

interface SkillsTabProps {
    skills: string[];
}

const SkillsTab: React.FC<SkillsTabProps> = ({ skills }) => {
    return (
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 pt-0 animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Expertise & Skills</h3>
            <div className="flex flex-wrap gap-3">
                {skills?.map((skill, i) => (
                    <span
                        key={i}
                        className="px-4 py-2 text-sm font-semibold rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-default"
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default SkillsTab;

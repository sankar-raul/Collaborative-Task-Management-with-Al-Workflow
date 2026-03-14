import React from 'react';

interface SkillsTabProps {
    skills: string[];
}

const SkillsTab: React.FC<SkillsTabProps> = ({ skills }) => {
    return (
        <div className="bg-card border border-border shadow-sm rounded-3xl p-8 animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-foreground mb-8 tracking-tight">Expertise & Skills</h3>
            <div className="flex flex-wrap gap-3">
                {skills?.map((skill, i) => (
                    <span
                        key={i}
                        className="px-5 py-2.5 text-sm font-bold rounded-2xl bg-secondary text-foreground border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-default shadow-xs"
                    >
                        {skill}
                    </span>
                ))}
                {(!skills || skills.length === 0) && (
                    <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
                )}
            </div>
        </div>
    );
};

export default SkillsTab;

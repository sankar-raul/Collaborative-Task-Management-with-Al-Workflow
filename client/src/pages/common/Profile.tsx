import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProfileHeader from "../../components/profile/ProfileHeader";
import OverviewTab from "../../components/profile/tabs/OverviewTab";
import SkillsTab from "../../components/profile/tabs/SkillsTab";
import TasksTab from "../../components/profile/tabs/TasksTab";
import ProjectsTab from "../../components/profile/tabs/ProjectsTab";
import ActivityTab from "../../components/profile/tabs/ActivityTab";
import type { TabId } from "../../components/profile/profileData";

const TAB_CONTENT: Record<TabId, React.ReactNode> = {
  overview: <OverviewTab />,
  skills: <SkillsTab />,
  tasks: <TasksTab />,
  projects: <ProjectsTab />,
  activity: <ActivityTab />,
};

export const Profile = () => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      {/* Sticky profile header + tabs */}
      <ProfileHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content with fade transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
        >
          {TAB_CONTENT[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

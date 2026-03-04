import React from "react";
import type { TaskAvatar } from "./kanbanData";

interface AvatarStackProps {
  avatars: TaskAvatar[];
  extra?: number;
}

const AvatarStack: React.FC<AvatarStackProps> = ({ avatars, extra = 0 }) => (
  <div className="flex items-center">
    <div className="flex -space-x-2">
      {avatars.map((av, i) => (
        <div
          key={i}
          className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white ${av.bg}`}
        >
          {av.initials}
        </div>
      ))}
    </div>
    {extra > 0 && (
      <span className="ml-1.5 text-xs font-semibold text-gray-500">
        +{extra}
      </span>
    )}
  </div>
);

export default AvatarStack;

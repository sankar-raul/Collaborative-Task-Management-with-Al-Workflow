# Socket.IO Real-Time Integration

This document describes the Socket.IO implementation for real-time project updates.

## Overview

The application uses Socket.IO to provide real-time updates for:
- Task creation, updates, assignments, status changes, and deletions
- Project member additions and removals
- Project updates and deletions
- Comments on tasks

## Architecture

### 1. Socket Utility (`src/utils/socket.ts`)
Manages the Socket.IO client connection, including:
- Connection/disconnection
- Joining/leaving project rooms
- Authentication via JWT token

### 2. Socket Context (`src/context/socket/`)
Provides application-wide socket state management:
- Automatically connects when user authenticates
- Disconnects on logout
- Shares socket instance across components

### 3. Toast Context (`src/context/toast/`)
Provides user-friendly notifications for real-time events:
- Success notifications (green)
- Info notifications (blue)
- Error notifications (red)
- Auto-dismisses after 4 seconds

### 4. Project Socket Hook (`src/hooks/useProjectSocket.ts`)
Reusable hook for listening to project-specific events:
- Automatically joins project room
- Handles all project-related socket events
- Integrates with toast notifications
- Cleans up on unmount

### 5. Project Data Hook (`src/hooks/useProjectData.ts`)
Enhanced with real-time capabilities:
- Fetches initial project and task data
- Updates state in real-time via socket events
- Provides CRUD operations for projects and tasks

## Event Types

### Task Events
```typescript
// Task created in project
socket.on("taskCreated", (task: Task) => { ... })

// Task assigned to user
socket.on("taskAssigned", (task: Task) => { ... })

// Task status changed
socket.on("taskStatusUpdated", (task: Task) => { ... })

// Task details updated
socket.on("taskUpdated", (task: Task) => { ... })

// Task deleted
socket.on("taskDeleted", ({ taskId }: { taskId: string }) => { ... })
```

### Project Member Events
```typescript
// Member added to project
socket.on("memberAdded", (member: ProjectMember) => { ... })

// Member removed from project
socket.on("memberRemoved", ({ memberId }: { memberId: string }) => { ... })
```

### Project Events
```typescript
// Project details updated
socket.on("projectUpdated", ({ projectId }: { projectId: string }) => { ... })

// Project deleted
socket.on("projectDeleted", ({ projectId }: { projectId: string }) => { ... })

// Comment created on task
socket.on("commentCreated", ({ commentId }: { commentId: string }) => { ... })
```

## Usage

### Basic Setup (Already Configured)

The application is already set up with Socket.IO. The providers are wrapped in `App.tsx`:

```tsx
<AuthProvider>
  <ToastProvider>
    <SocketProvider>
      <UsersProvider>
        <RouterProvider router={routes} />
      </UsersProvider>
    </SocketProvider>
  </ToastProvider>
</AuthProvider>
```

### Using in Components

#### Option 1: Use existing `useProjectData` hook (Recommended)
The hook automatically includes socket listeners:

```tsx
const { project, tasks, loading, ... } = useProjectData({ projectId: id });
// Socket events are automatically handled
```

#### Option 2: Use `useProjectSocket` for custom behavior

```tsx
import { useProjectSocket } from "@/hooks/useProjectSocket";

const MyComponent = () => {
  const { id } = useParams();
  
  useProjectSocket({
    projectId: id,
    onTaskCreated: (task) => {
      console.log("New task:", task);
      // Custom handling
    },
    onTaskUpdated: (task) => {
      console.log("Task updated:", task);
      // Custom handling
    },
    enableToasts: true, // Show toast notifications
  });
};
```

#### Option 3: Access socket directly

```tsx
import { useSocket } from "@/context/socket";

const MyComponent = () => {
  const { socket, isConnected } = useSocket();
  
  useEffect(() => {
    if (!socket || !isConnected) return;
    
    socket.on("customEvent", (data) => {
      console.log("Custom event:", data);
    });
    
    return () => {
      socket.off("customEvent");
    };
  }, [socket, isConnected]);
};
```

### Show Toast Notifications

```tsx
import { useToast } from "@/context/toast";

const MyComponent = () => {
  const { showToast } = useToast();
  
  const handleAction = () => {
    showToast("Action completed!", "success");
    // or
    showToast("Something went wrong", "error");
    // or
    showToast("FYI: Update available", "info");
  };
};
```

## Installation

Install the required package:

```bash
npm install socket.io-client
# or
yarn add socket.io-client
```

## Configuration

Update `VITE_BACKEND_END_POINT` in your `.env` file:

```
VITE_BACKEND_END_POINT=http://localhost:8080/api/
```

The socket will automatically connect to `http://localhost:8080` (without `/api/`).

## Server Requirements

The backend server must:
1. Use Socket.IO server
2. Implement the ProjectNotification class as provided
3. Support JWT authentication via socket.auth
4. Implement project room join/leave events
5. Emit events according to the event types listed above

## Troubleshooting

### Socket not connecting
- Check browser console for connection errors
- Verify backend server is running
- Ensure CORS is configured on backend
- Check if JWT token is valid

### Not receiving events
- Verify you're in the correct project room
- Check backend is emitting events to the right room
- Use browser dev tools Network tab to inspect WebSocket frames

### Toast notifications not showing
- Ensure ToastProvider is in the component tree
- Check console for errors
- Verify useToast hook is being called inside ToastProvider

## Best Practices

1. **Always clean up listeners**: Use the cleanup function in useEffect
2. **Join project rooms**: Emit "joinProject" when entering a project view
3. **Leave project rooms**: Emit "leaveProject" when exiting a project view
4. **Handle disconnections**: The SocketContext handles reconnection automatically
5. **Use typed events**: Define TypeScript interfaces for event payloads
6. **Test with multiple users**: Open multiple browser tabs to test real-time sync

## Example: Real-Time Task Board

```tsx
import { useProjectData } from "@/hooks/useProjectData";
import { useEffect } from "react";

const TaskBoard = () => {
  const { id } = useParams();
  const { project, tasks, loading } = useProjectData({ projectId: id });
  
  // Socket events are automatically handled by useProjectData
  // Tasks will update in real-time as events are received
  
  return (
    <div>
      <h1>{project?.name}</h1>
      {tasks.map(task => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
};
```

The task board will automatically update when:
- New tasks are created by other users
- Tasks are assigned or updated
- Task status changes
- Tasks are deleted

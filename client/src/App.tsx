import './App.css'
import { RouterProvider } from 'react-router'
import routes from './route'
import { AuthProvider } from './context/auth'
import { UsersProvider } from './context/users'
import { SocketProvider } from './context/socket'
import { ToastProvider } from './context/toast'
import { ThemeProvider } from './context/ThemeProvider'

function App() {
  return (
    <>
      <AuthProvider>
        <ToastProvider>
          <SocketProvider>
            <UsersProvider>
              <ThemeProvider>
                <RouterProvider router={routes} />
              </ThemeProvider>
            </UsersProvider>
          </SocketProvider>
        </ToastProvider>
      </AuthProvider>
    </>
  )
}

export default App

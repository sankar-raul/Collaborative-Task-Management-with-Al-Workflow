import './App.css'
import { RouterProvider } from 'react-router'
import routes from './route'
import { AuthProvider } from './context/auth'
import { UsersProvider } from './context/users'

function App() {
  return (
    <>
      <AuthProvider>
        <UsersProvider>
          <RouterProvider router={routes} />
        </UsersProvider>
      </AuthProvider>
    </>
  )
}

export default App

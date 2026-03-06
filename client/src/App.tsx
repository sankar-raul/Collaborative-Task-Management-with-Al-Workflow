import './App.css'
import { RouterProvider } from 'react-router'
import routes from './route'
import { AuthProvider } from './context/auth'
function App() {


  return (
    <>
      <AuthProvider>
        <RouterProvider router={routes} />
      </AuthProvider>
    </>
  )
}

export default App

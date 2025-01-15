import { Route, Routes } from 'react-router-dom'
import './App.css'
import DefaultLayout from './layout/DefaultLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import routes from './routes'
import { Suspense } from 'react'
import Loader from './common/Loader'
import Login from './pages/Auth/Login'
import NoAuth from './services/NoAuth'
import RequireAuth from './services/RequireAuth'

function App() {
  return (
    <Routes>
      <Route element={<NoAuth />}>
        <Route path='/login' element={<Login />} />
      </Route>
      <Route element={<DefaultLayout />}>
        <Route element={<RequireAuth />}>
          <Route path='/' element={<Dashboard />} />
          {routes.map((routes, index) => {
            const { path, component: Component } = routes;
            return (
              <Route
                key={index}
                path={path}
                element={
                  <Suspense fallback={<Loader />}>
                    <Component />
                  </Suspense>
                }
              />
            );
          })}
        </Route>
      </Route>
    </Routes>
  )
}

export default App
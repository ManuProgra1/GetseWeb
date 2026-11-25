import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import SiteLayout from './layouts/site-layout'
import RequireStaff from './routes/require-staff'
import RequireAdmin from './routes/require-admin'
import Home from './pages/home/home'
import Nosotros from './pages/nosotros/nosotros'
import Historia from './pages/historia/historia'
import Eventos from './pages/eventos/eventos'
import Ministerios from './pages/ministerios/ministerios'
import MinistryDetail from './pages/ministerios/ministry-detail'
import Contacto from './pages/contacto/contacto'
import NotFound from './pages/not-found'

const AdminLayout = lazy(() => import('./layouts/admin-layout'))
const AdminLogin = lazy(() => import('./pages/admin/login'))
const AdminDashboard = lazy(() => import('./pages/admin/dashboard'))
const AdminEvents = lazy(() => import('./pages/admin/events-admin'))
const AdminMinistries = lazy(() => import('./pages/admin/ministries-admin'))
const AdminHistory = lazy(() => import('./pages/admin/history-admin'))
const AdminGallery = lazy(() => import('./pages/admin/gallery-admin'))
const AdminAdvertising = lazy(() => import('./pages/admin/advertising-admin'))
const AdminMessages = lazy(() => import('./pages/admin/messages-admin'))
const AdminRecords = lazy(() => import('./pages/admin/records-admin'))
const AdminSettings = lazy(() => import('./pages/admin/settings-admin'))
const AdminUsers = lazy(() => import('./pages/admin/users-admin'))

function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-bone/15 border-t-gold" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="historia" element={<Historia />} />
          <Route path="eventos" element={<Eventos />} />
          <Route path="ministerios" element={<Ministerios />} />
          <Route path="ministerios/:slug" element={<MinistryDetail />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireStaff>
              <AdminLayout />
            </RequireStaff>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="publicidad" element={<AdminAdvertising />} />
          <Route
            path="eventos"
            element={
              <RequireAdmin>
                <AdminEvents />
              </RequireAdmin>
            }
          />
          <Route
            path="ministerios"
            element={
              <RequireAdmin>
                <AdminMinistries />
              </RequireAdmin>
            }
          />
          <Route
            path="historia"
            element={
              <RequireAdmin>
                <AdminHistory />
              </RequireAdmin>
            }
          />
          <Route
            path="galeria"
            element={
              <RequireAdmin>
                <AdminGallery />
              </RequireAdmin>
            }
          />
          <Route
            path="mensajes"
            element={
              <RequireAdmin>
                <AdminMessages />
              </RequireAdmin>
            }
          />
          <Route
            path="registros"
            element={
              <RequireAdmin>
                <AdminRecords />
              </RequireAdmin>
            }
          />
          <Route
            path="configuracion"
            element={
              <RequireAdmin>
                <AdminSettings />
              </RequireAdmin>
            }
          />
          <Route
            path="usuarios"
            element={
              <RequireAdmin>
                <AdminUsers />
              </RequireAdmin>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  )
}

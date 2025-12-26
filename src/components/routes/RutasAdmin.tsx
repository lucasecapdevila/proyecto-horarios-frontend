import { Route, Routes } from "react-router-dom"
import { Admin, Dashboard } from "../pages"

const RutasAdmin: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/manage" element={<Admin />} />
    </Routes>
  )
}

export default RutasAdmin
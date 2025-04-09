import Dashboard from '@/page/admin/Dashboard';
import ManagerProject from '@/page/admin/ManagerProject';
import ManagerUser from '@/page/admin/ManagerUser';
import Notification from '@/page/admin/Notification';
import Priceing from '@/page/admin/Priceing';
import Setting from '@/page/admin/Setting';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const AdminRoutes = () => {
    return (
        <Routes>
          <Route path="dashboard/*" element={<Dashboard />} />
          <Route path="projects/*" element={<ManagerProject />} />
          <Route path="users/*" element={<ManagerUser />} />
          <Route path="settings/*" element={<Setting />} />
          <Route path="notification/*" element={<Notification />} />
          <Route path="pricing/*" element={<Priceing />} />
        </Routes>
      );
};

export default AdminRoutes;
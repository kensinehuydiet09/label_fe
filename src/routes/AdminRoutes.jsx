import Dashboard from '@/page/admin/Dashboard';
import ManageProject from '@/page/admin/ManagerProject';
import Notification from '@/page/admin/Notification';
import Priceing from '@/page/admin/Priceing';
import Setting from '@/page/admin/Setting';
import React from 'react';

const AdminRoutes = () => {
    return (
        <Routes>
          <Route path="dashboard/*" element={<Dashboard />} />
          <Route path="projects/*" element={<ManageProject />} />
          <Route path="users/*" element={<ManageUser />} />
          <Route path="settings/*" element={<Setting />} />
          <Route path="notification/*" element={<Notification />} />
          <Route path="pricing/*" element={<Priceing />} />
        </Routes>
      );
};

export default AdminRoutes;
import {useEffect, useState} from "react";
import api from "../api";


const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);

  const fetchPermission = async () => {
    try {
      const response = await api.get('/api/v1/account/permissions/');
      const permissions = response.data.permissions;
      // console.debug('userSlice fetchPermissions', response.data);
      if (response.data?.superuser) {
        permissions.push('superuser');
      }
      setPermissions(permissions)

    } catch (error) {
      console.error('usePermissions fetchPermission error', error)
    }
  }
  useEffect(() => {
    fetchPermission();
  }, []);

  const hasPermission = (perm) => {
    // console.debug('usePermissions hasPermission', permissions);
    return permissions && permissions.includes(perm);
  };

  return hasPermission;
};

export default usePermissions;
import {useEffect, useState} from "react";
import api from "../api";
import {useSelector} from "react-redux";


const usePermissions = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const [permissions, setPermissions] = useState([]);

  const fetchPermission = async () => {
    if (!isAuthenticated) return;

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
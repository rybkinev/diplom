import { useState, useEffect } from 'react';

const useResponsive = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const shouldHideButtonEdit = windowWidth < 1150;

  // Public
  const shouldHidePublicSteeringAxle = windowWidth < 900;
  const shouldHidePublicDriveAxle = windowWidth < 700;
  const shouldHidePublicTransmission = windowWidth < 400;

  // Vehicle
  const shouldHideSteeringAxle = windowWidth < 1024;
  const shouldHideDriveAxle = windowWidth < 800;
  const shouldHideTransmission = windowWidth < 620;
  const shouldHideEngine = windowWidth < 460;

  // Maintenance
  const shouldHideOrganization = windowWidth < 1024;
  const shouldHideDateOrder = windowWidth < 800;
  const shouldHideWorkOrder = windowWidth < 560;
  const shouldHideOperatingTime = windowWidth < 460;

  // Complaint
  const shouldHideDateRecovery = windowWidth < 1100;
  const shouldHideMethodRecovery = windowWidth < 950;
  const shouldHideUsedParts = windowWidth < 650;
  const shouldHideComplaintOperatingTime = windowWidth < 530;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    windowWidth,
    shouldHideButtonEdit,

    shouldHidePublicSteeringAxle,
    shouldHidePublicDriveAxle,
    shouldHidePublicTransmission,

    shouldHideSteeringAxle,
    shouldHideDriveAxle,
    shouldHideTransmission,
    shouldHideEngine,

    shouldHideOrganization,
    shouldHideDateOrder,
    shouldHideWorkOrder,
    shouldHideOperatingTime,

    shouldHideDateRecovery,
    shouldHideMethodRecovery,
    shouldHideUsedParts,
    shouldHideComplaintOperatingTime,
  };
};

export default useResponsive;
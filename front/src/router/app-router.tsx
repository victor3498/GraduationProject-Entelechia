import { useState, useEffect } from 'react';
import { AppRouter } from './index';
import { MobileAppRouter } from './mobile-router';
import { useDeviceDetect } from '../hooks/use-device-detect';

export function DeviceAwareRouter() {
  const { isMobile } = useDeviceDetect();

  return isMobile ? <MobileAppRouter /> : <AppRouter />;
}

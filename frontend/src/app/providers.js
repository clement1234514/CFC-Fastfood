'use client';
import { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store from '../store';
import { hydrate } from '../store/authSlice';

function HydrateOnMount({ children }) {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    dispatch(hydrate());
    setReady(true);
  }, [dispatch]);

  if (!ready) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#1A1A2E' }}>
        <div className="text-center">
          <img src="/logo.svg" alt="CFC Cameroon" height="80" className="mb-3" />
          <div className="spinner-border text-warning" role="status" style={{ width: '2rem', height: '2rem' }}></div>
        </div>
      </div>
    );
  }
  return children;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <HydrateOnMount>{children}</HydrateOnMount>
    </Provider>
  );
}

import { useState, useEffect } from 'react';
import { db, auth } from './firebase/config';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import DeviceCard from './components/DeviceCard';
import './App.css';

const MOCK_DEVICES = [
  { id: 'mock-dev-1', name: 'Living Room Light', type: 'LIGHT', state: { power: false }, status: 'OFF', homeId: 'mock-home', floorId: 'ground-floor', floorName: 'Ground Floor', roomName: 'Living Room', powerConsumption: 60 },
  { id: 'mock-dev-2', name: 'Kitchen Outlet', type: 'OUTLET', state: { power: true }, status: 'ON', homeId: 'mock-home', floorId: 'ground-floor', floorName: 'Ground Floor', roomName: 'Kitchen', powerConsumption: 200 },
  { id: 'mock-dev-3', name: 'Living Room Fan', type: 'FAN', state: { power: false }, status: 'OFF', homeId: 'mock-home', floorId: 'ground-floor', floorName: 'Ground Floor', roomName: 'Living Room', powerConsumption: 75, speed: 'MEDIUM' },
  { id: 'mock-dev-4', name: 'Smart Laundry Iron', type: 'IRON', state: { power: false }, status: 'OFF', homeId: 'mock-home', floorId: 'ground-floor', floorName: 'Ground Floor', roomName: 'Laundry', powerConsumption: 1800, maxOnDuration: 15 },
  { id: 'mock-dev-5', name: 'Bedroom Smart Switch Panel', type: 'SWITCH_PANEL', state: { power: true }, status: 'ON', homeId: 'mock-home', floorId: 'first-floor', floorName: 'First Floor', roomName: 'Master Bedroom', switches: [
    { id: 1, name: 'Ceiling Fan', status: 'ON', state: 'ON' },
    { id: 2, name: 'Reading Lamp', status: 'OFF', state: 'OFF' },
    { id: 3, name: 'Wall Lights', status: 'ON', state: 'ON' }
  ]},
  { id: 'mock-dev-6', name: 'Master Bed Thermostat', type: 'THERMOSTAT', state: { power: true }, status: 'ON', homeId: 'mock-home', floorId: 'first-floor', floorName: 'First Floor', roomName: 'Master Bedroom', temperature: 22, targetTemperature: 24 },
  { id: 'mock-dev-7', name: 'Kitchen Ceiling Light', type: 'LIGHT', state: { power: true }, status: 'ON', homeId: 'mock-home', floorId: 'ground-floor', floorName: 'Ground Floor', roomName: 'Kitchen', powerConsumption: 40 },
  { id: 'mock-dev-8', name: 'Bathroom Outlet', type: 'OUTLET', state: { power: false }, status: 'OFF', homeId: 'mock-home', floorId: 'first-floor', floorName: 'First Floor', roomName: 'Bathroom', powerConsumption: 100 },
];

const MOCK_CAMERAS = [
  { id: 'mock-cam-1', name: 'Front Gate Camera', type: 'CAMERA', state: { power: true }, status: 'ON', homeId: 'mock-home', floorId: 'ground-floor', floorName: 'Ground Floor', roomName: 'Garage Entrance', streaming: true, recording: true, motionDetection: true },
  { id: 'mock-cam-2', name: 'Backyard Camera', type: 'CAMERA', state: { power: false }, status: 'DISCONNECTED', homeId: 'mock-home', floorId: 'ground-floor', floorName: 'Ground Floor', roomName: 'Patio', streaming: false, recording: false, motionDetection: false },
];

function App() {
  const [devices, setDevices] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [mockMode, setMockMode] = useState(false);
  const [floorFilter, setFloorFilter] = useState('ALL'); // 'ALL' | 'GROUND' | 'FIRST'

  // Login state
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setShowLogin(false);
        setMockMode(false);
        fetchHomeId(currentUser.uid);
      } else {
        setUser(null);
        setLoading(false);
        setShowLogin(true);
        setConnectionStatus('disconnected');
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      // onAuthStateChanged will handle navigation
    } catch (error) {
      setLoginError(
        error.message
          .replace('Firebase: ', '')
          .replace(/ \(auth\/.*\)\.?/, '')
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setDevices([]);
    setCameras([]);
    setMockMode(false);
    setConnectionStatus('disconnected');
  };

  const handleUseMockData = () => {
    setShowLogin(false);
    loadMockData();
  };

  const loadMockData = () => {
    setDevices(MOCK_DEVICES);
    setCameras(MOCK_CAMERAS);
    setMockMode(true);
    setLoading(false);
    setConnectionStatus('mock-mode');
  };

  const fetchHomeId = async (uid) => {
    try {
      const homesRef = collection(db, 'homes');
      const q = query(homesRef, where('memberUserIds', 'array-contains', uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const homeDoc = snapshot.docs[0];
        subscribeToDevices(homeDoc.id);
        subscribeToCameras(homeDoc.id);
      } else {
        setDevices([]);
        setCameras([]);
        setLoading(false);
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error('Firestore unavailable, using mock data:', error.message);
      loadMockData();
    }
  };

  const subscribeToDevices = (hId) => {
    const devicesRef = collection(db, 'devices');
    const q = query(devicesRef, where('homeId', '==', hId));
    onSnapshot(q, (snapshot) => {
      const deviceList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setDevices(deviceList);
      setLoading(false);
      setConnectionStatus('connected');
    }, (error) => {
      console.error('Device subscription error:', error.message);
      loadMockData();
    });
  };

  const subscribeToCameras = (hId) => {
    const camerasRef = collection(db, 'cameras');
    const q = query(camerasRef, where('homeId', '==', hId));
    onSnapshot(q, (snapshot) => {
      const cameraList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setCameras(cameraList);
    }, () => {});
  };

  // newPower: boolean (true = ON, false = OFF)
  const simulateDeviceState = async (deviceId, newPower) => {
    if (mockMode) {
      setDevices(prev => prev.map(d =>
        d.id === deviceId ? { ...d, state: { ...d.state, power: newPower } } : d
      ));
      setCameras(prev => prev.map(c =>
        c.id === deviceId ? { ...c, state: { ...c.state, power: newPower } } : c
      ));
      return;
    }
    try {
      await updateDoc(doc(db, 'devices', deviceId), { 'state.power': newPower });
    } catch {
      try {
        await updateDoc(doc(db, 'cameras', deviceId), { 'state.power': newPower });
      } catch (err) {
        console.error('Error updating device state:', err);
      }
    }
  };

  const simulateDeviceStatus = async (deviceId, newStatus) => {
    if (mockMode) {
      setDevices(prev => prev.map(d =>
        d.id === deviceId ? { ...d, status: newStatus } : d
      ));
      setCameras(prev => prev.map(c =>
        c.id === deviceId ? { ...c, status: newStatus } : c
      ));
      return;
    }
    try {
      await updateDoc(doc(db, 'devices', deviceId), { status: newStatus });
      if (newStatus === 'ERROR' || newStatus === 'DISCONNECTED') {
        const device = devices.find(d => d.id === deviceId);
        await addDoc(collection(db, 'notifications'), {
          homeId: device?.homeId || user?.uid || 'mock-home',
          title: `⚠️ ${device?.name || 'Device'} Hardware ${newStatus === 'ERROR' ? 'Fault' : 'Offline'}`,
          message: `${device?.name || 'Device'} reported ${newStatus === 'ERROR' ? 'critical operational error' : 'connection loss'}.`,
          type: newStatus === 'ERROR' ? 'HAZARD' : 'SYSTEM',
          severity: newStatus === 'ERROR' ? 'HIGH' : 'MEDIUM',
          isRead: false,
          createdAt: serverTimestamp()
        });
      }
    } catch {
      try {
        await updateDoc(doc(db, 'cameras', deviceId), { status: newStatus });
        if (newStatus === 'ERROR' || newStatus === 'DISCONNECTED') {
          const camera = cameras.find(c => c.id === deviceId);
          await addDoc(collection(db, 'notifications'), {
            homeId: camera?.homeId || user?.uid || 'mock-home',
            title: `⚠️ ${camera?.name || 'Camera'} Hardware ${newStatus === 'ERROR' ? 'Fault' : 'Offline'}`,
            message: `${camera?.name || 'Camera'} reported ${newStatus === 'ERROR' ? 'critical operational error' : 'connection loss'}.`,
            type: 'SECURITY',
            severity: 'HIGH',
            isRead: false,
            createdAt: serverTimestamp()
          });
        }
      } catch (err) {
        console.error('Error updating device status:', err);
      }
    }
  };

  const simulateSubSwitchToggle = async (deviceId, switchIndex) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;
    const currentSwitches = device.state?.switches || device.switches || [];
    if (!currentSwitches.length) return;

    const updatedSwitches = currentSwitches.map((sw, idx) => {
      const isMatch = idx === switchIndex || sw.id === switchIndex || String(sw.id) === String(switchIndex) || sw.name === switchIndex || (idx + 1) === switchIndex;
      if (!isMatch) return sw;
      const currentStatus = sw.status || sw.state || 'OFF';
      const nextStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
      return { ...sw, id: sw.id || (idx + 1), status: nextStatus, state: nextStatus };
    });

    const activeCount = updatedSwitches.filter(s => s.status === 'ON' || s.state === 'ON').length;
    const nextDeviceStatus = activeCount > 0 ? 'ON' : 'OFF';
    const nextPower = activeCount > 0;

    if (mockMode) {
      setDevices(prev => prev.map(d =>
        d.id === deviceId ? {
          ...d,
          switches: updatedSwitches,
          status: nextDeviceStatus,
          state: { ...d.state, power: nextPower, switches: updatedSwitches },
          powerConsumption: activeCount * 15
        } : d
      ));
      return;
    }

    try {
      await updateDoc(doc(db, 'devices', deviceId), {
        'state.switches': updatedSwitches,
        'state.power': nextPower,
        switches: updatedSwitches,
        status: nextDeviceStatus
      });
    } catch (err) {
      console.error('Error toggling sub-switch:', err);
    }
  };

  const simulateBulkAction = async (action) => {
    const applyToItem = (item) => {
      switch (action) {
        case 'all-on':         return { ...item, state: { ...item.state, power: true  }, status: 'ON'  };
        case 'all-off':        return { ...item, state: { ...item.state, power: false }, status: 'OFF' };
        case 'simulate-error': return { ...item, status: 'ERROR' };
        case 'simulate-disconnect': return { ...item, status: 'DISCONNECTED' };
        case 'reset':          return { ...item, state: { ...item.state, power: false }, status: 'OFF' };
        default: return item;
      }
    };

    if (mockMode) {
      setDevices(prev => prev.map(applyToItem));
      setCameras(prev => prev.map(applyToItem));
      return;
    }

    const allItems = [...devices, ...cameras];
    const updates = allItems.map(item => {
      const ref = doc(db, item.type === 'CAMERA' ? 'cameras' : 'devices', item.id);
      switch (action) {
        case 'all-on':         return updateDoc(ref, { 'state.power': true,  status: 'ON'  });
        case 'all-off':        return updateDoc(ref, { 'state.power': false, status: 'OFF' });
        case 'simulate-error': return updateDoc(ref, { status: 'ERROR' });
        case 'simulate-disconnect': return updateDoc(ref, { status: 'DISCONNECTED' });
        case 'reset':          return updateDoc(ref, { 'state.power': false, status: 'OFF' });
        default: return Promise.resolve();
      }
    });
    await Promise.all(updates);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':   return '#4caf50';
      case 'mock-mode':   return '#2196f3';
      case 'connecting':  return '#ff9800';
      case 'disconnected':return '#f44336';
      case 'error':       return '#f44336';
      default:            return '#9e9e9e';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'mock-mode': return 'Demo Mode (Mock Data)';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // ── Login Screen ───────────────────────────────────────────────────────────
  if (showLogin) {
    return (
      <div className="app">
        <div className="login-screen">
          <div className="login-card">
            <div className="login-icon">🏠</div>
            <h1 className="login-title">Hardware Simulator</h1>
            <p className="login-subtitle">Sign in with your Smart Home account to sync with Firebase in real time</p>

            <form onSubmit={handleLogin} className="login-form">
              <div className="login-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="login-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {loginError && <div className="login-error">⚠️ {loginError}</div>}
              <button
                type="submit"
                className="btn btn-success login-btn"
                disabled={loginLoading}
              >
                {loginLoading ? 'Signing in…' : '🔐 Sign In & Sync'}
              </button>
            </form>

            <div className="login-divider"><span>or</span></div>

            <button className="btn btn-reset login-demo-btn" onClick={handleUseMockData}>
              🎭 Use Demo Mode (No Firebase)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading Screen ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Connecting to Smart Home…</p>
        </div>
      </div>
    );
  }

  const isGround = (item) => {
    const dId = String(item.id || '').toLowerCase();
    const dType = String(item.type || '').toLowerCase();
    const dName = String(item.name || '').toLowerCase();

    // Explicit First Floor device overrides
    if (dId === 'dev-switch-1' || dId === 'dev-thermostat-1' || dId === 'dev-bathroom-outlet-1' || dId === 'mock-dev-5' || dId === 'mock-dev-6' || dId === 'mock-dev-8' ||
        dType === 'switch_panel' || dType === 'thermostat' ||
        dName.includes('bedroom') || dName.includes('thermostat') || dName.includes('switch panel') || dName.includes('smart switch')) {
      return false;
    }

    const fId = String(item.floorId || item.floor || item.location?.floor || '').toLowerCase();
    const rName = String(item.roomName || item.room || item.roomId || item.location?.room || '').toLowerCase();

    if (fId.includes('ground') || fId.includes('0') || fId === 'floor-ground') return true;

    return rName.includes('kitchen') || rName.includes('living') || rName.includes('laundry') || rName.includes('garage') || rName.includes('patio') || rName.includes('gate') ||
           dName.includes('living') || dName.includes('kitchen') || dName.includes('iron') || dName.includes('front gate') || dName.includes('backyard') ||
           dId.includes('light-1') || dId.includes('outlet-1') || dId.includes('fan-1') || dId.includes('iron-1') || dId.includes('cam-1') || dId.includes('cam-2');
  };

  const isFirst = (item) => {
    const dId = String(item.id || '').toLowerCase();
    const dType = String(item.type || '').toLowerCase();
    const dName = String(item.name || '').toLowerCase();

    // Explicit First Floor device overrides
    if (dId === 'dev-switch-1' || dId === 'dev-thermostat-1' || dId === 'dev-bathroom-outlet-1' || dId === 'mock-dev-5' || dId === 'mock-dev-6' || dId === 'mock-dev-8' ||
        dType === 'switch_panel' || dType === 'thermostat' ||
        dName.includes('bedroom') || dName.includes('thermostat') || dName.includes('switch panel') || dName.includes('smart switch')) {
      return true;
    }

    const fId = String(item.floorId || item.floor || item.location?.floor || '').toLowerCase();
    const rName = String(item.roomName || item.room || item.roomId || item.location?.room || '').toLowerCase();

    if (fId.includes('first') || fId.includes('1st') || fId === 'floor-first') return true;

    return rName.includes('bedroom') || rName.includes('bathroom') ||
           dName.includes('bedroom') || dName.includes('thermostat') || dName.includes('switch panel') || dName.includes('smart switch') ||
           dId.includes('switch-1') || dId.includes('thermostat-1') || dId.includes('bathroom');
  };

  const filteredDevices = devices.filter(d => {
    if (floorFilter === 'GROUND') return isGround(d);
    if (floorFilter === 'FIRST') return isFirst(d);
    return true;
  });

  const filteredCameras = cameras.filter(c => {
    if (floorFilter === 'GROUND') return isGround(c);
    if (floorFilter === 'FIRST') return isFirst(c);
    return true;
  });

  // ── Main UI ────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1>Smart Home Hardware Simulator</h1>
          <div className="connection-status">
            <span className="status-dot" style={{ backgroundColor: getStatusColor(connectionStatus) }}></span>
            <span>{getStatusLabel(connectionStatus)}</span>
          </div>
        </div>
        <div className="header-right">
          {user && <span className="user-info">{user.email}</span>}
          {mockMode && <span className="mock-badge">DEMO</span>}
          {user && (
            <button className="btn btn-disconnect" onClick={handleLogout} style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
              Sign Out
            </button>
          )}
        </div>
      </header>

      {mockMode && (
        <div className="mock-banner">
          Running in demo mode with simulated devices. Sign in to sync with Firebase in real time.
        </div>
      )}

      {!mockMode && connectionStatus === 'connected' && devices.length === 0 && cameras.length === 0 && (
        <div className="mock-banner" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', borderColor: '#2196f3', color: '#90caf9' }}>
          ✅ Connected to Firebase as <strong>{user?.email}</strong>. No devices found for this account yet — add them from your mobile app!
        </div>
      )}

      <div className="controls-bar">
        <h3>Simulation Controls</h3>
        <div className="bulk-controls">
          <button onClick={() => simulateBulkAction('all-on')}          className="btn btn-success">All ON</button>
          <button onClick={() => simulateBulkAction('all-off')}         className="btn btn-warning">All OFF</button>
          <button onClick={() => simulateBulkAction('simulate-error')}  className="btn btn-danger">Simulate Error</button>
          <button onClick={() => simulateBulkAction('simulate-disconnect')} className="btn btn-disconnect">Simulate Disconnect</button>
          <button onClick={() => simulateBulkAction('reset')}           className="btn btn-reset">Reset All</button>
        </div>
      </div>

      <div className="floor-filter-bar">
        <span className="floor-filter-label">Filter View by Floor:</span>
        <div className="floor-filter-buttons">
          <button
            className={`floor-btn ${floorFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFloorFilter('ALL')}
          >
            All Floors ({devices.length + cameras.length})
          </button>
          <button
            className={`floor-btn ${floorFilter === 'GROUND' ? 'active' : ''}`}
            onClick={() => setFloorFilter('GROUND')}
          >
            🏠 Ground Floor
          </button>
          <button
            className={`floor-btn ${floorFilter === 'FIRST' ? 'active' : ''}`}
            onClick={() => setFloorFilter('FIRST')}
          >
            🏢 First Floor
          </button>
        </div>
      </div>

      <main className="main">
        <section className="devices-section">
          <h2>Devices ({filteredDevices.length})</h2>
          {filteredDevices.length === 0 ? (
            <div className="empty-state"><p>No devices found for selected floor filter.</p></div>
          ) : (
            <div className="devices-grid">
              {filteredDevices.map(device => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onStateChange={(newPower) => simulateDeviceState(device.id, newPower)}
                  onStatusChange={(newStatus) => simulateDeviceStatus(device.id, newStatus)}
                  onSubSwitchToggle={(switchIndex) => simulateSubSwitchToggle(device.id, switchIndex)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="cameras-section">
          <h2>Security Cameras ({filteredCameras.length})</h2>
          {filteredCameras.length === 0 ? (
            <div className="empty-state"><p>No cameras found for selected floor filter.</p></div>
          ) : (
            <div className="cameras-grid">
              {filteredCameras.map(camera => (
                <DeviceCard
                  key={camera.id}
                  device={camera}
                  onStateChange={(newPower) => simulateDeviceState(camera.id, newPower)}
                  onStatusChange={(newStatus) => simulateDeviceStatus(camera.id, newStatus)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Hardware Simulator v1.0 | {mockMode ? 'Demo Mode' : 'Real-time sync with Firebase Firestore'}</p>
      </footer>
    </div>
  );
}

export default App;

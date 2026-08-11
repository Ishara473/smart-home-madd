import { useState, useEffect } from 'react';
import './DeviceCard.css';

const DEVICE_CONFIG = {
  LIGHT: { icon: '💡', color: '#ffd93d', glowColor: 'rgba(255, 217, 61, 0.4)', label: 'Light' },
  OUTLET: { icon: '🔌', color: '#6bcb77', glowColor: 'rgba(107, 203, 119, 0.4)', label: 'Outlet' },
  SWITCH_PANEL: { icon: '🎛️', color: '#4d96ff', glowColor: 'rgba(77, 150, 255, 0.4)', label: 'Switch Panel' },
  IRON: { icon: '👔', color: '#ff6b6b', glowColor: 'rgba(255, 107, 107, 0.4)', label: 'Iron' },
  CAMERA: { icon: '📷', color: '#a855f7', glowColor: 'rgba(168, 85, 247, 0.4)', label: 'Camera' },
  FAN: { icon: '🌀', color: '#00d4ff', glowColor: 'rgba(0, 212, 255, 0.4)', label: 'Fan' },
  THERMOSTAT: { icon: '🌡️', color: '#ff9f43', glowColor: 'rgba(255, 159, 67, 0.4)', label: 'Thermostat' },
  DEFAULT: { icon: '⚡', color: '#00ff88', glowColor: 'rgba(0, 255, 136, 0.4)', label: 'Device' }
};

const STATUS_CONFIG = {
  ON: { color: '#00ff88', bg: 'rgba(0, 255, 136, 0.1)', label: 'Active', pulse: true },
  OFF: { color: '#5a5e73', bg: 'rgba(90, 94, 115, 0.1)', label: 'Inactive', pulse: false },
  ERROR: { color: '#ff4757', bg: 'rgba(255, 71, 87, 0.1)', label: 'Error', pulse: true },
  DISCONNECTED: { color: '#ffa502', bg: 'rgba(255, 165, 2, 0.1)', label: 'Offline', pulse: true }
};

function DeviceCard({ device, onStateChange, onStatusChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const deviceConfig = DEVICE_CONFIG[device.type] || DEVICE_CONFIG.DEFAULT;
  const statusConfig = STATUS_CONFIG[device.status] || STATUS_CONFIG.OFF;
  // state.power is a boolean in Firestore (matches mobile app data model)
  const isActive = device.state?.power === true || device.status === 'ON';

  const handleToggle = async () => {
    setIsToggling(true);
    const newPower = !(device.state?.power === true);
    const newStatus = newPower ? 'ON' : 'OFF';
    await onStateChange(newPower);   // passes boolean to simulateDeviceState
    await onStatusChange(newStatus); // passes string to simulateDeviceStatus
    setTimeout(() => setIsToggling(false), 300);
  };

  const handleSimulateError = () => {
    onStatusChange('ERROR');
    onStateChange(false); // power off on error
  };

  const handleSimulateDisconnect = () => {
    onStatusChange('DISCONNECTED');
  };

  const handleReset = () => {
    onStateChange(false); // power off on reset
    onStatusChange('OFF');
  };

  return (
    <div
      className={`device-card ${isActive ? 'active' : ''} ${device.status === 'ERROR' ? 'error' : ''} ${device.status === 'DISCONNECTED' ? 'disconnected' : ''} ${isExpanded ? 'expanded' : ''}`}
      style={{ '--device-color': deviceConfig.color, '--device-glow': deviceConfig.glowColor }}
    >
      <div className="card-glow"></div>

      <div className="device-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="device-icon-wrapper">
          <div className="device-icon-ring" style={{ borderColor: isActive ? deviceConfig.color : 'var(--border-color)' }}>
            <span className="device-icon">{deviceConfig.icon}</span>
          </div>
          {isActive && <div className="icon-pulse" style={{ borderColor: deviceConfig.color }}></div>}
        </div>

        <div className="device-info">
          <h3 className="device-name">{device.name}</h3>
          <p className="device-type">{deviceConfig.label}</p>
          {device.roomName && <p className="device-room">{device.roomName}</p>}
        </div>

        <div className="device-status-wrapper">
          <div className="status-badge" style={{ background: statusConfig.bg, color: statusConfig.color, borderColor: statusConfig.color }}>
            <span className={`status-dot ${statusConfig.pulse ? 'pulsing' : ''}`} style={{ backgroundColor: statusConfig.color }}></span>
            {statusConfig.label}
          </div>
        </div>
      </div>

      <div className="device-visual">
        <div className={`power-orb ${isActive ? 'active' : ''}`} style={{ '--orb-color': deviceConfig.color }}>
          <div className="orb-inner">
            <div className="orb-ring"></div>
            <div className="orb-core" style={{ backgroundColor: isActive ? deviceConfig.color : 'var(--text-muted)' }}></div>
          </div>
          {isActive && (
            <>
              <div className="orb-glow" style={{ backgroundColor: deviceConfig.glowColor }}></div>
              <div className="orb-particles">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="particle" style={{ '--delay': `${i * 0.3}s`, '--color': deviceConfig.color }}></div>
                ))}
              </div>
            </>
          )}
        </div>

        {device.type === 'LIGHT' && isActive && (
          <div className="light-rays" style={{ '--ray-color': deviceConfig.glowColor }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="ray" style={{ '--rotation': `${i * 45}deg` }}></div>
            ))}
          </div>
        )}

        {device.type === 'FAN' && isActive && (
          <div className="fan-blades">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="blade" style={{ transform: `rotate(${i * 120}deg)` }}></div>
            ))}
          </div>
        )}

        {device.type === 'CAMERA' && (
          <div className={`camera-indicator ${isActive ? 'recording' : ''}`}>
            <span className="rec-dot"></span>
            <span className="rec-text">{isActive ? 'REC' : 'OFFLINE'}</span>
          </div>
        )}
      </div>

      <div className="device-stats">
        {device.powerConsumption && (
          <div className="stat">
            <span className="stat-value">{device.powerConsumption}</span>
            <span className="stat-label">Watts</span>
          </div>
        )}
        {device.temperature && (
          <div className="stat">
            <span className="stat-value">{device.temperature}°</span>
            <span className="stat-label">Current</span>
          </div>
        )}
        {device.targetTemperature && (
          <div className="stat">
            <span className="stat-value">{device.targetTemperature}°</span>
            <span className="stat-label">Target</span>
          </div>
        )}
        {device.speed && (
          <div className="stat">
            <span className="stat-value">{device.speed}</span>
            <span className="stat-label">Speed</span>
          </div>
        )}
      </div>

      <div className="expand-indicator" onClick={() => setIsExpanded(!isExpanded)}>
        <svg className={`chevron ${isExpanded ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {isExpanded && (
        <div className="device-controls">
          <div className="control-section">
            <label className="control-label">Power Control</label>
            <button
              className={`power-toggle ${isActive ? 'on' : 'off'} ${isToggling ? 'toggling' : ''}`}
              onClick={handleToggle}
              style={{ '--toggle-color': deviceConfig.color }}
            >
              <div className="toggle-track">
                <div className="toggle-thumb"></div>
              </div>
              <span className="toggle-label">{isActive ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {device.switches && device.switches.length > 0 && (
            <div className="control-section">
              <label className="control-label">Sub-Switches (Click to toggle)</label>
              <div className="sub-switches">
                {device.switches.map((sw, idx) => {
                  const isSwOn = sw.state === 'ON' || sw.status === 'ON';
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`sub-switch-btn ${isSwOn ? 'on' : 'off'}`}
                      onClick={() => onSubSwitchToggle && onSubSwitchToggle(idx)}
                    >
                      <span className="sub-switch-name">{sw.name}</span>
                      <span className="sub-switch-badge" style={{ color: isSwOn ? deviceConfig.color : 'var(--text-muted)' }}>
                        {isSwOn ? 'ON' : 'OFF'}
                      </span>
                      <span className="sub-switch-dot" style={{ backgroundColor: isSwOn ? deviceConfig.color : 'var(--text-muted)' }}></span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="control-section">
            <label className="control-label">Simulate Faults</label>
            <div className="sim-controls">
              <button onClick={handleSimulateError} className="sim-btn error">
                <span className="sim-icon">⚠️</span> Error
              </button>
              <button onClick={handleSimulateDisconnect} className="sim-btn disconnect">
                <span className="sim-icon">📡</span> Offline
              </button>
              <button onClick={handleReset} className="sim-btn reset">
                <span className="sim-icon">🔄</span> Reset
              </button>
            </div>
          </div>

          {device.maxOnDuration && (
            <div className="safety-warning">
              <span className="warning-icon">⚠️</span>
              <span>Safety Timer: {device.maxOnDuration} min max</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DeviceCard;

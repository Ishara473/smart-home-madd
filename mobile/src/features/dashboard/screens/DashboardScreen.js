import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { borders } from '../../../shared/theme/borders';
import { useHomeContext } from '../../home/context/HomeContext';
import { useDevices } from '../../devices';
import { useAuth } from '../../auth/context/AuthContext';
import { useFloors } from '../../floors/hooks/useFloors';
import { useNotifications } from '../../notifications';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function formatTimeAgo(timestamp) {
  if (!timestamp) return 'just now';
  const date = typeof timestamp === 'string' ? new Date(timestamp) :
    timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.clockContainer}>
      <Text style={styles.clockTime}>{h12}:{minutes}</Text>
      <View style={styles.clockRight}>
        <Text style={styles.clockPeriod}>{period}</Text>
        <Text style={styles.clockDate}>{dateStr}</Text>
      </View>
    </View>
  );
}

function EnergyPulse({ activeDevices, totalDevices }) {
  const ratio = totalDevices > 0 ? activeDevices / totalDevices : 0;
  const pulseColor = ratio > 0.7 ? colors.status.ERROR : ratio > 0.4 ? colors.warning : colors.status.ON;
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={styles.energyPulseCard}>
      <View style={[styles.pulseRing, {
        borderColor: pulseColor,
        opacity: pulse ? 0.6 : 1,
        transform: [{ scale: pulse ? 1.05 : 1 }],
      }]}>
        <View style={[styles.pulseInner, { backgroundColor: `${pulseColor}20` }]}>
          <MaterialCommunityIcons name="flash" size={28} color={pulseColor} />
          <Text style={[styles.pulseValue, { color: pulseColor }]}>{activeDevices}</Text>
          <Text style={styles.pulseLabel}>ACTIVE</Text>
        </View>
      </View>
      <View style={styles.energyInfo}>
        <Text style={styles.energyTitle}>Power Grid</Text>
        <Text style={styles.energySubtitle}>{activeDevices} of {totalDevices} devices online</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {
            width: `${ratio * 100}%`,
            backgroundColor: pulseColor,
          }]} />
        </View>
        <View style={styles.energyStats}>
          <View style={styles.energyStat}>
            <MaterialCommunityIcons name="lightning-bolt" size={12} color={colors.warning} />
            <Text style={styles.energyStatText}>{(activeDevices * 0.18).toFixed(1)} kW</Text>
          </View>
          <View style={styles.energyStat}>
            <MaterialCommunityIcons name="leaf" size={12} color={colors.status.ON} />
            <Text style={styles.energyStatText}>Eco</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function DeviceStatusRing({ devices }) {
  const statusCount = { ON: 0, OFF: 0, ERROR: 0, DISCONNECTED: 0 };
  devices.forEach((d) => {
    if (statusCount[d.status] !== undefined) statusCount[d.status]++;
  });

  const total = devices.length || 1;
  const segments = [
    { count: statusCount.ON, color: colors.status.ON, label: 'On' },
    { count: statusCount.OFF, color: colors.status.OFF, label: 'Off' },
    { count: statusCount.ERROR, color: colors.status.ERROR, label: 'Error' },
    { count: statusCount.DISCONNECTED, color: colors.status.DISCONNECTED, label: 'DC' },
  ];

  return (
    <View style={styles.ringCard}>
      <Text style={styles.ringTitle}>Device Status</Text>
      <View style={styles.ringBar}>
        {segments.map((seg, i) => {
          const pct = (seg.count / total) * 100;
          if (pct === 0) return null;
          return (
            <View
              key={i}
              style={[styles.ringSegment, {
                width: `${pct}%`,
                backgroundColor: seg.color,
              }]}
            />
          );
        })}
      </View>
      <View style={styles.ringLegend}>
        {segments.map((seg, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: seg.color }]} />
            <Text style={styles.legendText}>{seg.label}</Text>
            <Text style={styles.legendCount}>{seg.count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function QuickSceneButton({ icon, label, color, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.sceneBtn, pressed && { transform: [{ scale: 0.93 }], opacity: 0.8 }]}
      onPress={onPress}
    >
      <View style={[styles.sceneIcon, { backgroundColor: `${color}18` }]}>
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.sceneLabel}>{label}</Text>
    </Pressable>
  );
}

function FloorCard({ floor, onPress }) {
  const ratio = floor.deviceCount > 0 ? floor.activeDevicesCount / floor.deviceCount : 0;
  const barColor = ratio > 0.5 ? colors.status.ON : colors.textMuted;

  return (
    <Pressable
      style={({ pressed }) => [styles.floorCard, pressed && { transform: [{ scale: 0.97 }] }]}
      onPress={onPress}
    >
      <View style={styles.floorHeader}>
        <View style={[styles.floorIcon, { backgroundColor: `${colors.primary}15` }]}>
          <MaterialCommunityIcons name="home-variant" size={20} color={colors.primary} />
        </View>
        <View style={styles.floorInfo}>
          <Text style={styles.floorName}>{floor.name}</Text>
          <Text style={styles.floorMeta}>{floor.roomCount} rooms</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
      </View>
      <View style={styles.floorBarBg}>
        <View style={[styles.floorBarFill, { width: `${ratio * 100}%`, backgroundColor: barColor }]} />
      </View>
      <View style={styles.floorStats}>
        <Text style={styles.floorStatText}>{floor.activeDevicesCount} active</Text>
        <Text style={styles.floorStatText}>{floor.deviceCount} total</Text>
      </View>
    </Pressable>
  );
}

function SafetyCard({ alert }) {
  const isHigh = alert.severity === 'HIGH';
  const color = isHigh ? colors.status.ERROR : colors.warning;
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (!isHigh) return;
    const t = setInterval(() => setBlink((b) => !b), 800);
    return () => clearInterval(t);
  }, [isHigh]);

  return (
    <View style={[styles.safetyCard, { borderLeftColor: color }]}>
      <View style={styles.safetyTop}>
        <View style={[styles.safetyDot, {
          backgroundColor: color,
          opacity: isHigh ? (blink ? 1 : 0.3) : 1,
        }]} />
        <Text style={[styles.safetySeverity, { color }]}>
          {alert.severity}
        </Text>
        <Text style={styles.safetyTime}>{alert.timestamp}</Text>
      </View>
      <Text style={styles.safetyTitle}>{alert.title}</Text>
      <Text style={styles.safetyMessage}>{alert.message}</Text>
    </View>
  );
}

function ActivityItem({ activity }) {
  const getIcon = (type) => {
    switch (type) {
      case 'TOGGLE': return 'power';
      case 'SAFETY': return 'shield-alert';
      case 'STATUS': return 'information';
      case 'CONNECT': return 'lan-connect';
      default: return 'bell';
    }
  };
  const getColor = (type) => {
    switch (type) {
      case 'SAFETY': return colors.status.ERROR;
      case 'TOGGLE': return colors.status.ON;
      case 'CONNECT': return colors.primary;
      default: return colors.textSecondary;
    }
  };
  const color = getColor(activity.type);

  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityDot, { backgroundColor: `${color}20` }]}>
        <MaterialCommunityIcons name={getIcon(activity.type)} size={14} color={color} />
      </View>
      <View style={styles.activityInfo}>
        <Text style={styles.activityDevice}>{activity.deviceName}</Text>
        <Text style={styles.activityAction}>{activity.action}</Text>
      </View>
      <Text style={styles.activityTime}>{activity.timestamp}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const { home } = useHomeContext();
  const { devices } = useDevices();
  const { user } = useAuth();
  const { floors: dbFloors } = useFloors();
  const { notifications } = useNotifications();

  const activeCount = devices.filter((d) => d.status === 'ON').length;
  const homeName = home?.name || 'Smart Villa';
  const userName = user?.displayName || 'Resident';
  const floorsCount = home?.floorsCount || dbFloors.length || 2;
  const totalDevices = devices.length || 14;

  const floorsSummary = dbFloors.length > 0
    ? dbFloors.map((f) => ({
        id: f.id,
        name: f.name,
        roomCount: f.roomCount || 0,
        deviceCount: f.deviceCount || 0,
        activeDevicesCount: 0,
      }))
    : [
        { id: 'floor-ground', name: 'Ground Floor', roomCount: 4, deviceCount: 8, activeDevicesCount: 3 },
        { id: 'floor-first', name: 'First Floor', roomCount: 2, deviceCount: 6, activeDevicesCount: 2 },
      ];

  const safetyAlerts = notifications.length > 0
    ? notifications
        .filter(n => n.type === 'SAFETY' || n.severity === 'HIGH' || n.severity === 'WARNING')
        .slice(0, 5)
        .map(n => ({
          id: n.id,
          title: n.title,
          message: n.message,
          severity: n.severity === 'HIGH' || n.severity === 'WARNING' ? n.severity : 'MEDIUM',
          timestamp: n.timestamp
            ? formatTimeAgo(n.timestamp)
            : 'just now',
        }))
    : [
        { id: 'a1', title: 'Iron Safety Cutoff', message: 'Laundry Iron exceeded 15 min limit — auto shut off', severity: 'HIGH', timestamp: '2m ago' },
        { id: 'a2', title: 'Camera Disconnected', message: 'Garage Camera lost connection', severity: 'MEDIUM', timestamp: '14m ago' },
      ];

  const recentActivity = [
    { id: 'r1', type: 'TOGGLE', deviceName: 'Living Room Light', action: 'Turned ON', timestamp: '5m' },
    { id: 'r2', type: 'SAFETY', deviceName: 'Laundry Iron', action: 'Auto Cutoff', timestamp: '12m' },
    { id: 'r3', type: 'STATUS', deviceName: 'Bedroom Fan', action: 'Speed set to HIGH', timestamp: '30m' },
    { id: 'r4', type: 'CONNECT', deviceName: 'Kitchen Outlet', action: 'Reconnected', timestamp: '1h' },
  ];

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScreenContainer useSafeArea={true} padding={false}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >

        {/* Hero Header */}
        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroGreeting}>{getGreeting()},</Text>
              <Text style={styles.heroName}>{userName}</Text>
              <View style={styles.heroStatus}>
                <View style={styles.heroStatusDot} />
                <Text style={styles.heroStatusText}>System Online</Text>
              </View>
            </View>
            <LiveClock />
          </View>
          <View style={styles.heroBottom}>
            <View style={styles.heroStatPill}>
              <MaterialCommunityIcons name="home" size={14} color={colors.primary} />
              <Text style={styles.heroStatText}>{homeName}</Text>
            </View>
            <View style={styles.heroStatPill}>
              <MaterialCommunityIcons name="layers" size={14} color={colors.secondary} />
              <Text style={styles.heroStatText}>{floorsCount} Floors</Text>
            </View>
          </View>
        </View>

        {/* Energy Pulse + Status Ring */}
        <EnergyPulse activeDevices={activeCount} totalDevices={totalDevices} />
        <DeviceStatusRing devices={devices.length > 0 ? devices : [
          { status: 'ON' }, { status: 'ON' }, { status: 'ON' }, { status: 'ON' }, { status: 'ON' },
          { status: 'OFF' }, { status: 'OFF' }, { status: 'OFF' }, { status: 'OFF' },
          { status: 'OFF' }, { status: 'OFF' }, { status: 'OFF' },
          { status: 'ERROR' }, { status: 'DISCONNECTED' },
        ]} />

        {/* Quick Scenes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scenes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sceneScroll}>
            <QuickSceneButton icon="movie-open" label="Movie" color={colors.accent} onPress={() => {}} />
            <QuickSceneButton icon="weather-night" label="Sleep" color={colors.secondary} onPress={() => {}} />
            <QuickSceneButton icon="white-balance-sunny" label="Morning" color={colors.warning} onPress={() => {}} />
            <QuickSceneButton icon="exit-to-app" label="Away" color={colors.danger} onPress={() => {}} />
            <QuickSceneButton icon="party-popper" label="Party" color={colors.primary} onPress={() => {}} />
          </ScrollView>
        </View>

        {/* Floor Cards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Floors</Text>
            <Pressable onPress={() => router.push('/floors')}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
          {floorsSummary.map((f) => (
            <FloorCard key={f.id} floor={f} onPress={() => router.push(`/floors/${f.id}`)} />
          ))}
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Control Center</Text>
          <View style={styles.actionsGrid}>
            {[
              { icon: 'layers-outline', label: 'Floors', route: '/floors', color: colors.primary },
              { icon: 'devices', label: 'Devices', route: '/devices', color: '#10b981' },
              { icon: 'video-outline', label: 'Cameras', route: '/cameras', color: colors.warning },
              { icon: 'clock-outline', label: 'Schedules', route: '/schedules', color: colors.accent },
              { icon: 'chart-bar', label: 'Reports', route: '/reports', color: colors.secondary },
              { icon: 'bell-outline', label: 'Alerts', route: '/notifications', color: colors.danger },
            ].map((a) => (
              <Pressable
                key={a.label}
                style={({ pressed }) => [styles.actionCard, pressed && { transform: [{ scale: 0.93 }], backgroundColor: colors.surfaceHighlight }]}
                onPress={() => router.push(a.route)}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${a.color}15` }]}>
                  <MaterialCommunityIcons name={a.icon} size={22} color={a.color} />
                </View>
                <Text style={styles.actionLabel}>{a.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Safety Alerts */}
        {safetyAlerts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Safety Alerts</Text>
              <View style={styles.alertCountBadge}>
                <Text style={styles.alertCountText}>{safetyAlerts.length}</Text>
              </View>
            </View>
            {safetyAlerts.map((a) => (
              <SafetyCard key={a.id} alert={a} />
            ))}
          </View>
        )}

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Pressable onPress={() => router.push('/notifications')}>
              <Text style={styles.seeAll}>View All</Text>
            </Pressable>
          </View>
          <View style={styles.activityCard}>
            {recentActivity.map((a, i) => (
              <React.Fragment key={a.id}>
                <ActivityItem activity={a} />
                {i < recentActivity.length - 1 && <View style={styles.activityDivider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  hero: {
    backgroundColor: '#0d1117',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(0, 255, 136, 0.08)',
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLeft: {
    flex: 1,
  },
  heroGreeting: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  heroName: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  heroStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  heroStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.ON,
  },
  heroStatusText: {
    color: colors.status.ON,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  heroBottom: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  heroStatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  heroStatText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },

  // Clock
  clockContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  clockTime: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: '200',
    letterSpacing: -1,
  },
  clockRight: {
    marginLeft: 4,
    marginTop: 4,
  },
  clockPeriod: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  clockDate: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '500',
  },

  // Energy Pulse
  energyPulseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  pulseRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseInner: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseValue: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  pulseLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  energyInfo: {
    flex: 1,
    marginLeft: 16,
  },
  energyTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  energySubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  energyStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  energyStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  energyStatText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },

  // Device Status Ring
  ringCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  ringTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  ringBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  ringSegment: {
    height: '100%',
  },
  ringLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  legendCount: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },

  // Sections
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  seeAll: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  // Scenes
  sceneScroll: {
    gap: 12,
    marginTop: 12,
    paddingRight: 16,
  },
  sceneBtn: {
    alignItems: 'center',
    gap: 6,
  },
  sceneIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  sceneLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },

  // Floor Cards
  floorCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  floorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floorIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  floorName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  floorMeta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 1,
  },
  floorBarBg: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  floorBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  floorStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  floorStatText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },

  // Actions Grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  actionCard: {
    width: (SCREEN_WIDTH - 44) / 3,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },

  // Safety
  safetyCard: {
    backgroundColor: 'rgba(20, 20, 30, 0.9)',
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  safetyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  safetyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  safetySeverity: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  safetyTime: {
    marginLeft: 'auto',
    color: colors.textMuted,
    fontSize: 10,
  },
  safetyTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  safetyMessage: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  alertCountBadge: {
    backgroundColor: colors.danger,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertCountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  // Activity
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activityDevice: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  activityAction: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  activityTime: {
    color: colors.textMuted,
    fontSize: 11,
  },
  activityDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 42,
  },
});

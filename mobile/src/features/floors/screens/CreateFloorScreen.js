import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import { FloorRepository as MockFloorRepository } from '../repository/FloorRepository';
import { floorRepository as firebaseFloorRepository } from '../../../services/firebase/repositories';
import { shouldUseMockData, isFirebaseConfigured } from '../../../services/firebase';
import { useHomeContext } from '../../home/context/HomeContext';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';
import { shadows } from '../../../shared/theme/shadows';

const GRID_PRESETS = [
  { label: 'Small (6x6)', width: 6, height: 6 },
  { label: 'Medium (8x8)', width: 8, height: 8 },
  { label: 'Large (10x8)', width: 10, height: 8 },
  { label: 'Extra Large (12x10)', width: 12, height: 10 },
];

export default function CreateFloorScreen() {
  const router = useRouter();
  const { homeId } = useHomeContext();
  const [name, setName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(1);
  const [order, setOrder] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Validation', 'Please enter a floor name.');
      return;
    }

    setSaving(true);
    const preset = GRID_PRESETS[selectedPreset];
    const floorData = {
      name: trimmedName,
      homeId: homeId || 'home-main',
      order: order ? parseInt(order, 10) : 0,
      gridWidth: preset.width,
      gridHeight: preset.height,
      imageUrl: null,
      rooms: [],
      roomCount: 0,
      deviceCount: 0,
      status: 'ON',
    };

    try {
      if (shouldUseMockData()) {
        MockFloorRepository.addFloor(floorData);
      } else if (isFirebaseConfigured() && homeId) {
        await firebaseFloorRepository.createFloor(floorData);
      } else {
        MockFloorRepository.addFloor(floorData);
      }
      router.back();
    } catch (err) {
      console.error('[CreateFloorScreen] Save failed', err);
      Alert.alert('Error', 'Failed to create floor. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer useSafeArea={true} padding={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            style={styles.navBackLink}
            onPress={() => router.back()}
          >
            <Text style={styles.navBackLinkText}>← Back to Floor Plans</Text>
          </Pressable>

          <Text style={styles.title}>Add New Floor</Text>
          <Text style={styles.subtitle}>
            Configure a new floor level for your smart home layout
          </Text>

          {/* Floor Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Floor Name *</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Ground Floor, Basement, Attic"
              placeholderTextColor={colors.textMuted}
              maxLength={40}
              autoCapitalize="words"
            />
          </View>

          {/* Floor Order */}
          <View style={styles.section}>
            <Text style={styles.label}>Display Order</Text>
            <TextInput
              style={styles.textInput}
              value={order}
              onChangeText={setOrder}
              placeholder="0 (auto)"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={3}
            />
            <Text style={styles.hint}>
              Lower numbers appear first. Leave blank for auto.
            </Text>
          </View>

          {/* Grid Size Preset */}
          <View style={styles.section}>
            <Text style={styles.label}>Grid Layout Size</Text>
            <Text style={styles.hint}>
              Choose the abstract grid dimensions for the floor plan map.
            </Text>
            <View style={styles.presetGrid}>
              {GRID_PRESETS.map((preset, index) => (
                <Pressable
                  key={preset.label}
                  style={[
                    styles.presetCard,
                    selectedPreset === index && styles.presetCardActive,
                  ]}
                  onPress={() => setSelectedPreset(index)}
                >
                  <MaterialCommunityIcons
                    name="grid"
                    size={20}
                    color={
                      selectedPreset === index
                        ? colors.primary
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.presetLabel,
                      selectedPreset === index && styles.presetLabelActive,
                    ]}
                  >
                    {preset.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Preview */}
          <View style={styles.section}>
            <Text style={styles.label}>Preview</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <MaterialCommunityIcons
                  name="home-variant"
                  size={22}
                  color={colors.primary}
                />
                <Text style={styles.previewName}>
                  {name.trim() || 'New Floor'}
                </Text>
              </View>
              <View style={styles.previewGrid}>
                <Text style={styles.previewGridText}>
                  {GRID_PRESETS[selectedPreset].width} x{' '}
                  {GRID_PRESETS[selectedPreset].height} grid
                </Text>
                <Text style={styles.previewGridSubtext}>
                  {(GRID_PRESETS[selectedPreset].width * GRID_PRESETS[selectedPreset].height)}
                  {' '}cells available for room placement
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <Pressable
            style={[
              styles.saveButton,
              saving && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            <MaterialCommunityIcons
              name={saving ? 'loading' : 'check-circle-outline'}
              size={20}
              color={colors.primary}
            />
            <Text style={styles.saveButtonText}>
              {saving ? 'Creating...' : 'Create Floor'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.medium,
    paddingBottom: spacing.xxl,
  },
  navBackLink: {
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  navBackLinkText: {
    color: colors.primary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.headingLarge,
    fontWeight: typography.weights.bold,
    marginTop: spacing.small,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.body,
    marginTop: 2,
    marginBottom: spacing.medium,
  },
  section: {
    marginBottom: spacing.large,
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.sizes.titleMedium,
    fontWeight: typography.weights.semiBold,
    marginBottom: spacing.xs,
  },
  hint: {
    color: colors.textMuted,
    fontSize: typography.sizes.caption,
    marginTop: spacing.xs,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    color: colors.textPrimary,
    fontSize: typography.sizes.bodyLarge,
    marginTop: spacing.xs,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.small,
    marginTop: spacing.small,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    borderRadius: borders.radius.medium,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
  },
  presetCardActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  presetLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
  },
  presetLabelActive: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    borderRadius: borders.radius.large,
    padding: spacing.medium,
    marginTop: spacing.small,
    ...shadows.small,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
    marginBottom: spacing.small,
  },
  previewName: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
  },
  previewGrid: {
    backgroundColor: colors.background,
    borderRadius: borders.radius.small,
    padding: spacing.small,
  },
  previewGridText: {
    color: colors.primary,
    fontSize: typography.sizes.titleLarge,
    fontWeight: typography.weights.bold,
  },
  previewGridSubtext: {
    color: colors.textMuted,
    fontSize: typography.sizes.caption,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: spacing.medium,
    paddingBottom: spacing.large,
    paddingTop: spacing.small,
    backgroundColor: colors.background,
    borderTopWidth: borders.width.thin,
    borderTopColor: colors.divider,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.small,
    backgroundColor: `${colors.primary}15`,
    borderWidth: borders.width.thin,
    borderColor: colors.primary,
    paddingVertical: spacing.medium,
    borderRadius: borders.radius.medium,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
  },
});

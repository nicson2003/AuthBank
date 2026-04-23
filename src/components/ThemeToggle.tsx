import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../store/context/ThemeContext';

const ThemeToggle: React.FC<{ size?: number }> = ({ size = 42 }) => {
  const { isDark, toggleTheme, colors } = useTheme();
  const anim  = useRef(new Animated.Value(isDark ? 0 : 1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(anim, {
        toValue: isDark ? 0 : 1,
        useNativeDriver: true,
        tension: 90,
        friction: 9,
      }),
      Animated.sequence([
        Animated.spring(scale, { toValue: 0.85, useNativeDriver: true, tension: 200 }),
        Animated.spring(scale, { toValue: 1,    useNativeDriver: true, tension: 120 }),
      ]),
    ]).start();
  }, [isDark]);

  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const tx     = anim.interpolate({ inputRange: [0, 1], outputRange: [4, size * 0.58 + 4] });

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.8}
      accessibilityLabel={isDark ? 'Light mode' : 'Dark mode'}
    >
      <Animated.View style={[styles.pill, {
        width: size * 1.62,
        height: size,
        borderRadius: size / 2,
        backgroundColor: isDark ? '#0D1220' : '#E8E4DC',
        borderColor: isDark ? '#1E2B42' : '#D0CBBF',
        transform: [{ scale }],
      }]}>
        <View style={styles.track}>
          <Ionicons name="sunny" size={size * 0.36} color={isDark ? '#3A4460' : colors.accent} />
          <Ionicons name="moon"  size={size * 0.33} color={isDark ? colors.accent : '#C0BFBA'} />
        </View>
        <Animated.View style={[styles.thumb, {
          width: size - 8,
          height: size - 8,
          borderRadius: (size - 8) / 2,
          backgroundColor: isDark ? colors.accent : '#1B3178',
          shadowColor: isDark ? colors.accent : '#1B3178',
          transform: [{ translateX: tx }, { rotate }],
        }]}>
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={size * 0.34} color="#fff" />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    justifyContent: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  thumb: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
});

export default ThemeToggle;

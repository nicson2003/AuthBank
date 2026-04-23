import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../store/context/ThemeContext';
import { AuthInputProps } from '../types';

const AuthInput: React.FC<AuthInputProps> = ({
  label, value, onChangeText, placeholder,
  secureTextEntry = false, keyboardType = 'default',
  autoCapitalize = 'none', error, leftIcon,
}) => {
  const { colors } = useTheme();
  const [showPwd, setShowPwd] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label && <Text style={[styles.label, { color: colors.textLabel }]}>{label}</Text>}
      <View style={[styles.row, {
        backgroundColor: focused ? colors.bgInputFocused : colors.bgInput,
        borderColor: error ? colors.error : focused ? colors.borderFocused : colors.border,
      }]}>
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={18}
            color={focused ? colors.accent : colors.textPlaceholder}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textPlaceholder}
          secureTextEntry={secureTextEntry && !showPwd}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={colors.accent}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPwd(p => !p)} style={styles.eye}>
            <Ionicons
              name={showPwd ? 'eye-off-outline' : 'eye-outline'}
              size={19}
              color={focused ? colors.accent : colors.textPlaceholder}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View style={styles.errRow}>
          <Ionicons name="alert-circle-outline" size={12} color={colors.error} />
          <Text style={[styles.errText, { color: colors.error }]}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 7 },
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 52 },
  leftIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
  eye: { padding: 4 },
  errRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 4 },
  errText: { fontSize: 12, fontWeight: '500', flex: 1 },
});

export default AuthInput;

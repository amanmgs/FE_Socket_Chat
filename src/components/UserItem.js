import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';

import COLORS from '../theme/colors';

export default function UserItem({ item, onPress }) {
  const avatar = item.username?.charAt(0).toUpperCase();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{avatar}</Text>

        <View
          style={[
            styles.onlineDot,
            {
              backgroundColor: item.online
                ? COLORS.online
                : COLORS.offline,
            },
          ]}
        />
      </View>

      {/* User Details */}
      <View style={styles.center}>
        <Text style={styles.username}>
          {item.username}
        </Text>

        <Text style={styles.status}>
          {item.online
            ? 'Online'
            : `Last seen ${new Date(
                item.lastSeen,
              ).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}`}
        </Text>
      </View>

      {/* Unread Badge */}
      {item.unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {item.unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 8,
    borderRadius: 16,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  avatarText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '700',
  },

  onlineDot: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  center: {
    flex: 1,
    marginLeft: 15,
  },

  username: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },

  status: {
    marginTop: 4,
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  badge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.unread,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  badgeText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 12,
  },
});
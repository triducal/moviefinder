import { Ionicons } from "@expo/vector-icons";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/utils/supabase";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];

  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.display_name || ""
  );
  const [photoUri, setPhotoUri] = useState(
    user?.user_metadata?.avatar_url || ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  /** Pick profile image **/
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  /** Save profile changes **/
  const handleSaveChanges = async () => {
    if (!user) return;
    setSaving(true);

    try {
      let uploadedUrl = photoUri;

      /** Upload new avatar if updated */
      if (photoUri && photoUri.startsWith("file://")) {
        const fileName = `avatars/${user.id}-${Date.now()}.jpg`;
        const base64 = await FileSystem.readAsStringAsync(photoUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const binary = Buffer.from(base64, "base64");

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, binary, {
            upsert: true,
            contentType: "image/jpeg",
          });

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        uploadedUrl = publicUrl.publicUrl;
      }

      /** Update auth user metadata */
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          avatar_url: uploadedUrl,
        },
      });
      if (updateAuthError) throw updateAuthError;

      /** Update profile table */
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        display_name: displayName,
        avatar_url: uploadedUrl,
        email: user.email,
        updated_at: new Date().toISOString(),
      });
      if (profileError) throw profileError;

      Alert.alert("Success", "Profile updated successfully.");
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  /** Logout */
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      Alert.alert("Unable to sign out", "Please try again.");
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.backgroundPrimary }]}
    >
      <ThemedView style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image
            source={{
              uri:
                photoUri ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            }}
            style={[
              styles.avatar,
              { backgroundColor: theme.backgroundTertiary },
            ]}
          />

          <ThemedText type="title" style={[styles.name, { color: theme.text }]}>
            {displayName || "Your Name"}
          </ThemedText>

          <ThemedText style={[styles.email, { color: theme.textMuted }]}>
            {user?.email}
          </ThemedText>

          {/* EDIT PROFILE */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                borderColor: theme.textMuted,
                backgroundColor: "transparent",
                marginTop: 20,
              },
            ]}
            onPress={() => setIsEditing(true)}
          >
            <ThemedText
              style={[styles.actionButtonText, { color: theme.text }]}
            >
              Edit Profile
            </ThemedText>
          </TouchableOpacity>

          {/* LOGOUT (same size, directly below) */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                borderColor: theme.danger,
                backgroundColor: "transparent",
                marginTop: 12,
              },
            ]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={18} color={theme.danger} />
            <ThemedText
              style={[
                styles.actionButtonText,
                { color: theme.danger, marginLeft: 6 },
              ]}
            >
              Log Out
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* EDIT PROFILE MODAL */}
      <Modal
        visible={isEditing}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditing(false)}
      >
        <View
          style={[styles.modalOverlay, { backgroundColor: "rgba(0,0,0,0.6)" }]}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <ThemedText
              type="subtitle"
              style={[styles.modalTitle, { color: theme.text }]}
            >
              Edit Profile
            </ThemedText>

            {/* Edit Picture */}
            <TouchableOpacity onPress={handlePickImage}>
              <Image
                source={{
                  uri:
                    photoUri ||
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                }}
                style={[
                  styles.modalAvatar,
                  { backgroundColor: theme.backgroundTertiary },
                ]}
              />
              <View style={styles.editIcon}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* Edit Name */}
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter new display name"
              placeholderTextColor={theme.textMuted}
              style={[
                styles.input,
                {
                  color: theme.text,
                  backgroundColor: theme.backgroundTertiary,
                },
              ]}
            />

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: theme.brandPrimary },
                ]}
                onPress={handleSaveChanges}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.modalButtonText}>Save</ThemedText>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: theme.backgroundTertiary },
                ]}
                onPress={() => setIsEditing(false)}
              >
                <ThemedText
                  style={[styles.modalButtonText, { color: theme.textMuted }]}
                >
                  Cancel
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ---------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    paddingTop: 40,
  },

  header: {
    width: "100%",
    alignItems: "center",
  },

  avatar: { width: 120, height: 120, borderRadius: 60 },

  name: { fontSize: 20, fontWeight: "700", marginTop: 12 },

  email: { fontSize: 14, marginTop: 4 },

  actionButton: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  actionButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "85%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },

  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },

  modalAvatar: { width: 100, height: 100, borderRadius: 50 },

  editIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    padding: 6,
  },

  input: {
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginTop: 16,
  },

  modalButtons: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  modalButtonText: { color: "#fff", fontWeight: "600" },
});

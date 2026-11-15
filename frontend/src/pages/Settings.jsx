import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Palette,
  Bell,
  Database,
  Trash2,
} from "lucide-react";

import API from "../services/auth";

function Settings() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("Dark");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [historyCount, setHistoryCount] = useState(0);

  // Load settings from MongoDB
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [settingsResponse, historyResponse] = await Promise.all([
          API.get("/api/settings"),
          API.get("/api/conversations"),
        ]);

        const settings = settingsResponse.data;

        setUsername(settings.display_name);
        setEmail(settings.email);
        setTheme(settings.theme);
        setNotifications(settings.notifications);

        setHistoryCount(historyResponse.data.conversations.length);
      } catch (error) {
        console.error("Settings loading failed:", error);
        setMessage("Unable to load settings.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to MongoDB
  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage("");

      await API.put("/api/settings", {
        display_name: username,
        theme,
        notifications,
      });

      const user = JSON.parse(sessionStorage.getItem("user") || "{}");

      user.name = username;

      sessionStorage.setItem("user", JSON.stringify(user));

      setMessage("Settings saved successfully!");
    } catch (error) {
      console.error("Settings update failed:", error);
      setMessage("Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // Clear conversations from MongoDB
  const clearHistory = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete all your chat history?",
      )
    ) {
      return;
    }

    try {
      await API.delete("/api/conversations");

      setHistoryCount(0);
      setMessage("All chat history cleared successfully!");
    } catch (error) {
      console.error("Clear history failed:", error);
      setMessage("Unable to clear chat history.");
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading settings...</div>;
  }

  return (
    <div className="p-8 text-white">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <SettingsIcon size={28} className="text-blue-400" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <p className="text-gray-400 mt-2">
          Manage your AgentHub preferences and account settings.
        </p>
      </div>

      {message && (
        <div className="mb-5 p-3 rounded-xl bg-blue-500/10 text-blue-400">
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Settings */}
        <section className="bg-[#151d30] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-blue-400" />
            <h2 className="text-xl font-semibold">Profile Settings</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-400">Username</label>

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-2 bg-[#202b40] border border-white/10 rounded-xl p-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Email</label>

              <input
                type="email"
                value={email}
                disabled
                className="w-full mt-2 bg-[#202b40] border border-white/10 rounded-xl p-3 outline-none opacity-60 cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-[#151d30] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Palette className="text-purple-400" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>

          <label className="text-sm text-gray-400">Theme</label>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="block w-full md:w-64 mt-2 bg-[#202b40] border border-white/10 rounded-xl p-3 outline-none"
          >
            <option value="Dark">Dark</option>
            <option value="Light (Coming Soon)">Light (Coming Soon)</option>
          </select>
        </section>

        {/* Notifications */}
        <section className="bg-[#151d30] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="text-orange-400" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <label className="flex items-center justify-between gap-4">
            <span className="text-gray-300 text-sm">
              Enable notifications preference
            </span>

            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-5 h-5 accent-blue-500"
            />
          </label>
        </section>

        {/* Storage */}
        <section className="bg-[#151d30] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Database className="text-emerald-400" />
            <h2 className="text-xl font-semibold">Storage</h2>
          </div>

          <p className="text-gray-400 text-sm mb-4">
            Conversations stored in MongoDB:{" "}
            <strong className="text-white">{historyCount}</strong>
          </p>

          <button
            onClick={clearHistory}
            className="flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-3 rounded-xl transition"
          >
            <Trash2 size={17} />
            Clear All Chat History
          </button>
        </section>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold transition"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

export default Settings;

/**
 * Settings Panel - Beautiful User Settings Management
 * Comprehensive settings with theme, notifications, privacy, and account management
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Save,
  X,
  Check,
  AlertTriangle,
  Download,
  Upload,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedInput } from '@/components/ui/EnhancedInput';
import { EnhancedSelect } from '@/components/ui/EnhancedSelect';
import { useGlobalStore } from '@/store/globalStore';
import { useUserPreferences } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

const settingsSections: SettingsSection[] = [
  {
    id: 'account',
    title: 'Account',
    description: 'Manage your account information and security',
    icon: User,
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize the look and feel of the app',
    icon: Palette,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Control how and when you receive notifications',
    icon: Bell,
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    description: 'Manage your privacy settings and data',
    icon: Shield,
  },
  {
    id: 'language',
    title: 'Language & Region',
    description: 'Set your language and regional preferences',
    icon: Globe,
  },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  className,
  isOpen,
  onClose
}) => {
  const [activeSection, setActiveSection] = useState('account');
  const [hasChanges, setHasChanges] = useState(false);
  const { user, setTheme, theme } = useGlobalStore();
  const { preferences, updatePreference } = useUserPreferences();

  const handleSave = () => {
    // Save settings
    setHasChanges(false);
    // Show success notification
  };

  const handleReset = () => {
    // Reset to defaults
    setHasChanges(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 border-r bg-gray-50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">Settings</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <nav className="space-y-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors",
                    activeSection === section.id
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <section.icon className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{section.title}</div>
                    <div className="text-xs text-gray-500">{section.description}</div>
                  </div>
                </button>
              ))}
            </nav>

            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Unsaved Changes
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeSection === 'account' && <AccountSettings />}
                {activeSection === 'appearance' && <AppearanceSettings />}
                {activeSection === 'notifications' && <NotificationSettings />}
                {activeSection === 'privacy' && <PrivacySettings />}
                {activeSection === 'language' && <LanguageSettings />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

function AccountSettings() {
  const { user } = useGlobalStore();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h3>
        <p className="text-gray-600">Manage your account information and security settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedInput
              label="Full Name"
              defaultValue={user?.name}
              placeholder="Enter your full name"
            />
            <EnhancedInput
              label="Email"
              type="email"
              defaultValue={user?.email}
              placeholder="your@email.com"
            />
          </div>
          
          <EnhancedInput
            label="Professional Title"
            defaultValue={user?.title}
            placeholder="e.g., Senior Software Engineer"
          />
          
          <EnhancedInput
            label="Location"
            defaultValue={user?.location}
            placeholder="City, Country"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EnhancedInput
            label="Current Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter current password"
            showPasswordToggle
          />
          
          <EnhancedInput
            label="New Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            showPasswordToggle
          />
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Export Data</h4>
              <p className="text-sm text-gray-600">Download a copy of your data</p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
            <div>
              <h4 className="font-medium text-red-900">Delete Account</h4>
              <p className="text-sm text-red-600">Permanently delete your account and data</p>
            </div>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AppearanceSettings() {
  const { theme, setTheme } = useGlobalStore();
  const { preferences, updatePreference } = useUserPreferences();

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Light mode' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark mode' },
    { value: 'system', label: 'System', icon: Monitor, description: 'Follow system preference' },
  ];

  const densityOptions = [
    { value: 'compact', label: 'Compact', description: 'More content, less spacing' },
    { value: 'comfortable', label: 'Comfortable', description: 'Balanced spacing' },
    { value: 'spacious', label: 'Spacious', description: 'More spacing, less content' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Appearance</h3>
        <p className="text-gray-600">Customize how Pathfinder AI looks and feels.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value as any);
                  updatePreference('theme', option.value as any);
                }}
                className={cn(
                  "p-4 border-2 rounded-lg transition-all duration-200",
                  theme === option.value
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <option.icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dashboard Layout
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['grid', 'list'].map((layout) => (
                <button
                  key={layout}
                  onClick={() => updatePreference('dashboard', { 
                    ...preferences.dashboard, 
                    layout: layout as any 
                  })}
                  className={cn(
                    "p-4 border-2 rounded-lg transition-all duration-200 capitalize",
                    preferences.dashboard.layout === layout
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  {layout} View
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Content Density
            </label>
            <div className="space-y-2">
              {densityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updatePreference('dashboard', { 
                    ...preferences.dashboard, 
                    density: option.value as any 
                  })}
                  className={cn(
                    "w-full p-3 border rounded-lg text-left transition-all duration-200",
                    preferences.dashboard.density === option.value
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationSettings() {
  const { preferences, updatePreference } = useUserPreferences();

  const notificationTypes = [
    { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
    { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
    { key: 'inApp', label: 'In-App Notifications', description: 'Notifications within the app' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h3>
        <p className="text-gray-600">Control how and when you receive notifications.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationTypes.map((type) => (
            <div key={type.key} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{type.label}</h4>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
              <button
                onClick={() => updatePreference('notifications', {
                  ...preferences.notifications,
                  [type.key]: !preferences.notifications[type.key as keyof typeof preferences.notifications]
                })}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  preferences.notifications[type.key as keyof typeof preferences.notifications]
                    ? "bg-indigo-600"
                    : "bg-gray-200"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    preferences.notifications[type.key as keyof typeof preferences.notifications]
                      ? "translate-x-6"
                      : "translate-x-1"
                  )}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'jobMatches', label: 'Job Matches', description: 'New job opportunities that match your profile' },
            { key: 'skillUpdates', label: 'Skill Updates', description: 'Updates about skills and learning opportunities' },
            { key: 'marketTrends', label: 'Market Trends', description: 'Industry trends and market insights' },
            { key: 'socialActivity', label: 'Social Activity', description: 'Connection requests and social updates' },
          ].map((category) => (
            <div key={category.key} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={category.key}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                defaultChecked
              />
              <label htmlFor={category.key} className="flex-1">
                <div className="font-medium text-gray-900">{category.label}</div>
                <div className="text-sm text-gray-600">{category.description}</div>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function PrivacySettings() {
  const { preferences, updatePreference } = useUserPreferences();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Privacy & Security</h3>
        <p className="text-gray-600">Manage your privacy settings and data sharing preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data & Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Analytics</h4>
              <p className="text-sm text-gray-600">Help improve the app by sharing usage data</p>
            </div>
            <button
              onClick={() => updatePreference('privacy', {
                ...preferences.privacy,
                analytics: !preferences.privacy.analytics
              })}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                preferences.privacy.analytics ? "bg-indigo-600" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  preferences.privacy.analytics ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Marketing Communications</h4>
              <p className="text-sm text-gray-600">Receive marketing emails and promotional content</p>
            </div>
            <button
              onClick={() => updatePreference('privacy', {
                ...preferences.privacy,
                marketing: !preferences.privacy.marketing
              })}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                preferences.privacy.marketing ? "bg-indigo-600" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  preferences.privacy.marketing ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EnhancedSelect
            label="Profile Visibility"
            options={[
              { value: 'public', label: 'Public', description: 'Visible to everyone' },
              { value: 'connections', label: 'Connections Only', description: 'Visible to your connections' },
              { value: 'private', label: 'Private', description: 'Only visible to you' },
            ]}
            defaultValue="connections"
          />

          <div className="space-y-3">
            {[
              { key: 'showEmail', label: 'Show email address' },
              { key: 'showLocation', label: 'Show location' },
              { key: 'showSalary', label: 'Show salary expectations' },
              { key: 'showSkills', label: 'Show skills and experience' },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={setting.key}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  defaultChecked={setting.key !== 'showEmail'}
                />
                <label htmlFor={setting.key} className="text-sm font-medium text-gray-900">
                  {setting.label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LanguageSettings() {
  const languageOptions = [
    { value: 'en', label: 'English', description: 'English (US)' },
    { value: 'es', label: 'Español', description: 'Spanish' },
    { value: 'fr', label: 'Français', description: 'French' },
    { value: 'de', label: 'Deutsch', description: 'German' },
    { value: 'zh', label: '中文', description: 'Chinese (Simplified)' },
  ];

  const timezoneOptions = [
    { value: 'UTC-8', label: 'Pacific Time (PT)', description: 'UTC-8' },
    { value: 'UTC-5', label: 'Eastern Time (ET)', description: 'UTC-5' },
    { value: 'UTC+0', label: 'Greenwich Mean Time (GMT)', description: 'UTC+0' },
    { value: 'UTC+1', label: 'Central European Time (CET)', description: 'UTC+1' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Language & Region</h3>
        <p className="text-gray-600">Set your language and regional preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Language Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EnhancedSelect
            label="Display Language"
            options={languageOptions}
            defaultValue="en"
          />

          <EnhancedSelect
            label="Timezone"
            options={timezoneOptions}
            defaultValue="UTC-8"
          />

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="autoDetectLocation"
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              defaultChecked
            />
            <label htmlFor="autoDetectLocation" className="text-sm font-medium text-gray-900">
              Auto-detect location for job recommendations
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Regional Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EnhancedSelect
            label="Currency"
            options={[
              { value: 'USD', label: 'US Dollar ($)', description: 'USD' },
              { value: 'EUR', label: 'Euro (€)', description: 'EUR' },
              { value: 'GBP', label: 'British Pound (£)', description: 'GBP' },
              { value: 'CAD', label: 'Canadian Dollar (C$)', description: 'CAD' },
            ]}
            defaultValue="USD"
          />

          <EnhancedSelect
            label="Date Format"
            options={[
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', description: 'US format' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', description: 'European format' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', description: 'ISO format' },
            ]}
            defaultValue="MM/DD/YYYY"
          />
        </CardContent>
      </Card>
    </div>
  );
}

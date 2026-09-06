import React, { useState } from 'react';
import { 
  User, 
  Key, 
  Sliders, 
  ShieldCheck, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  HardDrive, 
  Cpu, 
  Globe, 
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserProfile, ApiKeyItem, ModelConfidenceSettings } from '../../types';
import { INITIAL_API_KEYS, DEFAULT_CONFIDENCE_SETTINGS } from '../../data/mockData';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  initialTab?: 'profile' | 'api-keys' | 'confidence';
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateProfile, initialTab = 'confidence' }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'api-keys' | 'confidence'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Profile Form State
  const [name, setName] = useState(user.name);
  const [organization, setOrganization] = useState(user.organization);
  const [email, setEmail] = useState(user.email);
  const [profileSaved, setProfileSaved] = useState(false);

  // API Keys State
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(INITIAL_API_KEYS);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyRole, setNewKeyRole] = useState<'Admin' | 'Read/Analyze' | 'Inference-Only'>('Read/Analyze');
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Confidence & Inference Settings State
  const [confidenceSettings, setConfidenceSettings] = useState<ModelConfidenceSettings>(DEFAULT_CONFIDENCE_SETTINGS);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      name,
      organization,
      email
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName.trim(),
      keyMasked: `satq_live_${randomSuffix}...${Math.random().toString(36).substring(2, 6)}`,
      role: newKeyRole,
      created: 'Just now',
      lastUsed: 'Never',
      requestsCount: 0
    };

    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName('');
    setIsCreatingKey(false);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  const handleCopyKey = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleSaveConfidence = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Settings Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          System Settings & Model Controls
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure multi-spectral inference thresholds, API tokens, and spatial indexing parameters.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('confidence')}
          className={`py-3 px-4 text-xs font-semibold font-mono flex items-center gap-2 border-b-2 transition-all duration-150 active:scale-[0.98] focus:outline-none ${
            activeTab === 'confidence'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Confidence & Inference Controls</span>
        </button>

        <button
          onClick={() => setActiveTab('api-keys')}
          className={`py-3 px-4 text-xs font-semibold font-mono flex items-center gap-2 border-b-2 transition-all duration-150 active:scale-[0.98] focus:outline-none ${
            activeTab === 'api-keys'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>API Keys & STAC Ingestion</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-4 text-xs font-semibold font-mono flex items-center gap-2 border-b-2 transition-all duration-150 active:scale-[0.98] focus:outline-none ${
            activeTab === 'profile'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Organization</span>
        </button>
      </div>

      {/* TAB 1: CONFIDENCE & INFERENCE CONTROLS */}
      {activeTab === 'confidence' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-teal-500" />
                Neural Segmentation Thresholds
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fine-tune precision vs recall trade-offs for GeoSAM-v3 foundation zero-shot masks.
              </p>
            </div>

            {/* Slider 1: Confidence Threshold */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Minimum Confidence Cutoff Threshold
                </label>
                <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                  {confidenceSettings.detectionThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={confidenceSettings.detectionThreshold}
                onChange={(e) =>
                  setConfidenceSettings({
                    ...confidenceSettings,
                    detectionThreshold: Number(e.target.value)
                  })
                }
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>50% (High Recall / Broad candidate regions)</span>
                <span>99% (High Precision / Low false alarms)</span>
              </div>
            </div>

            {/* Slider 2: Baseline Drift Sensitivity */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Multi-Temporal Drift Sensitivity
                </label>
                <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                  {confidenceSettings.driftSensitivity}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={confidenceSettings.driftSensitivity}
                onChange={(e) =>
                  setConfidenceSettings({
                    ...confidenceSettings,
                    driftSensitivity: Number(e.target.value)
                  })
                }
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Determines how aggressively subtle spectral changes (e.g. seasonal foliage variation vs actual logging) are flagged as deforestation.
              </p>
            </div>

            {/* Cloud Masking Strictness */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Atmospheric Correction & Cloud Masking (s2cloudless)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['loose', 'balanced', 'aggressive'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setConfidenceSettings({
                        ...confidenceSettings,
                        cloudMaskStrictness: level
                      })
                    }
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold capitalize font-mono border transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                      confidenceSettings.cloudMaskStrictness === level
                        ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/50 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Super-Resolution Generative Upscaling
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Upscale 10m Sentinel-2 pixels to 2.5m synthetic GSD using Latent Diffusion
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setConfidenceSettings({
                      ...confidenceSettings,
                      superResolution: !confidenceSettings.superResolution
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative active:scale-[0.98] ${
                    confidenceSettings.superResolution ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      confidenceSettings.superResolution ? 'right-1' : 'left-1'
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Auto-Generate Cloud-Optimized GeoTIFF (COG) Pyramid Headers
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Embed internal overviews for sub-second OGC WMS tiled zoom
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setConfidenceSettings({
                      ...confidenceSettings,
                      autoCogOptimization: !confidenceSettings.autoCogOptimization
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative active:scale-[0.98] ${
                    confidenceSettings.autoCogOptimization ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      confidenceSettings.autoCogOptimization ? 'right-1' : 'left-1'
                    }`}
                  ></div>
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              {settingsSaved && (
                <span className="text-xs font-mono text-teal-600 dark:text-teal-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Parameters synced to inference engine
                </span>
              )}
              <button
                type="button"
                onClick={handleSaveConfidence}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-teal-500/20 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Inference Thresholds</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: API KEYS & STAC INGESTION */}
      {activeTab === 'api-keys' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-teal-500" />
                  Personal & Service Account API Keys
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Authenticate your programmatic STAC queries, Python SDK notebooks, and raster inference scripts.
                </p>
              </div>

              {!isCreatingKey && (
                <button
                  type="button"
                  onClick={() => setIsCreatingKey(true)}
                  className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-teal-500/20 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  <Plus className="w-4 h-4" />
                  <span>Generate New Key</span>
                </button>
              )}
            </div>

            {/* Inline Key Generation Form */}
            {isCreatingKey && (
              <form onSubmit={handleCreateApiKey} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                  Generate Production API Key
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Key Description / Label
                    </label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g. InSAR Ingestion Pipeline"
                      required
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Permission Scope
                    </label>
                    <select
                      value={newKeyRole}
                      onChange={(e) => setNewKeyRole(e.target.value as any)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-teal-500 font-mono"
                    >
                      <option value="Admin">Admin (Full Control)</option>
                      <option value="Read/Analyze">Read/Analyze (STAC + Model Run)</option>
                      <option value="Inference-Only">Inference-Only (No Delete/Export)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingKey(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-150 active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-teal-500 text-slate-950 text-xs font-bold transition-all duration-150 active:scale-[0.98]"
                  >
                    Create Key
                  </button>
                </div>
              </form>
            )}

            {/* Keys List */}
            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {key.name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                        {key.role}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                      <span>{key.keyMasked}</span>
                      <span>•</span>
                      <span>Requests: {key.requestsCount.toLocaleString()}</span>
                      <span>•</span>
                      <span>Last used: {key.lastUsed}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyKey(key.id, key.keyMasked)}
                      className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-500 transition-all duration-150 active:scale-[0.98]"
                      title="Copy Key Token"
                    >
                      {copiedKeyId === key.id ? (
                        <Check className="w-3.5 h-3.5 text-teal-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteKey(key.id)}
                      className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 transition-all duration-150 active:scale-[0.98]"
                      title="Revoke Key"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USER PROFILE & ORGANIZATION */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-teal-500" />
                Researcher Profile & STAC Allocation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Manage your enterprise identity and cloud storage allocations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Organization / University Lab
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Storage Quota Progress Bar */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-teal-500" />
                  Cloud COG Raster Quota
                </span>
                <span className="font-mono text-slate-500">
                  {user.quotaUsedGb} GB / {user.quotaMaxGb} GB ({Math.round((user.quotaUsedGb / user.quotaMaxGb) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full"
                  style={{ width: `${(user.quotaUsedGb / user.quotaMaxGb) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              {profileSaved && (
                <span className="text-xs font-mono text-teal-600 dark:text-teal-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Profile updated successfully
                </span>
              )}
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-teal-500/20 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

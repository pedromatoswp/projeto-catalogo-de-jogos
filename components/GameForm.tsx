"use client";

/**
 * components/GameForm.tsx
 *
 * Reusable form for both creating and editing a game.
 * Receives initialData (for edit mode) and an onSubmit callback.
 * Handles validation and shows a loading state during submission.
 */

import { useState } from "react";
import { Game } from "@/lib/supabase";
import { Save, Image as ImageIcon, Loader2 } from "lucide-react";

// All genres the user can choose from
const GENRES = [
  "FPS",
  "Sports",
  "Battle Royale",
  "Metroidvania",
  "Sandbox",
  "Action/Adventure",
  "RPG",
  "Strategy",
  "Puzzle",
  "Other",
];

// All supported platforms
const PLATFORMS = [
  "PC",
  "PlayStation 5",
  "PlayStation 4",
  "Xbox Series X",
  "Xbox One",
  "Nintendo Switch",
  "Mobile",
  "Multi-platform",
];

// ── Props ────────────────────────────────────────────────────────
type GameFormProps = {
  initialData?: Partial<Game>;               // Pre-filled data (edit mode)
  onSubmit: (data: Omit<Game, "id">) => Promise<void>; // Submit handler
  submitLabel?: string;                      // Button text
};

export default function GameForm({
  initialData = {},
  onSubmit,
  submitLabel = "Save Game",
}: GameFormProps) {
  // Form state — each field mirrors a column in the DB
  const [name, setName] = useState(initialData.name ?? "");
  const [genre, setGenre] = useState(initialData.genre ?? "");
  const [platform, setPlatform] = useState(initialData.platform ?? "");
  const [studioId, setStudioId] = useState(initialData.studio_id?.toString() ?? "1");
  const [releaseYear, setReleaseYear] = useState(
    initialData.release_year?.toString() ?? ""
  );
  const [description, setDescription] = useState(initialData.description ?? "");
  const [imageUrl, setImageUrl] = useState(initialData.image_url ?? "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Validation ───────────────────────────────────────────────
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!genre) newErrors.genre = "Genre is required";
    if (!platform) newErrors.platform = "Platform is required";
    if (!releaseYear) newErrors.releaseYear = "Year is required";
    else if (isNaN(Number(releaseYear)) || Number(releaseYear) < 1970 || Number(releaseYear) > 2030)
      newErrors.releaseYear = "Enter a valid year (1970–2030)";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!imageUrl.trim()) newErrors.imageUrl = "Image URL is required";
    return newErrors;
  };

  // ── Submit Handler ───────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        genre,
        platform,
        release_year: Number(releaseYear),
        description: description.trim(),
        image_url: imageUrl.trim(),
        studio_id: Number(studioId),
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Reusable input class ──────────────────────────────────────
  const inputClass = (field: string) =>
    `w-full bg-slate-700 border rounded-lg px-4 py-2.5 text-white placeholder-slate-400
     focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors text-sm
     ${errors[field] ? "border-red-500" : "border-slate-600"}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ── Name ── */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Game Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. The Legend of Zelda"
          className={inputClass("name")}
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* ── Genre & Platform (side by side on larger screens) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Genre <span className="text-red-400">*</span>
          </label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className={inputClass("genre")}
          >
            <option value="">Select genre...</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {errors.genre && <p className="text-red-400 text-xs mt-1">{errors.genre}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Platform <span className="text-red-400">*</span>
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className={inputClass("platform")}
          >
            <option value="">Select platform...</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.platform && <p className="text-red-400 text-xs mt-1">{errors.platform}</p>}
        </div>
      </div>

      {/* ── Studio & Release Year (side by side) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Studio <span className="text-red-400">*</span>
          </label>
          <select
            value={studioId}
            onChange={(e) => setStudioId(e.target.value)}
            className={inputClass("studioId")}
          >
            <option value="1">EA Sports</option>
            <option value="2">Riot Games</option>
            <option value="3">Epic Games</option>
            <option value="4">2K Sports</option>
            <option value="5">Team Cherry</option>
            <option value="6">Mojang</option>
            <option value="7">Rockstar Games</option>
            <option value="8">Activision</option>
            <option value="9">FromSoftware</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Release Year <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            placeholder="e.g. 2024"
            min={1970}
            max={2030}
            className={inputClass("releaseYear")}
          />
          {errors.releaseYear && <p className="text-red-400 text-xs mt-1">{errors.releaseYear}</p>}
        </div>
      </div>

      {/* ── Description ── */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the game..."
          rows={4}
          className={inputClass("description")}
        />
        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* ── Image URL ── */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-1">
          <ImageIcon className="w-3.5 h-3.5" /> Image URL <span className="text-red-400">*</span>
        </label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/game-cover.jpg"
          className={inputClass("imageUrl")}
        />
        {errors.imageUrl && <p className="text-red-400 text-xs mt-1">{errors.imageUrl}</p>}
        {/* Live image preview */}
        {imageUrl && (
          <div className="mt-2 rounded-lg overflow-hidden h-32 bg-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* ── Submit Button ── */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg
                   bg-green-500 hover:bg-green-400 disabled:bg-green-500/50
                   text-slate-900 font-bold transition-colors text-sm"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

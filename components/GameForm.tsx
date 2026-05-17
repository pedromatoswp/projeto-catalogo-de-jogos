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
import { Save, Image as ImageIcon, Loader2, Play } from "lucide-react";

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
  submitLabel = "Salvar Jogo",
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
  const [trailerUrl, setTrailerUrl] = useState(initialData.trailer_url ?? "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Validation ───────────────────────────────────────────────
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "O nome é obrigatório";
    if (!genre) newErrors.genre = "O gênero é obrigatório";
    if (!platform) newErrors.platform = "A plataforma é obrigatória";
    if (!releaseYear) newErrors.releaseYear = "O ano é obrigatório";
    else if (isNaN(Number(releaseYear)) || Number(releaseYear) < 1970 || Number(releaseYear) > 2030)
      newErrors.releaseYear = "Insira um ano válido (1970–2030)";
    if (!description.trim()) newErrors.description = "A descrição é obrigatória";
    if (!imageUrl.trim()) newErrors.imageUrl = "A URL da imagem é obrigatória";
    if (trailerUrl && !isValidYouTubeUrl(trailerUrl)) newErrors.trailerUrl = "URL do trailer inválida (deve ser do YouTube)";
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
        trailer_url: trailerUrl.trim() || null,
        studio_id: Number(studioId),
      });
    } finally {
      setLoading(false);
    }
  };

  // ── YouTube URL Validator ─────────────────────────────────────
  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
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
          Nome do Jogo <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: The Legend of Zelda"
          className={inputClass("name")}
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* ── Genre & Platform (side by side on larger screens) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Gênero <span className="text-red-400">*</span>
          </label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className={inputClass("genre")}
          >
            <option value="">Selecione o gênero...</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {errors.genre && <p className="text-red-400 text-xs mt-1">{errors.genre}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Plataforma <span className="text-red-400">*</span>
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className={inputClass("platform")}
          >
            <option value="">Selecione a plataforma...</option>
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
            Estúdio <span className="text-red-400">*</span>
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
            Ano de Lançamento <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            placeholder="Ex: 2024"
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
          Descrição <span className="text-red-400">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Breve descrição do jogo..."
          rows={4}
          className={inputClass("description")}
        />
        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* ── Image URL ── */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-1">
          <ImageIcon className="w-3.5 h-3.5" /> URL da Imagem <span className="text-red-400">*</span>
        </label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://exemplo.com/capa-do-jogo.jpg"
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

      {/* ── Trailer URL (Optional) ── */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-1">
          <Play className="w-3.5 h-3.5" /> URL do Trailer (YouTube) <span className="text-gray-500">(opcional)</span>
        </label>
        <input
          type="url"
          value={trailerUrl}
          onChange={(e) => setTrailerUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className={inputClass("trailerUrl")}
        />
        {errors.trailerUrl && <p className="text-red-400 text-xs mt-1">{errors.trailerUrl}</p>}
        <p className="text-xs text-gray-500 mt-1">
          Cole o link do trailer do YouTube para exibir na página do jogo
        </p>
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
        {loading ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}

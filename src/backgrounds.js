export const backgrounds = [
  {
    id: "mother",
    name: "MU/TH/UR",
    code: "CRT-AMB",
    style: {
      background:
        "radial-gradient(ellipse 70% 45% at 50% 10%, #1a1408 0%, transparent 50%), linear-gradient(180deg, #080604 0%, #12100a 50%, #060504 100%)",
    },
    phosphor: "#ffb84a",
    phosphorDim: "#6b4a12",
    phosphorGlow: "rgba(255, 184, 74, 0.5)",
    phosphorSoft: "rgba(255, 184, 74, 0.1)",
    panelBorder: "rgba(255, 184, 74, 0.38)",
    grid: "rgba(255, 184, 74, 0.06)",
    vignette: "rgba(30, 18, 0, 0.55)",
  },
  {
    id: "cassette",
    name: "TAPE DECK",
    code: "SEQ-70S",
    style: {
      background:
        "linear-gradient(180deg, #14110e 0%, #1c1812 40%, #0f0d0a 100%)",
    },
    phosphor: "#e8c49a",
    phosphorDim: "#6b5340",
    phosphorGlow: "rgba(232, 196, 154, 0.45)",
    phosphorSoft: "rgba(232, 196, 154, 0.1)",
    panelBorder: "rgba(196, 165, 116, 0.4)",
    grid: "rgba(196, 165, 116, 0.05)",
    vignette: "rgba(20, 14, 8, 0.6)",
  },
  {
    id: "colony",
    name: "COLONY NET",
    code: "LINK-BLU",
    style: {
      background:
        "radial-gradient(ellipse 90% 60% at 0% 100%, #0a1820 0%, transparent 50%), linear-gradient(165deg, #030608 0%, #0a1218 55%, #040608 100%)",
    },
    phosphor: "#5ad4e6",
    phosphorDim: "#1e4a52",
    phosphorGlow: "rgba(90, 212, 230, 0.5)",
    phosphorSoft: "rgba(90, 212, 230, 0.1)",
    panelBorder: "rgba(90, 212, 230, 0.35)",
    grid: "rgba(90, 212, 230, 0.06)",
    vignette: "rgba(0, 16, 24, 0.55)",
  },
  {
    id: "mono",
    name: "MONO CRT",
    code: "CRT-MON",
    style: {
      background:
        "radial-gradient(ellipse 80% 50% at 50% 0%, #141618 0%, transparent 55%), linear-gradient(180deg, #060708 0%, #0e1012 45%, #050608 100%)",
    },
    phosphor: "#c8d4dc",
    phosphorDim: "#4a5560",
    phosphorGlow: "rgba(200, 212, 220, 0.45)",
    phosphorSoft: "rgba(200, 212, 220, 0.1)",
    panelBorder: "rgba(200, 212, 220, 0.32)",
    grid: "rgba(200, 212, 220, 0.05)",
    vignette: "rgba(8, 12, 16, 0.55)",
  },
  {
    id: "ion",
    name: "ION DRIVE",
    code: "PLS-VIO",
    style: {
      background:
        "radial-gradient(ellipse 85% 55% at 80% 20%, #1e1030 0%, transparent 50%), linear-gradient(180deg, #08060c 0%, #120e18 50%, #060408 100%)",
    },
    phosphor: "#b794f6",
    phosphorDim: "#4c3568",
    phosphorGlow: "rgba(183, 148, 246, 0.48)",
    phosphorSoft: "rgba(183, 148, 246, 0.1)",
    panelBorder: "rgba(183, 148, 246, 0.35)",
    grid: "rgba(183, 148, 246, 0.05)",
    vignette: "rgba(16, 8, 24, 0.55)",
  },
  {
    id: "custom",
    name: "CUSTOM",
    code: "USR-DEF",
    isCustom: true,
    style: {
      background:
        "radial-gradient(ellipse 75% 55% at 50% 0%, #18141a 0%, transparent 50%), linear-gradient(180deg, #060608 0%, #100e14 50%, #050508 100%)",
    },
    phosphor: "#e8a8c8",
    phosphorDim: "#6b4a58",
    phosphorGlow: "rgba(232, 168, 200, 0.48)",
    phosphorSoft: "rgba(232, 168, 200, 0.1)",
    panelBorder: "rgba(232, 168, 200, 0.35)",
    grid: "rgba(232, 168, 200, 0.05)",
    vignette: "rgba(18, 10, 16, 0.55)",
  },
];

export const DEFAULT_CUSTOM_ACCENT = "#e8a8c8";

export const SESSION_PRESETS = [15, 25, 30, 45, 60, 90];

function hexToRgb(hex) {
  const raw = hex.replace("#", "");
  const value =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  const num = Number.parseInt(value, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function mixChannel(value, factor) {
  return Math.max(0, Math.min(255, Math.round(value * factor)));
}

/** Build a CUSTOM profile from a user-picked accent hex. */
export function buildCustomBackground(accentHex) {
  const base = backgrounds.find((bg) => bg.id === "custom");
  const { r, g, b } = hexToRgb(accentHex);
  const dim = `rgb(${mixChannel(r, 0.38)}, ${mixChannel(g, 0.38)}, ${mixChannel(b, 0.38)})`;

  return {
    ...base,
    phosphor: accentHex,
    phosphorDim: dim,
    phosphorGlow: `rgba(${r}, ${g}, ${b}, 0.5)`,
    phosphorSoft: `rgba(${r}, ${g}, ${b}, 0.1)`,
    panelBorder: `rgba(${r}, ${g}, ${b}, 0.38)`,
    grid: `rgba(${r}, ${g}, ${b}, 0.06)`,
    vignette: `rgba(${mixChannel(r, 0.12)}, ${mixChannel(g, 0.1)}, ${mixChannel(b, 0.14)}, 0.55)`,
    style: {
      background: `radial-gradient(ellipse 75% 55% at 50% 0%, rgba(${mixChannel(r, 0.18)}, ${mixChannel(g, 0.14)}, ${mixChannel(b, 0.2)}, 1) 0%, transparent 50%), linear-gradient(180deg, #060608 0%, rgb(${mixChannel(r, 0.08)}, ${mixChannel(g, 0.06)}, ${mixChannel(b, 0.1)}) 50%, #050508 100%)`,
    },
  };
}

export function getBackground(id, customAccent) {
  if (id === "custom" && customAccent) {
    return buildCustomBackground(customAccent);
  }

  const match = backgrounds.find((bg) => bg.id === id);
  if (match) {
    return match;
  }

  const legacyMap = {
    nostromo: "mono",
    hazard: "ion",
    cosmos: "mono",
    ember: "ion",
    tide: "colony",
    bloom: "mother",
    dawn: "cassette",
    slate: "mono",
    midnight: "mono",
    aurora: "colony",
    sunset: "ion",
    forest: "colony",
  };
  const resolved = backgrounds.find((bg) => bg.id === legacyMap[id]) ?? backgrounds[0];
  if (resolved.id === "custom" && customAccent) {
    return buildCustomBackground(customAccent);
  }
  return resolved;
}

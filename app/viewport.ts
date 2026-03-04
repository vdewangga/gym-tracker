export function generateViewport() {
  return {
    viewport: {
      width: "device-width",
      initialScale: 1,
    },
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#f7f7f8" },
      { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    ],
  };
}

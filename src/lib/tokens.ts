export const colors = {
  appBg: '#080808',
  surface: '#1C1C1E',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.28)',
  textMuted: 'rgba(255,255,255,0.22)',
  divider: 'rgba(255,255,255,0.05)',
  accentStart: '#FF9A3C',
  accentEnd: '#C05FFF',
  accentGradient: 'linear-gradient(90deg, #FF9A3C, #C05FFF)',
}

export const productGradients: Record<string, string> = {
  canvas: 'linear-gradient(160deg, #1EEEA0 0%, #0CA865 45%, #024D2E 100%)',
  calendar: 'linear-gradient(160deg, #FF9A3C 0%, #E84B1A 45%, #8B1A00 100%)',
  stationery: 'linear-gradient(160deg, #5B8FFF 0%, #1E3FCC 45%, #050F5E 100%)',
  magnet: 'linear-gradient(160deg, #C05FFF 0%, #7B15E8 45%, #330070 100%)',
  prints: 'linear-gradient(160deg, #FF3D8F 0%, #C40052 45%, #5C0027 100%)',
}

export const easing = {
  ios: [0.32, 0.72, 0, 1] as [number, number, number, number],
  spring: { stiffness: 180, damping: 18 },
}

export const filmGrainSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

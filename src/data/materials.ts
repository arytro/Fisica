import { Material } from '../types/physics';

export const MATERIALS: Record<string, Material> = {
  hielo: {
    id: 'hielo',
    name: 'Hielo Pulido',
    description: 'Superficie extremadamente lisa con microscópica película de agua que reduce drásticamente el rozamiento.',
    muS: 0.10,
    muK: 0.03,
    color: '#38bdf8',
    surfacePattern: 'radial-gradient(ellipse at top, #bae6fd 0%, #38bdf8 40%, #0284c7 100%)',
    accentColor: '#38bdf8',
    realWorldContext: 'Pistas de patinaje, glaciares, pavimento congelado.'
  },
  madera: {
    id: 'madera',
    name: 'Madera Cepillada',
    description: 'Superficie tradicional de laboratorio con rugosidad intermedia y respuesta predecible.',
    muS: 0.40,
    muK: 0.30,
    color: '#d97706',
    surfacePattern: 'repeating-linear-gradient(45deg, #78350f, #78350f 12px, #92400e 12px, #92400e 24px)',
    accentColor: '#fbbf24',
    realWorldContext: 'Mesas de trabajo, pisos de parqué, rampas de carga.'
  },
  cemento: {
    id: 'cemento',
    name: 'Cemento / Hormigón',
    description: 'Superficie granular porosa con asperezas prominentes que traban fuertemente el contacto.',
    muS: 0.65,
    muK: 0.50,
    color: '#94a3b8',
    surfacePattern: 'radial-gradient(#475569 15%, transparent 16%), radial-gradient(#334155 15%, transparent 16%)',
    accentColor: '#94a3b8',
    realWorldContext: 'Pavimento de carreteras, pisos de talleres industriales del politécnico.'
  },
  metal: {
    id: 'metal',
    name: 'Metal / Acero Seco',
    description: 'Contacto metal-madera o acero pulido sin lubricante con microsoldaduras frías en las asperezas.',
    muS: 0.74,
    muK: 0.57,
    color: '#cbd5e1',
    surfacePattern: 'linear-gradient(90deg, #334155 0%, #64748b 25%, #94a3b8 50%, #64748b 75%, #334155 100%)',
    accentColor: '#38bdf8',
    realWorldContext: 'Rieles industriales, tornillos mecánicos, maquinaria pesada.'
  },
  goma: {
    id: 'goma',
    name: 'Goma / Caucho Antideslizante',
    description: 'Material elastómero de máxima adherencia mecánica y deformación superficial microscópica.',
    muS: 0.90,
    muK: 0.80,
    color: '#1e293b',
    surfacePattern: 'repeating-linear-gradient(0deg, #0f172a, #0f172a 4px, #1e293b 4px, #1e293b 8px)',
    accentColor: '#f97316',
    realWorldContext: 'Neumáticos de vehículos, suelas de calzado de seguridad, cintas transportadoras.'
  }
};

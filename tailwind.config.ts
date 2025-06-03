
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'orbitron': ['Orbitron', 'monospace'],
				'inter': ['Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				gaming: {
					bg: '#0a0a0f',
					card: '#1a1a2e',
					accent: '#00ffff',
					orange: '#ff6b35',
					purple: '#8b5cf6',
					green: '#10b981',
				},
				valorant: {
					red: '#ff4655',
					blue: '#389bff',
					cyan: '#00ffff',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff'
					},
					'50%': { 
						boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff'
					}
				},
				'neon-border': {
					'0%, 100%': { 
						borderColor: '#00ffff',
						boxShadow: '0 0 5px #00ffff'
					},
					'50%': { 
						borderColor: '#ff6b35',
						boxShadow: '0 0 10px #ff6b35'
					}
				}
			},
			animation: {
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'neon-border': 'neon-border 3s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

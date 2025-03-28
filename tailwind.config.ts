
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
        // Cyber theme colors - original
        cyber: {
          background: '#0F0F17',
          foreground: '#F8FAFC',
          muted: '#1A1A27',
          primary: '#38BDF8',
          secondary: '#00FFD1',
          accent: '#0EA5E9',
          destructive: '#FF3A5E',
          border: '#2A2A3C',
          // Additional custom colors
          dark: '#0E0E14',
          'dark-blue': '#101825',
          blue: '#00BFFF',
          'blue-glow': '#33D6FF',
          purple: '#9000FF',
          green: '#50FA7B',
          'green-glow': '#76FFB5',
          red: '#FF375F',
          'red-glow': '#FF6B87',
          yellow: '#FFCC00',
          'yellow-glow': '#FFE066',
        }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
      boxShadow: {
        neon: '0 0 5px theme(colors.cyber.primary), 0 0 20px rgba(56, 189, 248, 0.2)',
        neonRed: '0 0 5px theme(colors.cyber.destructive), 0 0 20px rgba(255, 58, 94, 0.2)',
        neonGreen: '0 0 5px theme(colors.cyber.secondary), 0 0 20px rgba(0, 255, 209, 0.2)',
        'neon-blue': '0 0 5px theme(colors.cyber.blue), 0 0 20px rgba(0, 191, 255, 0.2)',
        'neon-purple': '0 0 5px theme(colors.cyber.purple), 0 0 20px rgba(144, 0, 255, 0.2)',
        'neon-green': '0 0 5px theme(colors.cyber.green), 0 0 20px rgba(80, 250, 123, 0.2)',
        'neon-red': '0 0 5px theme(colors.cyber.red), 0 0 20px rgba(255, 55, 95, 0.2)',
        'neon-yellow': '0 0 5px theme(colors.cyber.yellow), 0 0 20px rgba(255, 204, 0, 0.2)',
      },
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
        'pulse-neon': {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 5px theme(colors.cyber.primary), 0 0 20px rgba(56, 189, 248, 0.3)'
          },
          '50%': { 
            opacity: '0.8',
            boxShadow: '0 0 10px theme(colors.cyber.primary), 0 0 30px rgba(56, 189, 248, 0.5)' 
          },
        },
        'glow-line-horizontal': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        'scan-line': {
          '0%': {
            transform: 'translateY(0%)',
          },
          '100%': {
            transform: 'translateY(100%)',
          },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-5px, 5px)' },
          '40%': { transform: 'translate(-5px, -5px)' },
          '60%': { transform: 'translate(5px, 5px)' },
          '80%': { transform: 'translate(5px, -5px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'hue-rotate': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'radar-beam': {
          '0%': { 
            transform: 'rotate(0deg)',
            opacity: '0',
          },
          '100%': { 
            transform: 'rotate(360deg)',
            opacity: '1',
          },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'scanning': {
          '0%': { transform: 'translateY(0)', opacity: '0.7' },
          '50%': { transform: 'translateY(100vh)', opacity: '0.3' },
          '100%': { transform: 'translateY(0)', opacity: '0.7' },
        },
        'scan-grid': {
          '0%': { transform: 'translateY(-100%) rotate(5deg)' },
          '100%': { transform: 'translateY(1000%) rotate(5deg)' },
        },
        'pulse-grid': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-neon': 'pulse-neon 2s infinite',
        'glow-line-horizontal': 'glow-line-horizontal 2s ease infinite',
        'scan-line': 'scan-line 2s ease-in-out infinite',
        'glitch': 'glitch 0.5s ease infinite',
        'float': 'float 3s ease-in-out infinite',
        'hue-rotate': 'hue-rotate 10s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-out': 'fade-out 0.5s ease-out',
        'scale-up': 'scale-up 0.3s ease-out',
        'radar-beam': 'radar-beam 4s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'scanning': 'scanning 2s ease-in-out infinite',
        'scan-grid': 'scan-grid 3s linear infinite',
        'pulse-grid': 'pulse-grid 4s infinite',
			},
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(to right, rgba(0, 191, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 191, 255, 0.05) 1px, transparent 1px)',
      },
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

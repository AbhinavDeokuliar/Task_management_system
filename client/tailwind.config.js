// Add these to your existing tailwind.config.js file

module.exports = {
	theme: {
		extend: {
			animation: {
				float: "float 6s ease-in-out infinite",
				"float-delayed": "float 8s ease-in-out 1s infinite",
				"float-slow": "float 10s ease-in-out 2s infinite",
				"fade-in": "fadeIn 0.5s ease-out forwards",
				"fade-in-up": "fadeInUp 0.5s ease-out forwards",
				"pulse-slow": "pulse 3s infinite",
			},
			keyframes: {
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-20px)" },
				},
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				fadeInUp: {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
			},
			scale: {
				103: "1.03",
			},
		},
	},
};

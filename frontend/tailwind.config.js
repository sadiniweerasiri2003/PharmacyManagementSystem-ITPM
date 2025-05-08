module.exports = {
  content: [
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      keyframes: {
        popup: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        }
      },
      animation: {
        popup: 'popup 0.3s ease-out',
        progress: 'progress 1.8s ease-in-out',
      },
    },
  },
  plugins: [],
}

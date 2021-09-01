// vite.config.js
const path = require('path')
const { defineConfig } = require('vite')


module.exports = defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/lib/index.js'),
            name: 'Strive',
            formats: ["cjs", "iife"],
            fileName: (format) => `Strive.${format}.js`
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['p5'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    p5: 'p5'
                }
            }
        }
    }
})
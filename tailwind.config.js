/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ['./App.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#EDF0FF',
                    100: '#D8E2FF',
                    200: '#ADC6FF',
                    300: '#80ABFF',
                    400: '#4B8EFF',
                    500: '#007AFF', // main
                    600: '#0072F0',
                    700: '#005BC1',
                    800: '#004493',
                    900: '#002E69',
                    950: '#001A41',
                },

                secondary: {
                    50: '#FFEDE6',
                    100: '#FFDBCC',
                    200: '#FFB693',
                    300: '#FF8C52',
                    400: '#F26500',
                    500: '#FF6B00', // main
                    600: '#C85300',
                    700: '#A04100',
                    800: '#7A3000',
                    900: '#561F00',
                    950: '#351000',
                },

                tertiary: {
                    50: '#F0F0F3',
                    100: '#E2E2E5',
                    200: '#C6C6C9',
                    300: '#AAABAD',
                    400: '#909193',
                    500: '#1A1C1E', // main (note: darker than usual 500)
                    600: '#767779',
                    700: '#5D5E61',
                    800: '#454749',
                    900: '#2F3133',
                },

                neutral: {
                    50: '#E9F1FF',
                    100: '#D4E4FA',
                    200: '#B9C8DE',
                    300: '#9DACC2',
                    400: '#8392A6',
                    500: '#94A3B8', // main
                    600: '#69788C',
                    700: '#516072',
                    800: '#39485A',
                    900: '#233143',
                    950: '#0D1C2D',
                },
                background: {
                    100: '#051424',
                    200: '#122131',
                },
            },
            fontFamily: {
                heading: ['SpaceGrotesk_700Bold', 'SpaceGrotesk_600SemiBold'],
                label: ['SpaceGrotesk_600SemiBold'],
                body: ['Inter_400Regular'],
                bodyMedium: ['Inter_500Medium'],
            },
        },
    },
    plugins: [],
}

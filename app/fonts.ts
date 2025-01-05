import localFont from 'next/font/local'

const notoSansSC = localFont({
    src: [
        {
            path: '../public/fonts/noto/NotoSansSC-Thin.ttf',
            weight: '100',
            style: 'normal',
        },
        {
            path: '../public/fonts/noto/NotoSansSC-ExtraLight.ttf',
            weight: '200',
            style: 'normal',
        },
        {
            path: '../public/fonts/noto/NotoSansSC-Light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../public/fonts/noto/NotoSansSC-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/noto/NotoSansSC-Medium.ttf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../public/fonts/noto/NotoSansSC-SemiBold.ttf',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../public/fonts/noto/NotoSansSC-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../public/fonts/noto/NotoSansSC-ExtraBold.ttf',
            weight: '800',
            style: 'normal',
        },
        {
            path: '../public/fonts/noto/NotoSansSC-Black.ttf',
            weight: '900',
            style: 'normal',
        },
    ],
    variable: '--font-noto-sans-sc'
})

export { notoSansSC }


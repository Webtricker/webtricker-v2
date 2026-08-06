import localFont from 'next/font/local'

const galleryModern = localFont({
  src: [
    {
      path: '../../../public/fonts/gallerymodern_webfont.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/gallerymodern_webfont.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/gallerymodern_webfont.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
})

export default galleryModern
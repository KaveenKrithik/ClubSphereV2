import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ClubSphere',
    short_name: 'ClubSphere',
    description: 'Discover and join hackathons, workshops, and clubs at your college',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/cslogo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/cslogo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

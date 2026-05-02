import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://solmint.space'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contatti`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/servizi`,
      lastModified: new Date(),
    },
  ]
}
type TRickAndMortyApiUrl = `https://rickandmortyapi.com/api/${string}`

export type TApiCharacter = {
  id: number
  name: string
  status: string
  species: string
  type: string
  gender: string
  origin: {
    name: string
    url: TRickAndMortyApiUrl
  }
  location: {
    name: string
    url: TRickAndMortyApiUrl
  }
  image: `${TRickAndMortyApiUrl}.jpeg`
  episode: TRickAndMortyApiUrl[]
  url: TRickAndMortyApiUrl
  created: string // '2017-11-04T18:48:46.250Z'
}

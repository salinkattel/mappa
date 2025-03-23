export interface Restaurant {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  rating: number;
  imageUrl: string;
  website?: string;
  phone?: string;
  difficulty: string;
}

export const destinations = {
  shorttrips: [
    {
      id: "nagarkot",
      name: "Nagarkot",
      description:
        "A hill station renowned for panoramic Himalayan views, especially at sunrise and sunset.",
      bestTime: "October to March",
      estimatedTime: "1-2 days",
      rating: 4.7,
      imageUrl: "nagarkot.jpg",
      coordinates: {
        lat: 27.7172,
        lng: 85.5231,
      },
    },
    {
      id: "dhulikhel",
      name: "Dhulikhel",
      description:
        "A historic town offering traditional Newari culture and stunning mountain vistas.",
      bestTime: "September to November",
      estimatedTime: "1 day",
      rating: 4.6,
      imageUrl: "dhulikhel.jpg",
      coordinates: {
        lat: 27.6192,
        lng: 85.5555,
      },
    },
    {
      id: "chandragiri",
      name: "Chandragiri Hills",
      description:
        "Accessible by cable car, this spot provides panoramic views of Kathmandu Valley and the Himalayas.",
      bestTime: "Year-round",
      estimatedTime: "Half-day to 1 day",
      rating: 4.5,
      imageUrl: "chandragiri.jpg",
      coordinates: {
        lat: 27.6568,
        lng: 85.2,
      },
    },
  ],
  trekking: [
    {
      id: "shivapuri",
      name: "Shivapuri National Park Trek",
      difficulty: "Moderate",
      duration: "1-2 days",
      elevation: "2,732m",
      rating: 4.6,
      imageUrl: "shivapuri.jpg",
      coordinates: {
        lat: 27.8167,
        lng: 85.3833,
      },
    },
    {
      id: "chisapani",
      name: "Chisapani-Nagarkot Trek",
      difficulty: "Moderate",
      duration: "2-3 days",
      elevation: "2,175m",
      rating: 4.7,
      imageUrl: "chisapani.jpg",
      coordinates: {
        lat: 27.7583,
        lng: 85.45,
      },
    },
    {
      id: "phulchowki",
      name: "Phulchowki Hill Trek",
      difficulty: "Moderate",
      duration: "1 day",
      elevation: "2,782m",
      rating: 4.5,
      imageUrl: "phulchowki.jpg",
      coordinates: {
        lat: 27.5747,
        lng: 85.4,
      },
    },
  ],
  cultural: [
    {
      id: "pashupatinath",
      name: "Pashupatinath Temple",
      type: "UNESCO World Heritage Site",
      bestTime: "February to April",
      rating: 4.8,
      imageUrl: "pashupati.jpg",
      coordinates: {
        lat: 27.7109,
        lng: 85.3486,
      },
    },
    {
      id: "boudhanath",
      name: "Boudhanath Stupa",
      type: "Buddhist Monument",
      bestTime: "October to March",
      rating: 4.7,
      imageUrl: "boudha.jpg",
      coordinates: {
        lat: 27.7215,
        lng: 85.362,
      },
    },
    {
      id: "swayambhunath",
      name: "Swayambhunath (Monkey Temple)",
      type: "Historical Religious Site",
      bestTime: "Year-round",
      rating: 4.6,
      imageUrl: "swayambhunath.jpg",
      coordinates: {
        lat: 27.7147,
        lng: 85.2904,
      },
    },
  ],
  food: [
    {
      id: "lama_sekuwa",
      name: "Lama Sekuwa Corner",
      specialty: "Sekuwa(Pork,chiken,buff)",
      region: "Kathmandu",
      rating: 4.7,
      imageUrl: "lamasekuwa.jpg",
      coordinates: {
        lat: 27.7041,
        lng: 85.3145,
      },
    },
    {
      id: "yangling",
      name: "Yangling Tibetan Restaurant",
      specialty: "Traditional Tibetan and Nepali Dishes",
      region: "Kathmandu",
      rating: 4.6,
      imageUrl: "yangling.jpg",
      coordinates: {
        lat: 27.7154,
        lng: 85.3123,
      },
    },
    {
      id: "newa_lahana",
      name: "Newa Lahana",
      specialty: "Newari Cuisine",
      region: "Kirtipur",
      rating: 4.8,
      imageUrl: "lahana.jpg",
      coordinates: {
        lat: 27.6747,
        lng: 85.2722,
      },
    },
  ],
};

export const mockRestaurants: Restaurant[] = [
  {
    id: "everest-base-camp",
    name: "Everest Base Camp",
    address: "Khumbu, Solukhumbu District, Nepal",
    location: { lat: 28.0025, lng: 86.855 },
    rating: 4.9,
    imageUrl:
      "/placeholder.svg?height=200&width=350&text=Everest%20Base%20Camp",
    website: "https://example.com/everest",
    phone: "+977-1-4000000",
    difficulty: "Hard",
  },
  {
    id: "annapurna-circuit",
    name: "Annapurna Circuit",
    address: "Annapurna Conservation Area, Nepal",
    location: { lat: 28.5971, lng: 83.9542 },
    rating: 4.8,
    imageUrl: "/placeholder.svg?height=200&width=350&text=Annapurna%20Circuit",
    website: "https://example.com/annapurna",
    phone: "+977-1-4111111",
    difficulty: "Moderate",
  },
  {
    id: "langtang-valley",
    name: "Langtang Valley",
    address: "Langtang National Park, Nepal",
    location: { lat: 28.2139, lng: 85.6178 },
    rating: 4.7,
    imageUrl: "/placeholder.svg?height=200&width=350&text=Langtang%20Valley",
    website: "https://example.com/langtang",
    phone: "+977-1-4222222",
    difficulty: "Moderate",
  },
  {
    id: "kathmandu-durbar-square",
    name: "Kathmandu Durbar Square",
    address: "Kathmandu 44600, Nepal",
    location: { lat: 27.7048, lng: 85.3068 },
    rating: 4.6,
    imageUrl:
      "/placeholder.svg?height=200&width=350&text=Kathmandu%20Durbar%20Square",
    website: "https://example.com/kathmandu-durbar",
    phone: "+977-1-4333333",
    difficulty: "Easy",
  },
  {
    id: "bhaktapur",
    name: "Bhaktapur",
    address: "Bhaktapur, Nepal",
    location: { lat: 27.671, lng: 85.4298 },
    rating: 4.7,
    imageUrl: "/placeholder.svg?height=200&width=350&text=Bhaktapur",
    website: "https://example.com/bhaktapur",
    phone: "+977-1-4444444",
    difficulty: "Easy",
  },
  {
    id: "patan-durbar-square",
    name: "Patan Durbar Square",
    address: "Patan 44700, Nepal",
    location: { lat: 27.6766, lng: 85.3241 },
    rating: 4.5,
    imageUrl:
      "/placeholder.svg?height=200&width=350&text=Patan%20Durbar%20Square",
    website: "https://example.com/patan-durbar",
    phone: "+977-1-4555555",
    difficulty: "Easy",
  },
];

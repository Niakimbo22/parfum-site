export interface Perfume {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  stock: number;
  olfactory_family: string;
  occasion: string;
  season: string;
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
  image_url: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

export const MOCK_PERFUMES: Perfume[] = [
  {
    id: '1',
    name: "Bois d'Argent",
    brand: "Les 2 As",
    description: "Une fragrance boisée et mystérieuse, véritable icône de notre collection.",
    price: 250,
    stock: 12,
    olfactory_family: "Boisé",
    occasion: "Soirée",
    season: "Hiver",
    top_notes: ["Iris", "Baies de genièvre"],
    heart_notes: ["Myrrhe", "Patchouli"],
    base_notes: ["Musc", "Ambre", "Miel"],
    image_url: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80"
  },
  {
    id: '2',
    name: "Soleil Blanc",
    brand: "Les 2 As",
    description: "Un ambré floral solaire qui évoque les îles lointaines et le sable chaud.",
    price: 280,
    stock: 5,
    olfactory_family: "Ambré Floral",
    occasion: "Vacances",
    season: "Été",
    top_notes: ["Pistache", "Bergamote"],
    heart_notes: ["Ylang-ylang", "Jasmin"],
    base_notes: ["Noix de coco", "Ambre"],
    image_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80"
  },
  {
    id: '3',
    name: "Oud Wood",
    brand: "Les 2 As",
    description: "Rare. Exotique. Distinctif. L'un des ingrédients les plus rares au monde.",
    price: 320,
    stock: 2,
    olfactory_family: "Oriental Boisé",
    occasion: "Professionnel",
    season: "Automne",
    top_notes: ["Bois de rose", "Cardamome"],
    heart_notes: ["Oud", "Santal"],
    base_notes: ["Ambre", "Vanille"],
    image_url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80"
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    order_number: "CMD-2AS-001",
    customer_name: "Jean Dupont",
    customer_email: "jean@example.com",
    total_amount: 250,
    status: 'delivered',
    created_at: '2024-03-20T10:30:00Z'
  },
  {
    id: '2',
    order_number: "CMD-2AS-002",
    customer_name: "Marie Curie",
    customer_email: "marie@example.com",
    total_amount: 600,
    status: 'pending',
    created_at: '2024-03-21T14:45:00Z'
  }
];

import { Product } from "@/types/Product";

export const mockProducts: Product[] = [{
    id: 1,
    title: "Gaming Laptop",
    description: "High-performance laptop for gaming",
    price: 999.99,
    image: "images/laptop.jpg",
    category: "Electronics",
    rating: {
      rate: 4.5,
      count: 10,
    },
},
{
    id: 2,
    title: "Smartphone",
    description: "Latest smartphone with advanced features",
    price: 699.99,
    image: "images/phone.jpg",
    category: "Electronics",
    rating: {
      rate: 4.2,
      count: 8,
    }    
}
];
import axios from 'axios';
import { products, categories } from './data';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service - simulates real API calls with realistic delays
const api = {
  getProducts: async (filters = {}) => {
    await delay(600);
    let result = [...products];

    if (filters.category && filters.category !== 'All') {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (filters.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.minRating) {
      result = result.filter(p => p.rating >= filters.minRating);
    }
    if (filters.sort) {
      switch (filters.sort) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    return { data: result, total: result.length };
  },

  getProduct: async (id) => {
    await delay(400);
    const product = products.find(p => p.id === parseInt(id));
    if (!product) throw new Error('Product not found');
    const related = products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
    return { data: product, related };
  },

  getFeatured: async () => {
    await delay(500);
    return { data: products.filter(p => p.featured) };
  },

  getTrending: async () => {
    await delay(500);
    return { data: products.filter(p => p.trending) };
  },

  getCategories: async () => {
    await delay(300);
    return { data: categories };
  },

  login: async (email, password) => {
    await delay(800);
    if (email && password.length >= 6) {
      return {
        data: {
          id: 1,
          name: email.split('@')[0],
          email,
          token: 'sk_' + Math.random().toString(36).substr(2, 24),
        }
      };
    }
    throw new Error('Invalid credentials');
  },

  signup: async (name, email, password) => {
    await delay(800);
    if (name && email && password.length >= 6) {
      return {
        data: {
          id: Date.now(),
          name,
          email,
          token: 'sk_' + Math.random().toString(36).substr(2, 24),
        }
      };
    }
    throw new Error('Invalid signup data');
  },

  placeOrder: async (orderData) => {
    await delay(1200);
    return {
      data: {
        orderId: 'SK-' + Date.now().toString(36).toUpperCase(),
        status: 'confirmed',
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      }
    };
  },
};

export default api;

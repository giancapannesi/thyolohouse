import * as fs from 'node:fs';
import * as path from 'node:path';

// Types
export interface Room {
  name: string;
  slug: string;
  type: 'suite' | 'cottage';
  location: 'main_house' | 'poolside';
  description: string;
  amenities: string[];
  capacity: number;
  images: string[];
  board_options: string[];
  price_from: number | null;
  featured: boolean;
}

export interface MenuItem {
  name: string;
  description: string;
  dietary: string[];
  price: number | null;
}

export interface MenuCategory {
  name: string;
  description: string;
  items: MenuItem[];
}

export interface Menu {
  intro: string;
  categories: MenuCategory[];
}

export interface Experience {
  name: string;
  slug: string;
  icon: string;
  description: string;
  duration: string;
  includes: string[];
  images: string[];
  booking_required: boolean;
  featured: boolean;
}

export interface Testimonial {
  name: string;
  source: string;
  rating: number;
  text: string;
  date: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
}

// Cache
let roomsCache: Room[] | null = null;
let menuCache: Menu | null = null;
let experiencesCache: Experience[] | null = null;
let testimonialsCache: Testimonial[] | null = null;
let galleryCache: GalleryImage[] | null = null;

const contentDir = path.join(process.cwd(), 'src/content');

// Rooms
export function getAllRooms(): Room[] {
  if (roomsCache) return roomsCache;
  const roomsDir = path.join(contentDir, 'rooms');
  const files = fs.readdirSync(roomsDir).filter(f => f.endsWith('.json'));
  roomsCache = files.map(f => {
    const data = JSON.parse(fs.readFileSync(path.join(roomsDir, f), 'utf-8'));
    return data as Room;
  });
  return roomsCache;
}

export function getRoomBySlug(slug: string): Room | undefined {
  return getAllRooms().find(r => r.slug === slug);
}

export function getFeaturedRooms(): Room[] {
  return getAllRooms().filter(r => r.featured);
}

// Menu
export function getMenu(): Menu {
  if (menuCache) return menuCache;
  menuCache = JSON.parse(fs.readFileSync(path.join(contentDir, 'menu/menu.json'), 'utf-8'));
  return menuCache!;
}

// Experiences
export function getAllExperiences(): Experience[] {
  if (experiencesCache) return experiencesCache;
  const expDir = path.join(contentDir, 'experiences');
  const files = fs.readdirSync(expDir).filter(f => f.endsWith('.json'));
  experiencesCache = files.map(f => {
    const data = JSON.parse(fs.readFileSync(path.join(expDir, f), 'utf-8'));
    return data as Experience;
  });
  return experiencesCache;
}

export function getExperienceBySlug(slug: string): Experience | undefined {
  return getAllExperiences().find(e => e.slug === slug);
}

export function getFeaturedExperiences(): Experience[] {
  return getAllExperiences().filter(e => e.featured);
}

// Testimonials
export function getTestimonials(): Testimonial[] {
  if (testimonialsCache) return testimonialsCache;
  testimonialsCache = JSON.parse(fs.readFileSync(path.join(contentDir, 'testimonials.json'), 'utf-8'));
  return testimonialsCache!;
}

// Gallery
export function getGallery(): GalleryImage[] {
  if (galleryCache) return galleryCache;
  galleryCache = JSON.parse(fs.readFileSync(path.join(contentDir, 'gallery.json'), 'utf-8'));
  return galleryCache!;
}

export function getGalleryByCategory(category: string): GalleryImage[] {
  return getGallery().filter(img => img.category === category);
}

// Blog posts (markdown with frontmatter)
export function getAllBlogPosts(): BlogPost[] {
  const blogDir = path.join(contentDir, 'blog');
  if (!fs.existsSync(blogDir)) return [];
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.json'));
  return files.map(f => {
    const data = JSON.parse(fs.readFileSync(path.join(blogDir, f), 'utf-8'));
    return data as BlogPost;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find(p => p.slug === slug);
}

// Site info
export const siteInfo = {
  name: 'The Thyolo House',
  tagline: 'Where Tea Gardens Meet Italian Soul',
  description: 'A boutique hotel and restaurant on the historic Conforzi Tea Estate in Thyolo, Malawi. Five unique rooms, Italian fusion cuisine, art workshops, and tea plantation walks.',
  url: 'https://thyolohouse.com',
  email: 'thethyolohouse@gmail.com',
  phone: '+265884202040',
  whatsapp: '265884202040',
  facebook: 'https://www.facebook.com/thyolohouse',
  instagram: 'https://www.instagram.com/therealthyolohouse',
  tripadvisor: 'https://www.tripadvisor.com/Restaurant_Review-g1932945-d23950588-Reviews-The_Thyolo_House-Thyolo_Southern_Region.html',
  google: 'https://www.google.com/maps/search/The+Thyolo+House+Conforzi+Tea+Estate+Thyolo+Malawi',
  address: 'Conforzi Tea Estate, Thyolo, Malawi',
  geo: { lat: -16.0667, lng: 35.1500 },
};

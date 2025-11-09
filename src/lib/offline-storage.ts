// Offline storage manager for SAFAR AI
// Handles local storage when backend is unavailable

interface StoredTrip {
  id: string;
  name: string;
  destination: string;
  from_location: string;
  duration: string;
  travelers: number;
  budget: string;
  custom_budget?: number;
  transport_mode: string;
  additional_locations?: string[];
  ai_suggestions?: string;
  status: string;
  created_at: string;
  created_by?: string;
}

interface StoredReview {
  id: string;
  trip_id: string;
  destination: string;
  rating: number;
  title: string;
  review_text: string;
  travel_date: string;
  created_at: string;
}

class OfflineStorage {
  private TRIPS_KEY = 'safar_ai_trips';
  private REVIEWS_KEY = 'safar_ai_reviews';
  private SYNC_QUEUE_KEY = 'safar_ai_sync_queue';

  // Trip operations
  saveTrip(trip: Omit<StoredTrip, 'id' | 'created_at'>): StoredTrip {
    const trips = this.getAllTrips();
    const newTrip: StoredTrip = {
      ...trip,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };
    trips.push(newTrip);
    localStorage.setItem(this.TRIPS_KEY, JSON.stringify(trips));
    this.addToSyncQueue('trip', 'create', newTrip);
    return newTrip;
  }

  getAllTrips(): StoredTrip[] {
    try {
      const data = localStorage.getItem(this.TRIPS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading trips from storage:', error);
      return [];
    }
  }

  getTrip(id: string): StoredTrip | null {
    const trips = this.getAllTrips();
    return trips.find(t => t.id === id) || null;
  }

  updateTrip(id: string, updates: Partial<StoredTrip>): StoredTrip | null {
    const trips = this.getAllTrips();
    const index = trips.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    trips[index] = { ...trips[index], ...updates };
    localStorage.setItem(this.TRIPS_KEY, JSON.stringify(trips));
    this.addToSyncQueue('trip', 'update', trips[index]);
    return trips[index];
  }

  deleteTrip(id: string): boolean {
    const trips = this.getAllTrips();
    const filtered = trips.filter(t => t.id !== id);
    if (filtered.length === trips.length) return false;
    
    localStorage.setItem(this.TRIPS_KEY, JSON.stringify(filtered));
    this.addToSyncQueue('trip', 'delete', { id });
    return true;
  }

  // Review operations
  saveReview(review: Omit<StoredReview, 'id' | 'created_at'>): StoredReview {
    const reviews = this.getAllReviews();
    const newReview: StoredReview = {
      ...review,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };
    reviews.push(newReview);
    localStorage.setItem(this.REVIEWS_KEY, JSON.stringify(reviews));
    return newReview;
  }

  getAllReviews(): StoredReview[] {
    try {
      const data = localStorage.getItem(this.REVIEWS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading reviews from storage:', error);
      return [];
    }
  }

  getReviewsForTrip(tripId: string): StoredReview[] {
    return this.getAllReviews().filter(r => r.trip_id === tripId);
  }

  getReviewsForDestination(destination: string): StoredReview[] {
    return this.getAllReviews().filter(r => 
      r.destination.toLowerCase().includes(destination.toLowerCase())
    );
  }

  // Sync queue for when backend comes back online
  private addToSyncQueue(type: string, action: string, data: any) {
    try {
      const queue = this.getSyncQueue();
      queue.push({
        type,
        action,
        data,
        timestamp: Date.now(),
      });
      localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  }

  getSyncQueue(): any[] {
    try {
      const data = localStorage.getItem(this.SYNC_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  clearSyncQueue() {
    localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify([]));
  }

  // Utility methods
  clearAllData() {
    localStorage.removeItem(this.TRIPS_KEY);
    localStorage.removeItem(this.REVIEWS_KEY);
    localStorage.removeItem(this.SYNC_QUEUE_KEY);
  }

  exportData() {
    return {
      trips: this.getAllTrips(),
      reviews: this.getAllReviews(),
      syncQueue: this.getSyncQueue(),
    };
  }

  importData(data: { trips?: StoredTrip[], reviews?: StoredReview[] }) {
    if (data.trips) {
      localStorage.setItem(this.TRIPS_KEY, JSON.stringify(data.trips));
    }
    if (data.reviews) {
      localStorage.setItem(this.REVIEWS_KEY, JSON.stringify(data.reviews));
    }
  }
}

export const offlineStorage = new OfflineStorage();
export type { StoredTrip, StoredReview };
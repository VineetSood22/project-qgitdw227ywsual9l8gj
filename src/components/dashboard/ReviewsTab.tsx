import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, MapPin, Calendar } from 'lucide-react';

interface ReviewsTabProps {
  trip: any;
}

export function ReviewsTab({ trip }: ReviewsTabProps) {
  const destination = trip?.destination || 'India';

  const reviews = [
    {
      name: 'Priya Sharma',
      rating: 5,
      date: '2 weeks ago',
      title: 'Absolutely Amazing Experience!',
      text: 'The trip was perfectly planned. Every detail was taken care of and we had the most wonderful time exploring the beautiful destinations. Highly recommend!',
      helpful: 24,
      verified: true,
    },
    {
      name: 'Rahul Verma',
      rating: 4,
      date: '1 month ago',
      title: 'Great Trip with Minor Issues',
      text: 'Overall a fantastic experience. The itinerary was well-structured and we saw all the major attractions. Only minor hiccup was with hotel check-in timing.',
      helpful: 18,
      verified: true,
    },
    {
      name: 'Anjali Patel',
      rating: 5,
      date: '1 month ago',
      title: 'Perfect Family Vacation',
      text: 'Traveled with my family and everyone had a blast! The activities were suitable for all ages and the local guides were very knowledgeable and friendly.',
      helpful: 31,
      verified: true,
    },
    {
      name: 'Vikram Singh',
      rating: 5,
      date: '2 months ago',
      title: 'Unforgettable Journey',
      text: 'This was my first time visiting and it exceeded all expectations. The culture, food, and people were incredible. Already planning my next trip!',
      helpful: 15,
      verified: false,
    },
  ];

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingDistribution = [
    { stars: 5, count: 156, percentage: 78 },
    { stars: 4, count: 32, percentage: 16 },
    { stars: 3, count: 8, percentage: 4 },
    { stars: 2, count: 3, percentage: 1.5 },
    { stars: 1, count: 1, percentage: 0.5 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Traveler Reviews</h3>
        <p className="text-gray-600">See what others say about {destination}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="text-center">
            <p className="text-5xl font-bold text-orange-600 mb-2">{averageRating.toFixed(1)}</p>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= averageRating ? 'fill-orange-500 text-orange-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">Based on {reviews.length} reviews</p>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <h4 className="font-semibold mb-4">Rating Distribution</h4>
          <div className="space-y-3">
            {ratingDistribution.map((dist) => (
              <div key={dist.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{dist.stars}</span>
                  <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{dist.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {reviews.map((review, idx) => (
          <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{review.name}</p>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-3 h-3" />
                    <span>{review.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= review.rating ? 'fill-orange-500 text-orange-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            <h4 className="font-semibold mb-2">{review.title}</h4>
            <p className="text-gray-700 mb-4">{review.text}</p>

            <div className="flex items-center gap-4 pt-4 border-t">
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful ({review.helpful})</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
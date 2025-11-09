import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, Plus, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { offlineStorage } from '@/lib/offline-storage';
import { useToast } from '@/hooks/use-toast';

interface ReviewsTabProps {
  trip: any;
}

export function ReviewsTab({ trip }: ReviewsTabProps) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState(offlineStorage.getReviewsForDestination(trip.destination));
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    review_text: '',
  });

  const handleSubmitReview = () => {
    if (!newReview.title || !newReview.review_text) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and review text",
        variant: "destructive",
      });
      return;
    }

    const review = offlineStorage.saveReview({
      trip_id: trip.id,
      destination: trip.destination,
      rating: newReview.rating,
      title: newReview.title,
      review_text: newReview.review_text,
      travel_date: new Date().toISOString().split('T')[0],
      helpful_count: 0,
    });

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, title: '', review_text: '' });
    setIsAddingReview(false);

    toast({
      title: "Review Added!",
      description: "Thank you for sharing your experience",
    });
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="text-5xl font-bold text-gray-900">{averageRating}</div>
                {renderStars(Math.round(parseFloat(averageRating)))}
              </div>
              <p className="text-gray-600">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            </div>
            <Button onClick={() => setIsAddingReview(true)} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Write Review
            </Button>
          </div>
        </CardContent>
      </Card>

      {isAddingReview && (
        <Card className="border-2 border-orange-500">
          <CardHeader>
            <CardTitle>Share Your Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Your Rating</Label>
              <div className="mt-2">
                {renderStars(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }))}
              </div>
            </div>

            <div>
              <Label>Review Title</Label>
              <Input
                placeholder="Summarize your experience..."
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Your Review</Label>
              <Textarea
                placeholder="Tell us about your trip, what you loved, and any tips for future travelers..."
                value={newReview.review_text}
                onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
                rows={5}
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSubmitReview} className="bg-orange-500 hover:bg-orange-600">
                <Send className="w-4 h-4 mr-2" />
                Submit Review
              </Button>
              <Button variant="outline" onClick={() => setIsAddingReview(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h3 className="text-xl font-bold">Rating Distribution</h3>
        {ratingDistribution.map(({ rating, count, percentage }) => (
          <div key={rating} className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 w-20">
              <span className="font-medium">{rating}</span>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Traveler Reviews</h3>
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">No Reviews Yet</h4>
              <p className="text-gray-500 mb-4">Be the first to share your experience!</p>
              <Button onClick={() => setIsAddingReview(true)} className="bg-orange-500 hover:bg-orange-600">
                Write First Review
              </Button>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-orange-500 text-white">
                      {review.created_by?.charAt(0).toUpperCase() || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{review.title}</h4>
                        <p className="text-sm text-gray-500">
                          Traveled on {new Date(review.travel_date).toLocaleDateString('en-IN', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-gray-700 mb-3">{review.review_text}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <button className="flex items-center space-x-1 hover:text-orange-500 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful ({review.helpful_count || 0})</span>
                      </button>
                      <Badge variant="outline">{review.destination}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
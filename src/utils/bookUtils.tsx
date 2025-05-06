import { Star } from "lucide-react";

// Utility function to format date as "5 May 2025"
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(/(\d+) (\w+) (\d+)/, "$1 $2 $3"); // Ensures "5 May 2025" format
};

// StarRating component for displaying rating
export const StarRating = ({ rating }: { rating: number }) => {
  const maxRating = 5;
  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 fill-transparent"
          } transition-colors hover:text-yellow-500 hover:fill-yellow-500`}
        />
      ))}
      <span className="ml-2 text-sm text-muted-foreground">({rating})</span>
    </div>
  );
};
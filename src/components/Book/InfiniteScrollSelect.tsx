import { useEffect, useState, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCategories} from "@/lib/api";
import { useInView } from "react-intersection-observer";
import { Category } from "@/types";

interface InfiniteScrollSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
}

const InfiniteScrollSelect = ({ value, onValueChange, placeholder }: InfiniteScrollSelectProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();

  const loadCategories = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const response = await getCategories(page, 10);
      setCategories((prev) => [...prev, ...response.data]);
      setHasMore(page < response.meta.last_page);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadCategories();
    }
  }, [inView]);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-64 overflow-y-auto">
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id.toString()}>
            {category.name}
          </SelectItem>
        ))}
        {hasMore && (
          <div ref={ref} className="flex justify-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-goodreads-purple"></div>
          </div>
        )}
      </SelectContent>
    </Select>
  );
};

export default InfiniteScrollSelect;
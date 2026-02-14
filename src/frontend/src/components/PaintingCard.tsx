import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice } from '../utils/format';
import type { Painting } from '../backend';

interface PaintingCardProps {
  painting: Painting;
}

export default function PaintingCard({ painting }: PaintingCardProps) {
  const primaryImage = painting.images[0];

  return (
    <Link
      to="/painting/$paintingId"
      params={{ paintingId: painting.id }}
      className="group block"
    >
      <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        <div className="relative aspect-[3/4] overflow-hidden bg-card">
          {primaryImage ? (
            <img
              src={primaryImage.getDirectURL()}
              alt={painting.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/0 to-background/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {painting.title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm mb-4">
            {painting.description}
          </p>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(painting.price)}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}

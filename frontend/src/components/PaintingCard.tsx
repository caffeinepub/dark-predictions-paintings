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
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${painting.sold ? 'brightness-75' : ''}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}

          {/* Hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/0 to-background/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* SOLD diagonal stamp overlay */}
          {painting.sold && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              {/* Dark tint */}
              <div className="absolute inset-0 bg-background/40" />
              {/* Stamp */}
              <div
                className="relative z-10 flex items-center justify-center"
                style={{ transform: 'rotate(-20deg)' }}
              >
                <span
                  className="text-4xl font-black tracking-[0.2em] text-white select-none px-5 py-2"
                  style={{
                    border: '4px solid rgba(255,255,255,0.9)',
                    textShadow: '0 2px 12px rgba(0,0,0,0.9)',
                    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                    letterSpacing: '0.25em',
                  }}
                >
                  SOLD
                </span>
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors ${painting.sold ? 'text-muted-foreground' : ''}`}>
              {painting.title}
            </h3>
            {painting.sold && (
              <span className="shrink-0 text-xs font-black tracking-widest text-white bg-destructive rounded px-2 py-0.5 uppercase">
                SOLD
              </span>
            )}
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm mb-4">
            {painting.description}
          </p>
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-0">
          {painting.sold ? (
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold text-muted-foreground line-through">
                {formatPrice(painting.price)}
              </p>
              <span className="text-sm font-semibold text-destructive uppercase tracking-wider">
                No longer available
              </span>
            </div>
          ) : (
            <p className="text-2xl font-bold text-primary">
              {formatPrice(painting.price)}
            </p>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}

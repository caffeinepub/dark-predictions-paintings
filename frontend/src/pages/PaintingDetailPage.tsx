import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetPainting } from '../hooks/useQueries';
import { formatPrice } from '../utils/format';
import ContactEmailCTA from '../components/ContactEmailCTA';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Ban } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default function PaintingDetailPage() {
  const { paintingId } = useParams({ from: '/painting/$paintingId' });
  const navigate = useNavigate();
  const { data: painting, isLoading } = useGetPainting(paintingId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!painting) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Painting Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The painting you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="mb-8 -ml-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Gallery
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="w-full relative">
          {painting.images.length === 1 ? (
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-card border">
              <img
                src={painting.images[0].getDirectURL()}
                alt={painting.title}
                className={`w-full h-full object-cover ${painting.sold ? 'brightness-75' : ''}`}
              />
              {painting.sold && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/30 overflow-hidden">
                  <div
                    className="flex items-center justify-center"
                    style={{ transform: 'rotate(-15deg)' }}
                  >
                    <span
                      className="text-5xl md:text-6xl font-black tracking-[0.2em] text-white select-none px-8 py-4"
                      style={{
                        border: '5px solid rgba(255,255,255,0.9)',
                        textShadow: '0 3px 16px rgba(0,0,0,0.95)',
                        boxShadow: '0 0 30px rgba(0,0,0,0.6)',
                        letterSpacing: '0.3em',
                      }}
                    >
                      SOLD
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {painting.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-card border">
                        <img
                          src={image.getDirectURL()}
                          alt={`${painting.title} - Image ${index + 1}`}
                          className={`w-full h-full object-cover ${painting.sold ? 'brightness-75' : ''}`}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {painting.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </>
                )}
              </Carousel>
              {painting.sold && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/30 rounded-lg pointer-events-none z-10 overflow-hidden">
                  <div
                    className="flex items-center justify-center"
                    style={{ transform: 'rotate(-15deg)' }}
                  >
                    <span
                      className="text-5xl md:text-6xl font-black tracking-[0.2em] text-white select-none px-8 py-4"
                      style={{
                        border: '5px solid rgba(255,255,255,0.9)',
                        textShadow: '0 3px 16px rgba(0,0,0,0.95)',
                        boxShadow: '0 0 30px rgba(0,0,0,0.6)',
                        letterSpacing: '0.3em',
                      }}
                    >
                      SOLD
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col space-y-6">
          <div>
            <div className="flex items-start gap-3 mb-4 flex-wrap">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight flex-1">
                {painting.title}
              </h1>
              {painting.sold && (
                <Badge
                  variant="destructive"
                  className="text-sm font-black tracking-widest mt-2 shrink-0 px-3 py-1 gap-1.5"
                >
                  <Ban className="h-3.5 w-3.5" />
                  SOLD
                </Badge>
              )}
            </div>

            {/* Price */}
            {painting.sold ? (
              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-3xl font-bold text-muted-foreground line-through">
                  {formatPrice(painting.price)}
                </p>
                <span className="text-base font-semibold text-destructive uppercase tracking-wider">
                  This painting has been sold
                </span>
              </div>
            ) : (
              <p className="text-3xl font-bold text-primary">
                {formatPrice(painting.price)}
              </p>
            )}
          </div>

          {/* Sold notice banner */}
          {painting.sold && (
            <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/10">
              <Ban className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <p className="font-semibold text-destructive text-sm">This painting has been sold</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  This original artwork is no longer available for purchase.
                </p>
              </div>
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {painting.description}
            </p>
          </div>

          <div className="pt-6 border-t border-border">
            <ContactEmailCTA
              paintingTitle={painting.title}
              paintingId={painting.id}
              disabled={painting.sold}
            />
          </div>

          {!painting.sold && (
            <div className="text-sm text-muted-foreground pt-4">
              <p>
                This is a one-of-a-kind original painting. Once sold, it will be marked as unavailable.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

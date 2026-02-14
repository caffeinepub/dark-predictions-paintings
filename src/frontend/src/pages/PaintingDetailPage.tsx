import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetPainting } from '../hooks/useQueries';
import { formatPrice } from '../utils/format';
import ContactEmailCTA from '../components/ContactEmailCTA';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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
        {/* Image Carousel */}
        <div className="w-full">
          {painting.images.length === 1 ? (
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-card border">
              <img
                src={painting.images[0].getDirectURL()}
                alt={painting.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent>
                {painting.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-card border">
                      <img
                        src={image.getDirectURL()}
                        alt={`${painting.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
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
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {painting.title}
            </h1>
            <p className="text-3xl font-bold text-primary">
              {formatPrice(painting.price)}
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {painting.description}
            </p>
          </div>

          <div className="pt-6 border-t border-border">
            <ContactEmailCTA
              paintingTitle={painting.title}
              paintingId={painting.id}
            />
          </div>

          <div className="text-sm text-muted-foreground pt-4">
            <p>
              This is a one-of-a-kind original painting. Once sold, it will be removed from the gallery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

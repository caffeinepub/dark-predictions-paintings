import { useGetAllPaintings, useSiteContent } from '../hooks/useQueries';
import PaintingCard from '../components/PaintingCard';
import MissionStatement from '../components/MissionStatement';
import { Skeleton } from '@/components/ui/skeleton';

const DEFAULT_HEADLINE = 'Dark Predictions';
const DEFAULT_SUBTITLE = 'One-of-a-kind paintings that speak to the shadows within';

export default function GalleryPage() {
  const { data: paintings, isLoading } = useGetAllPaintings();
  const { data: siteContent, isLoading: isSiteContentLoading } = useSiteContent();

  const heroHeadline = siteContent?.heroHeadline ?? DEFAULT_HEADLINE;
  const heroSubtitle = siteContent?.heroSubtitle ?? DEFAULT_SUBTITLE;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/assets/generated/gallery-hero-texture.dim_2400x1350.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          {isSiteContentLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-96 mx-auto" />
              <Skeleton className="h-8 w-80 mx-auto" />
            </div>
          ) : (
            <>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                {heroHeadline}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
                {heroSubtitle}
              </p>
            </>
          )}
        </div>
      </section>

      {/* Mission Statement */}
      <MissionStatement />

      {/* Gallery Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Available Works</h2>
          <p className="text-muted-foreground text-lg">
            Each piece is unique and available for purchase
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="w-full aspect-[3/4] rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : paintings && paintings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paintings.map((painting) => (
              <PaintingCard key={painting.id} painting={painting} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No paintings available at the moment. Check back soon.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

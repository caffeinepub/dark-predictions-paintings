import { Heart } from 'lucide-react';

export default function MissionStatement() {
  return (
    <section className="bg-card border-y border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Art with Purpose
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Every painting sold contributes to building and developing{' '}
            <span className="text-foreground font-semibold">affordable modern housing</span>{' '}
            for our local community. Your purchase doesn't just bring art into your life—it helps
            create homes and opportunities for those who need them most.
          </p>
        </div>
      </div>
    </section>
  );
}

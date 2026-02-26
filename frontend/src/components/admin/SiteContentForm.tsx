import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { useSiteContent, useUpdateSiteContent } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { SiteContent } from '../../backend';
import { Skeleton } from '@/components/ui/skeleton';

export default function SiteContentForm() {
  const { data: siteContent, isLoading } = useSiteContent();
  const updateMutation = useUpdateSiteContent();

  const form = useForm<SiteContent>({
    defaultValues: {
      heroHeadline: '',
      heroSubtitle: '',
      missionStatement: '',
      contactEmail: '',
    },
  });

  useEffect(() => {
    if (siteContent) {
      form.reset(siteContent);
    }
  }, [siteContent, form]);

  const onSubmit = async (data: SiteContent) => {
    try {
      await updateMutation.mutateAsync(data);
      toast.success('Site content updated successfully');
    } catch (error) {
      toast.error('Failed to update site content');
      console.error('Update site content error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="heroHeadline"
          rules={{ required: 'Hero headline is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Headline</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Dark Predictions" {...field} />
              </FormControl>
              <FormDescription>
                The large title displayed in the hero section of the gallery page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="heroSubtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Subtitle</FormLabel>
              <FormControl>
                <Input placeholder="e.g. One-of-a-kind paintings..." {...field} />
              </FormControl>
              <FormDescription>
                The subtitle text displayed below the hero headline.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="missionStatement"
          rules={{ required: 'Mission statement is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mission Statement</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your mission..."
                  className="min-h-[120px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The mission statement displayed in the section below the hero.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactEmail"
          rules={{
            required: 'Contact email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g. yourname@email.com" {...field} />
              </FormControl>
              <FormDescription>
                The email address used for painting inquiries and displayed in the footer.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            size="lg"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

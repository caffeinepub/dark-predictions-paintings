import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAddPainting, useUpdatePainting } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import { X, Upload, Loader2, ImagePlus } from 'lucide-react';
import type { Painting } from '../../backend';

interface AdminPaintingFormProps {
  painting?: Painting;
  onSuccess: () => void;
}

interface FormData {
  title: string;
  description: string;
  price: string;
}

export default function AdminPaintingForm({ painting, onSuccess }: AdminPaintingFormProps) {
  const isEditing = !!painting;
  const [images, setImages] = useState<ExternalBlob[]>(painting?.images || []);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});
  const addMutation = useAddPainting();
  const updateMutation = useUpdatePainting();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      title: painting?.title || '',
      description: painting?.description || '',
      price: painting?.price ? (Number(painting.price) / 100).toFixed(2) : '',
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: ExternalBlob[] = [];
    const startIndex = images.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress((prev) => ({ ...prev, [startIndex + i]: percentage }));
      });

      newImages.push(blob);
    }

    setImages((prev) => [...prev, ...newImages]);
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[index];
      return newProgress;
    });
  };

  const onSubmit = async (data: FormData) => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    const price = BigInt(Math.round(parseFloat(data.price) * 100));

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: painting.id,
          title: data.title,
          description: data.description,
          price,
          images,
        });
        toast.success('Painting updated successfully');
      } else {
        const id = `painting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await addMutation.mutateAsync({
          id,
          title: data.title,
          description: data.description,
          price,
          images,
        });
        toast.success('Painting added successfully');
        reset();
        setImages([]);
      }
      onSuccess();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update painting' : 'Failed to add painting');
      console.error('Form submission error:', error);
    }
  };

  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...register('title', { required: 'Title is required' })}
          placeholder="Enter painting title"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          placeholder="Describe the painting — medium, dimensions, inspiration..."
          rows={5}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Price (USD) *</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            $
          </span>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            className="pl-7"
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' },
            })}
            placeholder="0.00"
            disabled={isSubmitting}
          />
        </div>
        {errors.price && (
          <p className="text-sm text-destructive">{errors.price.message}</p>
        )}
      </div>

      {/* Images */}
      <div className="space-y-3">
        <Label>
          Images *{' '}
          <span className="text-muted-foreground font-normal text-xs">
            ({images.length} uploaded)
          </span>
        </Label>

        {/* Image previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border"
              >
                <img
                  src={image.getDirectURL()}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1.5 right-1.5 h-7 w-7 shadow-md"
                  onClick={() => handleRemoveImage(index)}
                  disabled={isSubmitting}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
                {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                  <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-1">
                    <div className="text-sm font-bold">{uploadProgress[index]}%</div>
                    <div className="w-3/4 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-200"
                        style={{ width: `${uploadProgress[index]}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upload area */}
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <ImagePlus className="h-7 w-7 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Click to upload</span> or drag & drop
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP supported</p>
          </div>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={isSubmitting}
          />
        </label>

        {images.length === 0 && (
          <p className="text-xs text-muted-foreground">At least one image is required</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2 border-t border-border">
        <Button type="submit" disabled={isSubmitting} size="lg" className="min-w-36">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            <>{isEditing ? 'Update Painting' : 'Add Painting'}</>
          )}
        </Button>
      </div>
    </form>
  );
}

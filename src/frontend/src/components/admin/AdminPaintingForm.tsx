import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAddPainting, useUpdatePainting } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import { X, Upload, Loader2 } from 'lucide-react';
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
  } = useForm<FormData>({
    defaultValues: {
      title: painting?.title || '',
      description: painting?.description || '',
      price: painting?.price ? painting.price.toString() : '',
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: ExternalBlob[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress((prev) => ({ ...prev, [images.length + i]: percentage }));
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
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          {...register('title', { required: 'Title is required' })}
          placeholder="Enter painting title"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          placeholder="Describe the painting..."
          rows={5}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (USD) *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          {...register('price', {
            required: 'Price is required',
            min: { value: 0, message: 'Price must be positive' },
          })}
          placeholder="0.00"
        />
        {errors.price && (
          <p className="text-sm text-destructive">{errors.price.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Images *</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted border">
              <img
                src={image.getDirectURL()}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <div className="text-sm font-medium">{uploadProgress[index]}%</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload images
              </p>
            </div>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
          </label>
        </div>
        {images.length === 0 && (
          <p className="text-sm text-muted-foreground">At least one image is required</p>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
        >
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

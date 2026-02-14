import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { useDeletePainting } from '../../hooks/useQueries';
import { formatPrice } from '../../utils/format';
import { toast } from 'sonner';
import type { Painting } from '../../backend';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminPaintingListProps {
  paintings: Painting[];
  isLoading: boolean;
  onEdit: (painting: Painting) => void;
}

export default function AdminPaintingList({ paintings, isLoading, onEdit }: AdminPaintingListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paintingToDelete, setPaintingToDelete] = useState<Painting | null>(null);
  const deleteMutation = useDeletePainting();

  const handleDeleteClick = (painting: Painting) => {
    setPaintingToDelete(painting);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!paintingToDelete) return;

    try {
      await deleteMutation.mutateAsync(paintingToDelete.id);
      toast.success('Painting deleted successfully');
      setDeleteDialogOpen(false);
      setPaintingToDelete(null);
    } catch (error) {
      toast.error('Failed to delete painting');
      console.error('Delete error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (paintings.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-lg">
        <p className="text-muted-foreground">No paintings yet. Add your first painting to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-32">Price</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paintings.map((painting) => (
              <TableRow key={painting.id}>
                <TableCell>
                  {painting.images[0] ? (
                    <img
                      src={painting.images[0].getDirectURL()}
                      alt={painting.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{painting.title}</TableCell>
                <TableCell className="max-w-md truncate text-muted-foreground">
                  {painting.description}
                </TableCell>
                <TableCell className="font-semibold">{formatPrice(painting.price)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(painting)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(painting)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Painting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{paintingToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Tag, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { useDeletePainting, useTogglePaintingSold } from '../../hooks/useQueries';
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deleteMutation = useDeletePainting();
  const toggleSoldMutation = useTogglePaintingSold();

  const handleDeleteClick = (painting: Painting) => {
    setPaintingToDelete(painting);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!paintingToDelete) return;
    setDeletingId(paintingToDelete.id);
    try {
      await deleteMutation.mutateAsync(paintingToDelete.id);
      toast.success(`"${paintingToDelete.title}" deleted successfully`);
      setDeleteDialogOpen(false);
      setPaintingToDelete(null);
    } catch (error) {
      toast.error('Failed to delete painting');
      console.error('Delete error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleSold = async (painting: Painting) => {
    try {
      await toggleSoldMutation.mutateAsync(painting.id);
      toast.success(
        painting.sold
          ? `"${painting.title}" marked as available`
          : `"${painting.title}" marked as sold`
      );
    } catch (error) {
      toast.error('Failed to update sold status');
      console.error('Toggle sold error:', error);
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
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="w-32">Price</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-52 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paintings.map((painting) => {
              const isToggling =
                toggleSoldMutation.isPending && toggleSoldMutation.variables === painting.id;
              const isDeleting = deletingId === painting.id;

              return (
                <TableRow
                  key={painting.id}
                  className={painting.sold ? 'opacity-70 bg-muted/20' : ''}
                >
                  <TableCell>
                    <div className="relative w-16 h-16">
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
                      {painting.sold && (
                        <div className="absolute inset-0 flex items-center justify-center rounded overflow-hidden">
                          <div className="absolute inset-0 bg-background/50" />
                          <span
                            className="relative z-10 text-[9px] font-black tracking-widest text-white border-2 border-white px-1 py-0.5 rotate-[-20deg] select-none"
                            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
                          >
                            SOLD
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <span className={painting.sold ? 'line-through text-muted-foreground' : ''}>
                      {painting.title}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate text-muted-foreground text-sm">
                    {painting.description}
                  </TableCell>
                  <TableCell className="font-semibold">
                    <span className={painting.sold ? 'line-through text-muted-foreground' : ''}>
                      {formatPrice(painting.price)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {painting.sold ? (
                      <Badge
                        variant="destructive"
                        className="text-xs font-bold tracking-wider gap-1"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        SOLD
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs text-muted-foreground gap-1"
                      >
                        <Circle className="h-3 w-3" />
                        Available
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 flex-wrap">
                      {/* Toggle Sold */}
                      <Button
                        variant={painting.sold ? 'outline' : 'secondary'}
                        size="sm"
                        onClick={() => handleToggleSold(painting)}
                        disabled={isToggling || isDeleting}
                        className="text-xs gap-1 h-8"
                        title={painting.sold ? 'Mark as Available' : 'Mark as Sold'}
                      >
                        {isToggling ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Tag className="h-3 w-3" />
                        )}
                        {painting.sold ? 'Unmark' : 'Mark Sold'}
                      </Button>

                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(painting)}
                        disabled={isDeleting}
                        title="Edit painting"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-destructive/10"
                        onClick={() => handleDeleteClick(painting)}
                        disabled={isDeleting}
                        title="Delete painting"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Painting
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-foreground">"{paintingToDelete?.title}"</span>?
              This action cannot be undone and will remove the painting from the gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Painting
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

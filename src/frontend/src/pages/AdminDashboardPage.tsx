import { useState } from 'react';
import { useGetAllPaintings } from '../hooks/useQueries';
import AdminPaintingList from '../components/admin/AdminPaintingList';
import AdminPaintingForm from '../components/admin/AdminPaintingForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Mail } from 'lucide-react';
import { CONTACT_EMAIL } from '../constants/contact';
import type { Painting } from '../backend';

export default function AdminDashboardPage() {
  const { data: paintings, isLoading } = useGetAllPaintings();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPainting, setEditingPainting] = useState<Painting | null>(null);

  const handleEditPainting = (painting: Painting) => {
    setEditingPainting(painting);
  };

  const handleCloseEditDialog = () => {
    setEditingPainting(null);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>Admin Contact: {CONTACT_EMAIL}</span>
        </div>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manage Paintings</h2>
          <p className="text-muted-foreground">
            {paintings?.length || 0} painting{paintings?.length !== 1 ? 's' : ''} in gallery
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add New Painting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Painting</DialogTitle>
            </DialogHeader>
            <AdminPaintingForm onSuccess={handleCloseCreateDialog} />
          </DialogContent>
        </Dialog>
      </div>

      <AdminPaintingList
        paintings={paintings || []}
        isLoading={isLoading}
        onEdit={handleEditPainting}
      />

      {/* Edit Dialog */}
      <Dialog open={!!editingPainting} onOpenChange={(open) => !open && handleCloseEditDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Painting</DialogTitle>
          </DialogHeader>
          {editingPainting && (
            <AdminPaintingForm
              painting={editingPainting}
              onSuccess={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

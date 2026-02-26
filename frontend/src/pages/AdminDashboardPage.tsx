import { useState } from 'react';
import { useGetAllPaintings } from '../hooks/useQueries';
import AdminPaintingList from '../components/admin/AdminPaintingList';
import AdminPaintingForm from '../components/admin/AdminPaintingForm';
import SiteContentForm from '../components/admin/SiteContentForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Palette, FileText } from 'lucide-react';
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
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your gallery, paintings, and site content.</p>
      </div>

      <Tabs defaultValue="paintings" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="paintings" className="gap-2">
            <Palette className="h-4 w-4" />
            Paintings
          </TabsTrigger>
          <TabsTrigger value="site-content" className="gap-2">
            <FileText className="h-4 w-4" />
            Site Content
          </TabsTrigger>
        </TabsList>

        {/* Paintings Tab */}
        <TabsContent value="paintings">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Manage Paintings</h2>
              <p className="text-muted-foreground">
                {paintings?.length || 0} painting{paintings?.length !== 1 ? 's' : ''} in gallery
                {paintings && paintings.filter((p) => p.sold).length > 0 && (
                  <span className="ml-2 text-destructive font-medium">
                    · {paintings.filter((p) => p.sold).length} sold
                  </span>
                )}
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
        </TabsContent>

        {/* Site Content Tab */}
        <TabsContent value="site-content">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Site Content</h2>
            <p className="text-muted-foreground">
              Edit the text displayed on your public gallery pages.
            </p>
          </div>
          <div className="max-w-2xl">
            <SiteContentForm />
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Painting Dialog */}
      <Dialog open={!!editingPainting} onOpenChange={(open) => !open && handleCloseEditDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Painting
              {editingPainting && (
                <span className="ml-2 text-muted-foreground font-normal text-base">
                  — {editingPainting.title}
                </span>
              )}
            </DialogTitle>
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

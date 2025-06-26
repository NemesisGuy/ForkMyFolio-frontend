import React from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Uncomment when auth checks are active
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { Button } from '@/components/ui/button'; // Example
import { Input } from '@/components/ui/input.jsx';  // Example

/**
 * Admin Dashboard page component.
 * Allows admins to manage projects and skills.
 * @returns {JSX.Element} The AdminDashboardPage component.
 */
const AdminDashboardPage = () => {
  // const { user } = useAuth();

  // if (!user || !user.roles.includes('admin')) {
  //   return <div className="container mx-auto p-4">Access Denied. Admin only.</div>;
  //   // Or redirect: return <Navigate to="/" />;
  // }

  // Need to add Tabs component from shadcn/ui
  // const { user } = useAuth(); // Re-enable when auth is fully integrated

  // if (!user || !user.roles.includes('admin')) { // Re-enable for admin protection
  //   return <div className="container mx-auto p-4">Access Denied. Admin only.</div>;
  //   // Or redirect: return <Navigate to="/" />;
  // }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-4">Manage platform projects and skills.</p>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3">
          <TabsTrigger value="projects">Manage Projects</TabsTrigger>
          <TabsTrigger value="skills">Manage Skills</TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <div className="bg-card p-6 rounded-lg shadow mt-4">
            <h2 className="text-xl font-semibold mb-3 text-card-foreground">Projects Management</h2>
            <p className="text-muted-foreground mb-4">View, edit, or delete projects from the platform.</p>
            {/* Placeholder for project management table/list */}
            <div className="border rounded-md p-4">
              <p className="text-muted-foreground">Project listing and management tools will be here.</p>
              <Button variant="outline" size="sm" className="mt-2">Add New Project (Placeholder)</Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="skills">
          <div className="bg-card p-6 rounded-lg shadow mt-4">
            <h2 className="text-xl font-semibold mb-3 text-card-foreground">Skills Management</h2>
            <p className="text-muted-foreground mb-4">Add, edit, or delete skills available on the platform.</p>
            {/* Placeholder for skill management */}
            <div className="border rounded-md p-4">
              <div className="flex gap-2 mb-2">
                <Input placeholder="New skill name" className="max-w-xs" />
                <Button>Add Skill (Placeholder)</Button>
              </div>
              <p className="text-muted-foreground">Existing skills list and management tools will be here.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage;

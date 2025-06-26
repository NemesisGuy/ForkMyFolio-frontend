import React from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Link } from 'react-router-dom';

/**
 * My Projects page component.
 * Allows authenticated users to view and manage their projects.
 * @returns {JSX.Element} The MyProjectsPage component.
 */
const MyProjectsPage = () => {
  // const { user } = useAuth();

  // Placeholder for fetching user's projects
  // const userProjects = [
  //   { id: 'proj1', name: 'My First Awesome App', description: 'A description of my first app.'},
  //   { id: 'proj2', name: 'Another Great Project', description: 'Details about this other project.'},
  // ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">My Projects</h1>
        {/* <Button asChild>
          <Link to="/projects/new">Add New Project</Link>
        </Button> */}
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">Add New Project (Placeholder)</button>
      </div>
      <p className="text-muted-foreground mb-4">
        Here you can manage all the projects you've added to ForkMyFolio.
      </p>
      {/* Placeholder content */}
      <div className="space-y-4">
        {/* Example Project Item (to be replaced with dynamic data) */}
        <div className="border rounded-lg p-4 shadow bg-card">
          <h2 className="text-xl font-semibold mb-1 text-card-foreground">My First Awesome App</h2>
          <p className="text-sm text-muted-foreground mb-3">
            A description of my first app.
          </p>
          <div>
            <button className="text-sm text-blue-600 hover:underline mr-2">Edit</button>
            <button className="text-sm text-red-600 hover:underline">Delete</button>
          </div>
        </div>
        <div className="border rounded-lg p-4 shadow bg-card">
          <h2 className="text-xl font-semibold mb-1 text-card-foreground">Another Great Project</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Details about this other project.
          </p>
          <div>
            <button className="text-sm text-blue-600 hover:underline mr-2">Edit</button>
            <button className="text-sm text-red-600 hover:underline">Delete</button>
          </div>
        </div>
      </div>
       {/*
        Actual implementation will map over user's projects data:
        {userProjects && userProjects.length > 0 ? (
          <div className="space-y-4">
            {userProjects.map(project => (
              <div key={project.id} className="border rounded-lg p-4 shadow bg-card">
                <h2 className="text-xl font-semibold mb-1 text-card-foreground">{project.name}</h2>
                <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                <div>
                  <Button variant="outline" size="sm" asChild className="mr-2">
                    <Link to={`/projects/edit/${project.id}`}>Edit</Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't added any projects yet.</p>
        )}
      */}
    </div>
  );
};

export default MyProjectsPage;

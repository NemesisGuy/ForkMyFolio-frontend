import React from 'react';
import { useState, useEffect } from 'react'; // Added for local state example
// import { useQuery } from 'react-query'; // Example for data fetching, to be added later
// import { getProjects } from '@/services/api'; // To be created in api.js
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card.jsx'; // Example shadcn components
import { Badge } from '@/components/ui/badge.jsx'; // Example shadcn component
import { Skeleton } from '@/components/ui/skeleton.jsx';

/**
 * Projects page component.
 * Displays a list of projects.
 * @returns {JSX.Element} The ProjectsPage component.
 */
const ProjectsPage = () => {
  // --- State for local example ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  // --- End state for local example ---

  // const { data: projects, isLoading, error } = useQuery('projects', getProjects); // Real implementation

  // Simulate data fetching for example
  useEffect(() => {
    const timer = setTimeout(() => {
      // To simulate an error, uncomment the next line:
      // setError({ message: "Simulated network error. Could not fetch projects." });
      // To simulate empty data, set an empty array:
      // setProjects([]);
      setProjects([
        { id: '1', name: 'Project Alpha', tagline: 'Revolutionary App', description: 'Built with React and Node.js.', skills: [{id: 's1', name: 'React'}, {id: 's2', name: 'Node.js'}], live_url: '#', repo_url: '#' },
        { id: '2', name: 'Project Beta', tagline: 'Creative Platform', description: 'Real-time collaboration.', skills: [{id: 's3', name: 'Vue.js'}, {id: 's4', name: 'Firebase'}], live_url: '#', repo_url: '#' },
        { id: '3', name: 'Project Gamma', tagline: 'Data Insights', description: 'AI-powered analytics.', skills: [{id: 's5', name: 'Python'}, {id: 's6', name: 'ML'}], live_url: '#', repo_url: '#' },
      ]);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);


  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-6 text-primary">Projects</h1>
        <p className="text-destructive text-lg">Error loading projects: {error.message}</p>
        <p className="text-muted-foreground mt-2">Please try refreshing the page or check back later.</p>
      </div>
    );
  }

  const renderSkeletonCard = (key) => (
    <Card key={key} className="flex flex-col">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="flex-grow">
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-3" />
        <div className="flex flex-wrap gap-2 mb-3">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Projects</h1>
      <p className="text-muted-foreground mb-6">
        Browse through the amazing projects showcased on ForkMyFolio.
      </p>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => renderSkeletonCard(index))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                {project.tagline && <CardDescription>{project.tagline}</CardDescription>}
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  {project.skills && project.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.skills.map(skill => (
                        <Badge key={skill.id} variant="secondary">{skill.name}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-auto pt-3">
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mr-3 font-medium">
                      Live Demo
                    </a>
                  )}
                  {project.repo_url && (
                    <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline font-medium">
                      Source Code
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold mb-2">No Projects Yet</h2>
          <p className="text-muted-foreground">Check back later to see new projects!</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;

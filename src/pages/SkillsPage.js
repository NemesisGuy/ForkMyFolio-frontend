import React from 'react';
import { useState, useEffect } from 'react'; // Added for local state example
// import { useQuery } from 'react-query'; // Example for data fetching
// import { getSkills } from '../services/api'; // To be created in api.js & Updated path
import { Badge } from '../components/ui/badge.jsx'; // Updated path
import { Skeleton } from '../components/ui/skeleton.jsx'; // Updated path

/**
 * Skills page component.
 * Displays a list of skills.
 * @returns {JSX.Element} The SkillsPage component.
 */
const SkillsPage = () => {
  // --- State for local example ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skills, setSkills] = useState([]);
  // --- End state for local example ---

  // const { data: skills, isLoading, error } = useQuery('skills', getSkills); // Real implementation

  // Simulate data fetching for example
  useEffect(() => {
    const timer = setTimeout(() => {
      // To simulate an error:
      // setError({ message: "Simulated network error. Could not fetch skills." });
      // To simulate empty data:
      // setSkills([]);
      setSkills([
        { id: 's1', name: 'JavaScript' },
        { id: 's2', name: 'React' },
        { id: 's3', name: 'Node.js' },
        { id: 's4', name: 'Python' },
        { id: 's5', name: 'SQL' },
        { id: 's6', name: 'Docker' },
        { id: 's7', name: 'TypeScript' },
        { id: 's8', name: 'AWS' },
      ]);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-6 text-primary">Skills</h1>
        <p className="text-destructive text-lg">Error loading skills: {error.message}</p>
        <p className="text-muted-foreground mt-2">Please try refreshing the page or check back later.</p>
      </div>
    );
  }

  const renderSkeletonBadge = (key) => (
    <Skeleton key={key} className="h-10 w-28 rounded-full" />
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Skills</h1>
      <p className="text-muted-foreground mb-6">
        Discover the various skills and technologies used in projects on ForkMyFolio.
      </p>

      {isLoading ? (
         <div className="flex flex-wrap gap-4">
          {Array.from({ length: 6 }).map((_, index) => renderSkeletonBadge(index))}
        </div>
      ) : skills && skills.length > 0 ? (
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {skills.map(skill => (
            <Badge key={skill.id} variant="outline" className="text-base sm:text-lg px-4 py-2 sm:px-5 sm:py-2.5">
              {skill.name}
            </Badge>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold mb-2">No Skills Yet</h2>
          <p className="text-muted-foreground">Skills will appear here once they are added to projects.</p>
        </div>
      )}
    </div>
  );
};

export default SkillsPage;

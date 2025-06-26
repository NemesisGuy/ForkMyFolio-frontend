import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button'; // Updated path

/**
 * Home page component.
 * Displays a welcome message and calls to action.
 * @returns {JSX.Element} The HomePage component.
 */
const HomePage = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <header className="py-10">
        <h1 className="text-5xl font-bold mb-4 text-primary">Welcome to ForkMyFolio</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Showcase your projects and skills with a stunning portfolio.
        </p>
        <div className="space-x-4">
          <Button asChild size="lg">
            <Link to="/projects">View Projects</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </header>

      <section className="py-16">
        <h2 className="text-3xl font-semibold mb-6">Why ForkMyFolio?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-card p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2 text-primary">Easy to Use</h3>
            <p className="text-muted-foreground">
              Quickly set up your portfolio and add projects with our intuitive interface.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2 text-primary">Modern Design</h3>
            <p className="text-muted-foreground">
              Leverage sleek, responsive templates powered by modern UI components.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2 text-primary">Showcase Your Skills</h3>
            <p className="text-muted-foreground">
              Highlight your technical skills and link them directly to your projects.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

import React, { useState } from 'react';
import { Button } from '../components/ui/button'; // Updated path
import { Input } from '../components/ui/input.jsx'; // Updated path
import { Textarea } from '../components/ui/textarea.jsx'; // Updated path
import { Label } from '../components/ui/label.jsx'; // Updated path
// import { useMutation } from 'react-query'; // For API call
// import { sendContactMessage } from '../services/api'; // To be created & Updated path
import { toast } from 'sonner';
// import { Toaster } from '../components/ui/sonner'; // Toaster is in App.js & Updated path

/**
 * Contact page component.
 * Displays a contact form.
 * @returns {JSX.Element} The ContactPage component.
 */
const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null); // For general form errors or API errors
  const [fieldErrors, setFieldErrors] = useState({}); // For specific field errors

  // const { mutate, isLoading: mutationIsLoading } = useMutation(sendContactMessage, { // From react-query
  //   onSuccess: () => {
  //     toast.success('Message sent successfully! We will get back to you soon.');
  //     setName('');
  //     setEmail('');
  //     setMessage('');
  //     setFormError(null);
  //     setFieldErrors({});
  //   },
  //   onError: (error) => {
  //     const errorMessage = error.message || "Failed to send message. Please try again.";
  //     setFormError(errorMessage);
  //     toast.error(errorMessage);
  //     // Example: If backend returns field-specific errors:
  //     // if (error.response?.data?.errors) {
  //     //   setFieldErrors(error.response.data.errors);
  //     // }
  //   },
  // });

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid.";
    }
    if (!message.trim()) errors.message = "Message is required.";
    else if (message.trim().length < 10) errors.message = "Message must be at least 10 characters long.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!validateForm()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    setIsLoading(true); // Use this if not using react-query's isLoading
    // Simulating API call
    try {
      // await mutation.mutateAsync({ name, email, message }); // If using react-query
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      console.log('Form submitted (simulated):', { name, email, message });
      toast.success('Message sent successfully! (Simulated)');
      setName('');
      setEmail('');
      setMessage('');
      setFieldErrors({});
    } catch (error) {
      const errorMessage = error.message || "An unexpected error occurred.";
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false); // Use this if not using react-query's isLoading
    }
  };

  // const currentIsLoading = mutationIsLoading || isLoading; // Combine if using react-query

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-primary">Contact Us</h1>
      <p className="text-muted-foreground mb-6">
        Have a question or want to work together? Fill out the form below.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
            disabled={isLoading}
            aria-invalid={!!fieldErrors.name}
          />
          {fieldErrors.name && <p className="text-sm text-destructive">{fieldErrors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            required
            disabled={isLoading}
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && <p className="text-sm text-destructive">{fieldErrors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your Message (min. 10 characters)"
            required
            rows={4}
            disabled={isLoading}
            aria-invalid={!!fieldErrors.message}
          />
          {fieldErrors.message && <p className="text-sm text-destructive">{fieldErrors.message}</p>}
        </div>
        {formError && <p className="text-sm text-destructive text-center">{formError}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
};

export default ContactPage;

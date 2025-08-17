import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
export default function Home() {
  return (
    <Card className="border-gray-200 shadow-none">
      <CardContent className="py-12 text-center">
        <h2 className="text-2xl font-semibold">
          Share your Top 10 albums and why
        </h2>
        <p className="mt-2 text-gray-600">
          Create your list, then share a clean public link.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/app">
            <Button>Create my list</Button>
          </Link>
          <Link to="/users">
            <Button variant="outline">Browse all users</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

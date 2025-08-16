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
        <Link to="/app">
          <Button className="mt-6">Create my list</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

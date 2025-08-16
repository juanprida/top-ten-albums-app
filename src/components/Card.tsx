import React from 'react';

export function Card({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border bg-white ${className}`}>{children}</div>
  );
}

export function CardHeader({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`px-4 pt-4 ${className}`}>{children}</div>;
}

export function CardTitle({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <h3 className={`text-base font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`px-4 pb-4 ${className}`}>{children}</div>;
}

export function CardFooter({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`px-4 pb-4 ${className}`}>{children}</div>;
}

import React from 'react';

export default async function AdminLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="bg-background text-foreground container mx-auto px-4 py-8">
            {children}
        </div>
    );
}

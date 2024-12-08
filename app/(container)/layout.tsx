import React from 'react';

export default async function AdminLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className={'container pt-8'}>
            {children}
        </div>
    );
}

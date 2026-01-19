"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    // QueryClient'ı state içinde tutarak her render'da yeniden oluşmasını engelliyoruz
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // Varsayılan olarak 1 dakika boyunca veriyi "taze" kabul et
                staleTime: 60 * 1000,
                // Pencere odağı değiştiğinde (alt-tab) otomatik yenileme yapma (isteğe bağlı)
                refetchOnWindowFocus: false,
                // Hata durumunda 1 kere daha dene (varsayılan 3)
                retry: 1,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

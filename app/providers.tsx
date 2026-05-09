"use client";

import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

type ProvidersProps = {
    children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
    return (
        <>
            {children}
            <Toaster position="top-right" richColors />
        </>
    );
}

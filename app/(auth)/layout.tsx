import { ReactNode } from "react";

export default function WrapperLayout({ children }: {
    children: ReactNode;
}) {
    return <>{children}</>;
}

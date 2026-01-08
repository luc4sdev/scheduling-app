import Image from "next/image";
import { Button } from "../ui/button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "next/navigation";


interface LoginHeaderProps {
    router: AppRouterInstance;
}
export function AuthHeader({ router }: LoginHeaderProps) {

    const pathName = usePathname();
    return (
        <header className="w-full h-20 bg-[#F5F4F2] flex items-center justify-between px-6 md:px-12 border-b border-gray-300">
            <div className="w-10 h-10 relative">
                <Image
                    src='/logo.svg'
                    alt='Logo'
                    width={40}
                    height={40}
                    className="object-contain"
                />
            </div>
            <Button
                variant="default"
                className="bg-black text-white hover:bg-zinc-800 h-9 px-6 text-xs font-medium tracking-wide"
                onClick={() => router.push(pathName === '/signin' ? '/signup' : '/signin')}
            >
                {pathName === '/signin' ? 'Cadastre-se' : 'Login'}
            </Button>
        </header>
    )
}
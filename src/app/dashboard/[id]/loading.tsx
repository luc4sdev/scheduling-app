import Image from "next/image";

export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-white">
            <div className="animate-bounce">
                <Image
                    src="/logo.svg"
                    alt="Logo carregando"
                    width={128}
                    height={128}
                    priority
                    className="object-contain"
                />
            </div>
        </div>
    );
}
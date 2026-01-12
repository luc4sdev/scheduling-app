'use client'

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, getSession, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import * as LabelPrimitive from '@radix-ui/react-label';
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
import { toastMessage } from "@/utils/toast-message";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";


const signInSchema = z.object({
    email: z.email("Insira um email válido"),
    password: z.string().min(6, "No mínimo 6 caracteres")
});

type SignInSchemaType = z.infer<typeof signInSchema>

export default function SigninAdmin() {
    const { register, handleSubmit, formState: { errors } } = useForm<SignInSchemaType>({
        resolver: zodResolver(signInSchema)
    })

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function signInUser(data: SignInSchemaType) {
        setIsLoading(true);
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (res?.ok && !res?.error) {
                const session = await getSession();
                const user = session?.user;
                if (user?.role !== 'ADMIN') {
                    await signOut({ redirect: false });
                    toastMessage({ message: "Acesso negado: Esta área é exclusiva para administradores.", type: "error" });
                    setIsLoading(false);
                    return;
                }
                if (user) {
                    router.push(`/dashboard/${user.id}`);
                }
            } else {
                toastMessage({ message: "Email ou senha inválidos", type: "error" });
            }
        } catch {
            toastMessage({ message: "Erro ao tentar fazer login", type: "error" });
        }
        setIsLoading(false);
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F5F4F2] p-4">

            <div className="w-full max-w-100 flex flex-col items-center">
                <div className="mb-6">
                    <div className="w-12 h-12 relative">
                        <Image
                            src='/logo.svg'
                            alt='Logo'
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                    </div>
                </div>
                <h1 className="text-3xl font-semibold text-zinc-900 mb-8 tracking-tight">
                    Login Admin
                </h1>

                <div className="w-full bg-white rounded-lg shadow-sm p-8 border border-gray-100">
                    <form onSubmit={handleSubmit(signInUser)} className="flex flex-col gap-5">

                        <div className="flex flex-col gap-2">
                            <LabelPrimitive.Root
                                htmlFor="email"
                                className="text-sm font-bold text-zinc-700"
                            >
                                E-mail <span className="font-normal text-zinc-600">(Obrigatório)</span>
                            </LabelPrimitive.Root>

                            <input
                                id="email"
                                type="email"
                                placeholder="mateus@goldspell.com.br"
                                className={cn(
                                    "flex h-11 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                    errors.email && "border-red-500 focus-visible:ring-red-500"
                                )}
                                {...register("email")}
                            />
                            {errors.email && (
                                <span className="text-xs text-red-500 font-medium">{errors.email.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <LabelPrimitive.Root
                                htmlFor="password"
                                className="text-sm font-bold text-zinc-700"
                            >
                                Senha de acesso <span className="font-normal text-zinc-600">(Obrigatório)</span>
                            </LabelPrimitive.Root>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="***************"
                                    className={cn(
                                        "flex h-11 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10",
                                        errors.password && "border-red-500 focus-visible:ring-red-500"
                                    )}
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-800 focus:outline-none cursor-pointer"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            {errors.password && (
                                <span className="text-xs text-red-500 font-medium">{errors.password.message}</span>
                            )}
                        </div>

                        <Button type="submit" disabled={isLoading} className="mt-2">
                            {isLoading ? (
                                <LoaderCircle className="w-5 h-5 animate-spin text-white" />
                            ) : (
                                "Acessar conta"
                            )}
                        </Button>

                    </form>
                </div>
            </div>
        </div>
    )
}
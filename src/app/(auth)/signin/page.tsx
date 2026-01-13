'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import * as LabelPrimitive from '@radix-ui/react-label';
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
import { toastMessage } from "@/utils/toast-message";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "@/components/auth/auth-header";

const signInSchema = z.object({
    email: z.email("Insira um email válido"),
    password: z.string().min(6, "No mínimo 6 caracteres")
});

type SignInSchemaType = z.infer<typeof signInSchema>

export default function Signin() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid }
    } = useForm<SignInSchemaType>({
        resolver: zodResolver(signInSchema),
        mode: "onSubmit"
    })

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const emailValue = watch("email");
    const showPasswordField = emailValue && emailValue.length > 0;

    async function signInUser(data: SignInSchemaType) {
        setIsLoading(true);
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            switch (res?.code) {
                case "rate_limit":
                    toastMessage({
                        message: "Muitas tentativas. Aguarde 5 minutos para tentar novamente.",
                        type: "error"
                    });
                    break;

                case "inactive_account":
                    // ...
                    break;

                case "invalid_credentials":
                    // ...
                    break;
            }

            if (res?.ok && !res?.error) {
                const session = await getSession();
                const user = session?.user;
                if (user) {
                    router.push(`/dashboard/${user.id}`);
                }
            } else {
                switch (res.code) {
                    case "rate_limit":
                        toastMessage({
                            message: "Muitas tentativas. Aguarde 1 minuto para tentar novamente.",
                            type: "error"
                        });
                        break;

                    case "inactive":
                        toastMessage({
                            message: "Sua conta foi desativada. Entre em contato com o suporte.",
                            type: "error"
                        });
                        break;
                    default:
                        toastMessage({ message: "Email ou senha inválidos", type: "error" });
                }
            }
        } catch {
            toastMessage({ message: "Erro ao tentar fazer login", type: "error" });
        }
        setIsLoading(false);
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#F5F4F2]">
            <AuthHeader router={router} />
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-105 flex flex-col items-center">

                    <h1 className="text-2xl font-semibold text-zinc-900 mb-8 tracking-tight text-center">
                        Entre na sua conta
                    </h1>

                    <div className="w-full bg-white rounded-lg shadow-sm p-8 border border-gray-100">
                        <form onSubmit={handleSubmit(signInUser)} className="flex flex-col gap-5">

                            <div className="flex flex-col gap-2">
                                <LabelPrimitive.Root
                                    htmlFor="email"
                                    className="text-sm font-bold text-zinc-700"
                                >
                                    E-mail <span className="font-normal text-zinc-500">(Obrigatório)</span>
                                </LabelPrimitive.Root>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Insira seu e-mail"
                                    className={cn(
                                        "flex h-11 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                                        errors.email && "border-red-500 focus-visible:ring-red-500"
                                    )}
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <span className="text-xs text-red-500 font-medium">{errors.email.message}</span>
                                )}
                            </div>

                            <div className={cn(
                                "grid transition-all duration-300 ease-in-out overflow-hidden",
                                showPasswordField ? "grid-rows-[1fr] opacity-100 mb-2" : "grid-rows-[0fr] opacity-0 mb-0"
                            )}>
                                <div className="min-h-0 flex flex-col gap-2">
                                    <LabelPrimitive.Root
                                        htmlFor="password"
                                        className="text-sm font-bold text-zinc-700"
                                    >
                                        Senha de acesso <span className="font-normal text-zinc-500">(Obrigatório)</span>
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
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 focus:outline-none transition-colors"
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
                            </div>

                            <Button
                                type="submit"
                                className={cn(
                                    "mt-2 w-full transition-all duration-300",
                                    !isValid ? "bg-zinc-200 text-zinc-400 hover:bg-zinc-200 cursor-not-allowed" : "bg-black text-white hover:bg-zinc-800"
                                )}
                            >
                                {isLoading ? (
                                    <LoaderCircle className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Acessar conta"
                                )}
                            </Button>

                            <div className="flex items-center justify-between mt-2 text-sm">
                                <span className="text-zinc-500">Ainda não tem um cadastro?</span>
                                <a href="/signup" className="font-bold text-zinc-900 hover:underline underline-offset-4">
                                    Cadastre-se
                                </a>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}
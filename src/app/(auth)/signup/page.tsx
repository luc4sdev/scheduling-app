'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toastMessage } from "@/utils/toast-message";
import { AuthHeader } from "@/components/auth/auth-header";
import { getSession, signIn } from "next-auth/react";
import { UserForm, UserFormValues } from "@/components/ui/user-form";

export default function Signup() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSignUp(data: UserFormValues) {
        setIsSubmitting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Erro ao criar conta');
            }

            const signInResult = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (signInResult?.ok) {
                const session = await getSession();
                const user = session?.user;

                toastMessage({ message: "Conta criada com sucesso!", type: "success" });

                if (user) {
                    router.push(`/dashboard/${user.id}`);
                } else {
                    router.push(`/dashboard`);
                }
            } else {
                toastMessage({ message: "Conta criada. Faça login para continuar.", type: "success" });
                router.push("/signin");
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Erro ao cadastrar. Tente novamente.";
            toastMessage({ message: errorMessage, type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#F5F4F2]">
            <AuthHeader router={router} />
            <main className="flex-1 flex items-center justify-center p-6 mb-10">
                <div className="w-full max-w-125 flex flex-col items-center">
                    <h1 className="text-2xl font-semibold text-zinc-900 mb-8 tracking-tight text-center">
                        Cadastre-se
                    </h1>
                    <div className="w-full bg-white rounded-lg shadow-sm p-8 border border-gray-100">
                        <UserForm
                            variant="create"
                            onSubmit={handleSignUp}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}
'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import * as LabelPrimitive from '@radix-ui/react-label';
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
import { toastMessage } from "@/utils/toast-message";
import { cn } from "@/utils/utis";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


interface PayloadUser {
    name: string;
    lastName: string;
    email: string;
    password?: string;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
}

const profileSchema = z.object({
    firstName: z.string().min(2, "Mínimo 2 letras"),
    lastName: z.string().min(2, "Mínimo 2 letras"),
    email: z.email("Email inválido"),
    password: z.string().optional(),
    cep: z.string().min(8, "CEP inválido").max(9),
    street: z.string().min(1, "Rua obrigatória"),
    number: z.string().min(1, "Número obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Bairro obrigatório"),
    city: z.string().min(1, "Cidade obrigatória"),
    state: z.string().min(2, "Estado obrigatório"),
}).refine((data) => {
    if (data.password && data.password.length > 0 && data.password.length < 6) {
        return false;
    }
    return true;
}, {
    message: "A senha deve ter no mínimo 6 caracteres",
    path: ["password"]
});

type ProfileSchemaType = z.infer<typeof profileSchema>

export default function Profile() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const [showPassword, setShowPassword] = useState(false);
    const [addressVisible, setAddressVisible] = useState(true);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isValid }
    } = useForm<ProfileSchemaType>({
        resolver: zodResolver(profileSchema),
        mode: "onChange",
    });

    const { data: userData, isLoading: isLoadingData } = useQuery({
        queryKey: ['profile', session?.user?.id],
        queryFn: async () => {
            if (!session?.user?.token) return null;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me`, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`
                }
            });
            if (!res.ok) throw new Error('Falha ao buscar perfil');
            return await res.json();
        },
        enabled: !!session?.user?.token
    });

    useEffect(() => {
        if (userData) {
            reset({
                firstName: userData.name || "",
                lastName: userData.lastName || "",
                email: userData.email || "",
                password: "",
                cep: userData.cep || "",
                street: userData.street || "",
                number: userData.number || "",
                complement: userData.complement || "",
                neighborhood: userData.neighborhood || "",
                city: userData.city || "",
                state: userData.state || ""
            });
            setAddressVisible(true);
        }
    }, [userData, reset]);

    const mutation = useMutation({
        mutationFn: async (data: ProfileSchemaType) => {
            const payload: PayloadUser = {
                name: data.firstName,
                lastName: data.lastName,
                email: data.email,
                cep: data.cep,
                street: data.street,
                number: data.number,
                complement: data.complement,
                neighborhood: data.neighborhood,
                city: data.city,
                state: data.state
            };

            if (data.password && data.password.length >= 6) {
                payload.password = data.password;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${session?.user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user?.token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Erro ao atualizar');
            }

            return await res.json();
        },
        onSuccess: () => {
            toastMessage({ message: "Perfil atualizado com sucesso!", type: "success" });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: () => {
            toastMessage({ message: "Erro ao atualizar perfil", type: "error" });
        }
    });

    const cepValue = watch("cep");
    useEffect(() => {
        const fetchAddress = async () => {
            const cleanCep = cepValue?.replace(/\D/g, '');
            if (cleanCep?.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                    const data = await response.json();
                    if (!data.erro) {
                        setValue("street", data.logradouro);
                        setValue("neighborhood", data.bairro);
                        setValue("city", data.localidade);
                        setValue("state", data.uf);
                        setAddressVisible(true);
                    }
                } catch {
                    console.error("Erro ao buscar CEP");
                }
            }
        };

        if (cepValue && cepValue !== userData?.cep) {
            const timeoutId = setTimeout(fetchAddress, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [cepValue, setValue, userData]);

    async function handleSave(data: ProfileSchemaType) {
        mutation.mutate(data);
    }

    if (isLoadingData) {
        return (
            <div className="flex h-96 items-center justify-center">
                <LoaderCircle className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-6">
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-8 max-w-200 w-full">
                <form onSubmit={handleSubmit(handleSave)} className="flex flex-col gap-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <LabelPrimitive.Root htmlFor="firstName" className="text-sm font-bold text-zinc-700">
                                Nome <span className="font-normal text-zinc-500 text-xs">(Obrigatório)</span>
                            </LabelPrimitive.Root>
                            <input
                                id="firstName"
                                placeholder="Seu nome"
                                className="flex h-11 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-zinc-950 outline-none transition-colors"
                                {...register("firstName")}
                            />
                            {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <LabelPrimitive.Root htmlFor="lastName" className="text-sm font-bold text-zinc-700">
                                Sobrenome <span className="font-normal text-zinc-500 text-xs">(Obrigatório)</span>
                            </LabelPrimitive.Root>
                            <input
                                id="lastName"
                                placeholder="Seu sobrenome"
                                className="flex h-11 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-zinc-950 outline-none transition-colors"
                                {...register("lastName")}
                            />
                            {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <LabelPrimitive.Root htmlFor="email" className="text-sm font-bold text-zinc-700">
                            E-mail <span className="font-normal text-zinc-500 text-xs">(Obrigatório)</span>
                        </LabelPrimitive.Root>
                        <input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            className="flex h-11 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-zinc-950 outline-none transition-colors"
                            {...register("email")}
                        />
                        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <LabelPrimitive.Root htmlFor="password" className="text-sm font-bold text-zinc-700">
                            Nova Senha <span className="font-normal text-zinc-500 text-xs">(Deixe em branco para manter a atual)</span>
                        </LabelPrimitive.Root>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="***************"
                                className="flex h-11 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-zinc-950 outline-none pr-10 transition-colors"
                                {...register("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <LabelPrimitive.Root htmlFor="cep" className="text-sm font-bold text-zinc-700">
                            CEP <span className="font-normal text-zinc-500 text-xs">(Obrigatório)</span>
                        </LabelPrimitive.Root>
                        <input
                            id="cep"
                            placeholder="00000-000"
                            maxLength={9}
                            className="flex h-11 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-zinc-950 outline-none transition-colors"
                            {...register("cep")}
                        />
                        {errors.cep && <span className="text-xs text-red-500">{errors.cep.message}</span>}
                    </div>

                    <div className={cn(
                        "grid gap-4 transition-all duration-500 ease-in-out",
                        addressVisible ? "grid-rows-[1fr] opacity-100 mt-0" : "grid-rows-[0fr] opacity-0 mt-0 overflow-hidden"
                    )}>
                        <div className="min-h-0 flex flex-col gap-4">

                            <div className="flex flex-col gap-2">
                                <LabelPrimitive.Root className="text-sm font-bold text-zinc-700">Endereço</LabelPrimitive.Root>
                                <input
                                    readOnly
                                    className="flex h-11 w-full rounded-md border border-zinc-200 bg-zinc-100 text-zinc-600 px-3 py-2 text-sm outline-none cursor-not-allowed"
                                    {...register("street")}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <LabelPrimitive.Root htmlFor="number" className="text-sm font-bold text-zinc-700">Número</LabelPrimitive.Root>
                                <input
                                    id="number"
                                    placeholder="43"
                                    className="flex h-11 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-zinc-950 outline-none transition-colors"
                                    {...register("number")}
                                />
                                {errors.number && <span className="text-xs text-red-500">{errors.number.message}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <LabelPrimitive.Root htmlFor="complement" className="text-sm font-bold text-zinc-700">Complemento</LabelPrimitive.Root>
                                <input
                                    id="complement"
                                    placeholder="Sala 1302"
                                    className="flex h-11 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-zinc-950 outline-none transition-colors"
                                    {...register("complement")}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <LabelPrimitive.Root className="text-sm font-bold text-zinc-700">Bairro</LabelPrimitive.Root>
                                <input
                                    readOnly
                                    className="flex h-11 w-full rounded-md border border-zinc-200 bg-zinc-100 text-zinc-600 px-3 py-2 text-sm outline-none cursor-not-allowed"
                                    {...register("neighborhood")}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <LabelPrimitive.Root className="text-sm font-bold text-zinc-700">Cidade</LabelPrimitive.Root>
                                <input
                                    readOnly
                                    className="flex h-11 w-full rounded-md border border-zinc-200 bg-zinc-100 text-zinc-600 px-3 py-2 text-sm outline-none cursor-not-allowed"
                                    {...register("city")}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <LabelPrimitive.Root className="text-sm font-bold text-zinc-700">Estado</LabelPrimitive.Root>
                                <input
                                    readOnly
                                    className="flex h-11 w-full rounded-md border border-zinc-200 bg-zinc-100 text-zinc-600 px-3 py-2 text-sm outline-none cursor-not-allowed"
                                    {...register("state")}
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className={cn(
                            "mt-4 w-full transition-all duration-300",
                            !isValid ? "bg-zinc-300 text-white cursor-not-allowed hover:bg-zinc-300" : "bg-black text-white hover:bg-zinc-800"
                        )}
                    >
                        {mutation.isPending ? (
                            <LoaderCircle className="w-5 h-5 animate-spin" />
                        ) : (
                            "Salvar Alterações"
                        )}
                    </Button>

                </form>
            </div>
        </div>
    )
}
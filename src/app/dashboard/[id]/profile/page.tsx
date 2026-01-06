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


const profileSchema = z.object({
    firstName: z.string().min(2, "Mínimo 2 letras"),
    lastName: z.string().min(2, "Mínimo 2 letras"),
    email: z.email("Email inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    cep: z.string().min(8, "CEP inválido").max(9),
    street: z.string().min(1, "Rua obrigatória"),
    number: z.string().min(1, "Número obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Bairro obrigatório"),
    city: z.string().min(1, "Cidade obrigatória"),
    state: z.string().min(2, "Estado obrigatório"),
});

type ProfileSchemaType = z.infer<typeof profileSchema>

export default function Profile() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [addressVisible, setAddressVisible] = useState(true);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid }
    } = useForm<ProfileSchemaType>({
        resolver: zodResolver(profileSchema),
        mode: "onChange",
        defaultValues: {
            firstName: "Mateus",
            lastName: "Barbosa",
            email: "mateus@goldspell.com.br",
            password: "***************",
            cep: "03333-050",
            street: "Rua Coronel irineu de Castro",
            number: "43",
            complement: "Sala 1302",
            neighborhood: "Jardim Anália Franco",
            city: "São Paulo",
            state: "São Paulo"
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
                } catch (error) {
                    console.error("Erro ao buscar CEP");
                }
            }
        };

        if (cepValue && cepValue !== "03333-050") {
            const timeoutId = setTimeout(fetchAddress, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [cepValue, setValue]);

    async function handleSave(data: ProfileSchemaType) {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("Dados atualizados:", data);
            toastMessage({ message: "Perfil atualizado com sucesso!", type: "success" });
        } catch (error) {
            toastMessage({ message: "Erro ao atualizar perfil", type: "error" });
        }
        setIsLoading(false);
    }

    return (
        <div className="flex flex-col items-center justify-center gap-6">
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-8">
                <form onSubmit={handleSubmit(handleSave)} className="flex flex-col gap-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <LabelPrimitive.Root htmlFor="firstName" className="text-sm font-bold text-zinc-700">
                                Nome <span className="font-normal text-zinc-500 text-xs">(Obrigatório)</span>
                            </LabelPrimitive.Root>
                            <input
                                id="firstName"
                                placeholder="Mateus"
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
                                placeholder="Barbosa"
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
                            placeholder="mateus@goldspell.com.br"
                            className="flex h-11 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-zinc-950 outline-none transition-colors"
                            {...register("email")}
                        />
                        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <LabelPrimitive.Root htmlFor="password" className="text-sm font-bold text-zinc-700">
                            Senha de acesso <span className="font-normal text-zinc-500 text-xs">(Obrigatório)</span>
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

                            {/* Endereço (Read Only) */}
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
                        disabled={isLoading || !isValid}
                        className={cn(
                            "mt-4 w-full transition-all duration-300",
                            !isValid ? "bg-zinc-300 text-white cursor-not-allowed hover:bg-zinc-300" : "bg-black text-white hover:bg-zinc-800"
                        )}
                    >
                        {isLoading ? (
                            <LoaderCircle className="w-5 h-5 animate-spin" />
                        ) : (
                            "Salvar"
                        )}
                    </Button>

                </form>
            </div>
        </div>
    )
}
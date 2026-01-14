'use client'

import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { toastMessage } from "@/utils/toast-message";
import useFetch from "@/hooks/useFetch";
import { useMutationHook } from "@/hooks/useMutation";
import { UserForm, UserFormValues } from "@/components/ui/user-form";


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

export default function Profile() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const { data: userData, isLoading: isLoadingData } = useFetch({
        url: '/me',
        options: {
            method: 'GET',
        },
        cacheKeys: ['profile'],
    });

    const mutation = useMutationHook<void, Error, PayloadUser>({
        url: `/users/${session?.user?.id}`,
        method: 'PUT',
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toastMessage({ message: "Perfil atualizado com sucesso!", type: "success" });
        },
        onError: () => {
            toastMessage({ message: "Erro ao atualizar perfil", type: "error" });
        }
    });

    const handleFormSubmit = (profileData: UserFormValues) => {
        const payload: PayloadUser = {
            name: profileData.name,
            lastName: profileData.lastName,
            email: profileData.email,
            cep: profileData.cep,
            street: profileData.street,
            number: profileData.number,
            complement: profileData.complement,
            neighborhood: profileData.neighborhood,
            city: profileData.city,
            state: profileData.state
        };

        if (profileData.password && profileData.password.length >= 6) {
            payload.password = profileData.password;
        }

        mutation.mutate(payload);
    };

    if (isLoadingData) {
        return (
            <div className="flex h-96 items-center justify-center">
                <LoaderCircle className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    const initialValues: Partial<UserFormValues> = userData ? {
        name: userData.name || "",
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
    } : {};

    return (
        <div className="flex flex-col items-center justify-center gap-6">
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-8 max-w-200 w-full">
                <UserForm
                    variant="update"
                    onSubmit={handleFormSubmit}
                    isSubmitting={mutation.isPending}
                    defaultValues={initialValues}
                />
            </div>
        </div>
    );
}
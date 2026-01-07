export async function fetchCep(cleanCep: string) {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    return await response.json();
}
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const data = await response.json();
            return new Response(JSON.stringify(data), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ message: 'Usuário criado com sucesso' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Erro interno no servidor' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

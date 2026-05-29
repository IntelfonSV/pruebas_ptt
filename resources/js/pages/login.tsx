import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing } = useForm({
        username: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onSuccess: () => {
                window.location.href = '/';
            },
        });
    };

    return (
        <>
            <Head title="Login - Gestor PTT" />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-2 text-center">Gestor de Pruebas PTT</h1>
                    <p className="text-gray-600 mb-6 text-center">Ingrese su usuario para continuar</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Usuario</label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value.toUpperCase())}
                                placeholder="Ej: AWCRUZ"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
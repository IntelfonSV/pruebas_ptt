import { Head, usePage } from '@inertiajs/react';
import { JSX } from 'react';

interface Props {
    children: JSX.Element;
    title?: string;
}

export default function Layout({ children, title = 'Dashboard PTT' }: Props) {
    const page = usePage();
    const currentUser = page.props.currentUser as string | undefined;
    const isAdmin = page.props.isAdmin as boolean | undefined;

    const handleLogout = () => {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
        }).then(() => {
            window.location.href = '/login';
        });
    };

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-blue-600 text-white shadow">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-8">
                                <h1 className="text-xl font-bold">Gestor de Pruebas PTT</h1>
                                <div className="flex gap-4">
                                    <a href="/" className="hover:underline px-2 py-1 rounded hover:bg-blue-700">Dashboard</a>
                                    <a href="/test-sessions/create" className="hover:underline px-2 py-1 rounded hover:bg-blue-700">Nueva Sesión</a>
                                    <a href="/test-sessions" className="hover:underline px-2 py-1 rounded hover:bg-blue-700">Sesiones</a>
                                    <a href="/test-results" className="hover:underline px-2 py-1 rounded hover:bg-blue-700">Resultados</a>
                                    {isAdmin && (
                                        <>
                                            <a href="/test-types" className="hover:underline px-2 py-1 rounded hover:bg-blue-700">Tipos</a>
                                            <a href="/tests" className="hover:underline px-2 py-1 rounded hover:bg-blue-700">Pruebas</a>
                                            <a href="/products" className="hover:underline px-2 py-1 rounded hover:bg-blue-700">Productos</a>
                                            <a href="/product-versions" className="hover:underline px-2 py-1 rounded hover:bg-blue-700">Versiones</a>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm bg-blue-700 px-3 py-1 rounded">{currentUser}</span>
                                {isAdmin && <span className="text-xs bg-yellow-500 text-yellow-900 px-2 py-1 rounded">Admin</span>}
                                <button
                                    onClick={handleLogout}
                                    className="text-red-200 hover:text-red-100 hover:underline text-sm"
                                >
                                    Salir
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="container mx-auto px-6 py-8">
                    {children}
                </div>
            </div>
        </>
    );
}
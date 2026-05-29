import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface PageProps {
    sessions: Array<{
        id: number;
        session_code: string;
        user_performer: string;
        created_at: string;
        results_count: number;
        product_version: {
            id: number;
            version: string;
            product: { name: string };
        } | null;
    }>;
    versions: Array<{
        id: number;
        version: string;
        product: { name: string };
    }>;
    currentUser?: string;
    isAdmin?: boolean;
}

export default function TestSessionsIndex({ sessions, versions, currentUser, isAdmin }: PageProps) {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Layout title="Sesiones de Prueba">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Sesiones de Pruebas</h2>
                <a href="/test-sessions/create" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Nueva Sesión
                </a>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm">Código</th>
                            <th className="px-4 py-3 text-left text-sm">Producto</th>
                            <th className="px-4 py-3 text-left text-sm">Versión</th>
                            <th className="px-4 py-3 text-left text-sm">Usuario</th>
                            <th className="px-4 py-3 text-center text-sm">Pruebas</th>
                            <th className="px-4 py-3 text-left text-sm">Fecha</th>
                            <th className="px-4 py-3 text-center text-sm">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((session) => (
                            <tr key={session.id} className="border-t">
                                <td className="px-4 py-3 font-mono font-bold">{session.session_code}</td>
                                <td className="px-4 py-3">{session.product_version?.product?.name ?? 'N/A'}</td>
                                <td className="px-4 py-3">{session.product_version?.version ?? 'N/A'}</td>
                                <td className="px-4 py-3">{session.user_performer}</td>
                                <td className="px-4 py-3 text-center">{session.results_count}</td>
                                <td className="px-4 py-3 text-sm">{formatDate(session.created_at)}</td>
                                <td className="px-4 py-3 text-center">
                                    <a href={`/test-sessions/${session.id}`} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                                        Ver
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
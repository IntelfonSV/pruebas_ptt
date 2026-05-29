import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import Layout from '../layouts/Layout';

interface Stats {
    totalSessions: number;
    totalTests: number;
    passedTests: number;
    failedTests: number;
    recentSessions: {
        id: number;
        session_code: string;
        user_performer: string;
        created_at: string;
        results_count: number;
        product_version: {
            version: string;
            product: {
                name: string;
            };
        };
    }[];
}

interface PageProps {
    stats: Stats;
    currentUser: string;
    isAdmin: boolean;
}

export default function Welcome({ currentUser, isAdmin }: PageProps) {
    const page = usePage();
    const stats = page.props.stats as Stats;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <Layout title="Dashboard PTT">
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500 mb-1">Sesiones Totales</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalSessions}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500 mb-1">Pruebas Totales</p>
                    <p className="text-3xl font-bold text-gray-700">{stats.totalTests}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500 mb-1">Aprobadas</p>
                    <p className="text-3xl font-bold text-green-600">{stats.passedTests}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-500 mb-1">Reprobadas</p>
                    <p className="text-3xl font-bold text-red-600">{stats.failedTests}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold">Sesiones Recientes</h3>
                </div>
                <div className="p-6">
                    {stats.recentSessions.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No hay sesiones registradas</p>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-gray-500">
                                    <th className="pb-3">Código</th>
                                    <th className="pb-3">Producto</th>
                                    <th className="pb-3">Versión</th>
                                    <th className="pb-3">Usuario</th>
                                    <th className="pb-3">Pruebas</th>
                                    <th className="pb-3">Fecha</th>
                                    <th className="pb-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentSessions.map((session) => (
                                    <tr key={session.id} className="border-t">
                                        <td className="py-3 font-mono font-bold">{session.session_code}</td>
                                        <td className="py-3">{session.product_version?.product?.name ?? 'N/A'}</td>
                                        <td className="py-3">{session.product_version?.version ?? 'N/A'}</td>
                                        <td className="py-3">{session.user_performer}</td>
                                        <td className="py-3 text-center">{session.results_count}</td>
                                        <td className="py-3">{formatDate(session.created_at)}</td>
                                        <td className="py-3 text-right">
                                            <a href={`/test-sessions/${session.id}`} className="text-blue-600 hover:underline text-sm">
                                                Ver
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div className="mt-4 text-center">
                        <a href="/test-sessions" className="text-blue-600 hover:underline text-sm">
                            Ver todas las sesiones
                        </a>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
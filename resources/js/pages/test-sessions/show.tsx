import { Head } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface TestType {
    name: string;
}

interface Product {
    name: string;
}

interface ProductVersion {
    version: string;
    product: Product;
}

interface TestResult {
    id: number;
    result: string;
    notes: string | null;
    test: {
        name: string;
        description: string | null;
        expected_result: string;
        testType: TestType;
    };
}

interface TestSession {
    id: number;
    session_code: string;
    user_performer: string;
    created_at: string;
    productVersion: ProductVersion;
    results: TestResult[];
}

interface PageProps {
    session: TestSession;
    currentUser?: string;
    isAdmin?: boolean;
}

export default function TestSessionsShow({ session, currentUser, isAdmin }: PageProps) {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const groupedResults = session.results.reduce((acc, result) => {
        const typeName = result.test?.testType?.name ?? 'Sin tipo de prueba';
        if (!acc[typeName]) acc[typeName] = [];
        acc[typeName].push(result);
        return acc;
    }, {} as Record<string, TestResult[]>);

    const totalTests = session.results.length;
    const passedTests = session.results.filter((r) => r.result === 'aprobado').length;
    const failedTests = session.results.filter((r) => r.result === 'reprobado').length;

    const productName = session?.product_version?.product?.name ?? 'N/A';
    const version = session?.product_version?.version ?? 'N/A';

    return (
        <Layout title={`Sesión ${session.session_code}`}>
            <a href="/test-sessions" className="text-blue-600 hover:underline mb-4 inline-block">← Volver</a>

            <h2 className="text-2xl font-bold">Sesión: {session.session_code}</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
                <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">Producto</p>
                    <p className="font-bold">{productName}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">Versión</p>
                    <p className="font-bold">{version}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">Usuario</p>
                    <p className="font-bold">{session.user_performer}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="font-bold">{formatDate(session.created_at)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-green-100 rounded-lg">
                    <p className="text-sm text-green-600">Aprobados</p>
                    <p className="text-2xl font-bold text-green-700">{passedTests} / {totalTests}</p>
                </div>
                <div className="p-4 bg-red-100 rounded-lg">
                    <p className="text-sm text-red-600">Reprobados</p>
                    <p className="text-2xl font-bold text-red-700">{failedTests} / {totalTests}</p>
                </div>
            </div>

            {Object.entries(groupedResults).map(([typeName, results]) => (
                <div key={typeName} className="mb-8">
                    <h3 className="text-xl font-bold mb-4 px-4 py-2 bg-blue-600 text-white rounded">{typeName}</h3>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm">Prueba</th>
                                    <th className="px-4 py-3 text-left text-sm">Descripción</th>
                                    <th className="px-4 py-3 text-left text-sm">Resultado Esperado</th>
                                    <th className="px-4 py-3 text-center text-sm">Resultado</th>
                                    <th className="px-4 py-3 text-left text-sm">Notas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((result) => (
                                    <tr key={result.id} className="border-t">
                                        <td className="px-4 py-3 text-sm">{result.test.name}</td>
                                        <td className="px-4 py-3 text-sm">{result.test.description}</td>
                                        <td className="px-4 py-3 text-sm">{result.test.expected_result}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                                                result.result === 'aprobado' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                            }`}>
                                                {result.result.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{result.notes ?? '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </Layout>
    );
}
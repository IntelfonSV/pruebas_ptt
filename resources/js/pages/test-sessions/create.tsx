import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../layouts/Layout';

interface TestType {
    id: number;
    name: string;
    tests: {
        id: number;
        name: string;
        description: string | null;
        expected_result: string;
    }[];
}

interface ProductVersion {
    id: number;
    version: string;
    product: { name: string };
    test_types: TestType[];
}

interface PageProps {
    versions: ProductVersion[];
    currentUser?: string;
    isAdmin?: boolean;
}

export default function TestSessionsCreate({ versions, currentUser, isAdmin }: PageProps) {
    const [productVersionId, setProductVersionId] = useState('');
    const [results, setResults] = useState<{ test_id: number; result: string; notes: string }[]>([]);

    const selectedVersion = versions.find((v) => v.id === Number(productVersionId));
    const testTypes = selectedVersion?.test_types || [];

    const setResult = (testId: number, result: string) => {
        const existing = results.find((r) => r.test_id === testId);
        if (existing) {
            setResults(results.map((r) => (r.test_id === testId ? { ...r, result } : r)));
        } else {
            setResults([...results, { test_id: testId, result, notes: '' }]);
        }
    };

    const setNotes = (testId: number, notes: string) => {
        const existing = results.find((r) => r.test_id === testId);
        if (existing) {
            setResults(results.map((r) => (r.test_id === testId ? { ...r, notes } : r)));
        } else {
            setResults([...results, { test_id: testId, result: '', notes }]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/test-sessions', { product_version_id: productVersionId, results }, { preserveScroll: true });
    };

    return (
        <Layout title="Nueva Sesión de Pruebas">
            <h2 className="text-2xl font-bold mb-6">Nueva Sesión de Pruebas</h2>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-white rounded-lg shadow">
                    <div>
                        <label className="block font-medium mb-2">Versión del Producto</label>
                        <select
                            value={productVersionId}
                            onChange={(e) => setProductVersionId(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        >
                            <option value="">Seleccionar versión</option>
                            {versions.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.product.name} - {v.version}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Usuario que realiza la prueba</label>
                        <input
                            type="text"
                            value={currentUser || ''}
                            className="w-full px-4 py-2 border rounded bg-gray-100"
                            disabled
                        />
                    </div>
                </div>

                {testTypes.length > 0 ? (
                    testTypes.map((type) => (
                        <div key={type.id} className="mb-8">
                            <h3 className="text-xl font-bold mb-4 px-4 py-2 bg-blue-600 text-white rounded">
                                {type.name}
                            </h3>
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm">Caso</th>
                                            <th className="px-4 py-3 text-left text-sm">Prueba</th>
                                            <th className="px-4 py-3 text-left text-sm">Resultado Esperado</th>
                                            <th className="px-4 py-3 text-center text-sm">Aprobado</th>
                                            <th className="px-4 py-3 text-center text-sm">Reprobado</th>
                                            <th className="px-4 py-3 text-left text-sm">Notas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(type.tests || []).map((test) => {
                                            const testResult = results.find((r) => r.test_id === test.id);
                                            return (
                                                <tr key={test.id} className="border-t">
                                                    <td className="px-4 py-3 text-sm">{test.name}</td>
                                                    <td className="px-4 py-3 text-sm">{test.description}</td>
                                                    <td className="px-4 py-3 text-sm">{test.expected_result}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <input
                                                            type="radio"
                                                            name={`result-${test.id}`}
                                                            checked={testResult?.result === 'aprobado'}
                                                            onChange={() => setResult(test.id, 'aprobado')}
                                                            className="w-5 h-5"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <input
                                                            type="radio"
                                                            name={`result-${test.id}`}
                                                            checked={testResult?.result === 'reprobado'}
                                                            onChange={() => setResult(test.id, 'reprobado')}
                                                            className="w-5 h-5"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={testResult?.notes || ''}
                                                            onChange={(e) => setNotes(test.id, e.target.value)}
                                                            placeholder="..."
                                                            className="w-full px-2 py-1 border rounded text-sm"
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-6 bg-white rounded-lg shadow text-center text-gray-500">
                        {productVersionId ? 'Esta versión no tiene tipos de prueba asignados.' : 'Seleccione una versión para ver las pruebas.'}
                    </div>
                )}

                <div className="mt-6 flex gap-4">
                    <button
                        type="submit"
                        disabled={!productVersionId || testTypes.length === 0}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        Guardar Sesión
                    </button>
                    <a href="/test-sessions" className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                        Cancelar
                    </a>
                </div>
            </form>
        </Layout>
    );
}
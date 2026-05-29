import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../layouts/Layout';

interface TestType {
    id: number;
    name: string;
}

interface Test {
    id: number;
    name: string;
    description: string | null;
    expected_result: string;
    test_type: TestType;
}

interface TestResult {
    id: number;
    test_id: number;
    user_performer: string;
    result: 'aprobado' | 'reprobado';
    notes: string | null;
    created_at: string;
    test: Test;
}

interface PageProps {
    testResults: TestResult[];
    tests: Test[];
    testTypes: TestType[];
    isAdmin: boolean;
    currentUser?: string;
}

export default function TestResultsIndex({ testResults, tests, testTypes, isAdmin }: PageProps) {
    const [form, setForm] = useState({
        test_id: '',
        user_performer: '',
        result: 'aprobado' as 'aprobado' | 'reprobado',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/test-results', form, { preserveScroll: true });
        setForm({ test_id: '', user_performer: '', result: 'aprobado', notes: '' });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este resultado?')) {
            router.delete(`/test-results/${id}`, { preserveScroll: true });
        }
    };

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
        <Layout title="Resultados de Prueba">
            <h1 className="text-2xl font-bold mb-6">Resultados de Pruebas</h1>

            {isAdmin && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <select
                            value={form.test_id}
                            onChange={(e) => setForm({ ...form, test_id: e.target.value })}
                            className="px-4 py-2 border rounded"
                            required
                        >
                            <option value="">Seleccionar prueba</option>
                            {tests.map((test) => (
                                <option key={test.id} value={test.id}>
                                    [{test.test_type?.name ?? 'Sin tipo'}] {test.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={form.user_performer}
                            onChange={(e) => setForm({ ...form, user_performer: e.target.value })}
                            placeholder="Usuario"
                            className="px-4 py-2 border rounded"
                            required
                        />
                        <select
                            value={form.result}
                            onChange={(e) => setForm({ ...form, result: e.target.value as 'aprobado' | 'reprobado' })}
                            className="px-4 py-2 border rounded"
                            required
                        >
                            <option value="aprobado">Aprobado</option>
                            <option value="reprobado">Reprobado</option>
                        </select>
                        <input
                            type="text"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            placeholder="Notas (opcional)"
                            className="px-4 py-2 border rounded"
                        />
                    </div>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Registrar
                    </button>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-3 py-3 text-left text-sm">Fecha</th>
                            <th className="px-3 py-3 text-left text-sm">Tipo</th>
                            <th className="px-3 py-3 text-left text-sm">Caso</th>
                            <th className="px-3 py-3 text-left text-sm">Prueba</th>
                            <th className="px-3 py-3 text-left text-sm">Resultado Esperado</th>
                            <th className="px-3 py-3 text-left text-sm">Usuario</th>
                            <th className="px-3 py-3 text-center text-sm">Resultado</th>
                            <th className="px-3 py-3 text-left text-sm">Notas</th>
                            {isAdmin && <th className="px-3 py-3 text-center text-sm">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {testResults.map((result) => (
                            <tr
                                key={result.id}
                                className={`border-t ${result.result === 'aprobado' ? 'bg-green-50' : 'bg-red-50'}`}
                            >
                                <td className="px-3 py-3 text-sm">{formatDate(result.created_at)}</td>
                                <td className="px-3 py-3">
                                    <span className="px-2 py-1 bg-gray-200 rounded text-xs">{result.test.test_type?.name ?? 'Sin tipo'}</span>
                                </td>
                                <td className="px-3 py-3 text-sm">{result.test.name}</td>
                                <td className="px-3 py-3 text-sm">{result.test.description}</td>
                                <td className="px-3 py-3 text-sm">{result.test.expected_result}</td>
                                <td className="px-3 py-3 text-sm">{result.user_performer}</td>
                                <td className="px-3 py-3 text-center">
                                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                                        result.result === 'aprobado'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-red-500 text-white'
                                    }`}>
                                        {result.result.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-sm">{result.notes}</td>
                                {isAdmin && (
                                    <td className="px-3 py-3 text-center">
                                        <button
                                            onClick={() => handleDelete(result.id)}
                                            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                        >
                                            X
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
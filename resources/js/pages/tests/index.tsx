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
    test_type_id: number;
    name: string;
    description: string | null;
    expected_result: string;
    test_type: TestType;
}

interface PageProps {
    tests: Test[];
    testTypes: TestType[];
    isAdmin: boolean;
    currentUser?: string;
}

export default function TestsIndex({ tests, testTypes, isAdmin }: PageProps) {
    const [form, setForm] = useState({
        test_type_id: '',
        name: '',
        description: '',
        expected_result: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/tests', form, { preserveScroll: true });
        setForm({ test_type_id: '', name: '', description: '', expected_result: '' });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar esta prueba?')) {
            router.delete(`/tests/${id}`, { preserveScroll: true });
        }
    };

    return (
        <Layout title="Pruebas">
            <h2 className="text-2xl font-bold mb-6">Gestión de Pruebas</h2>

            {isAdmin && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <select
                            value={form.test_type_id}
                            onChange={(e) => setForm({ ...form, test_type_id: e.target.value })}
                            className="px-4 py-2 border rounded"
                            required
                        >
                            <option value="">Tipo</option>
                            {testTypes.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Caso"
                            className="px-4 py-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Prueba"
                            className="px-4 py-2 border rounded"
                        />
                        <input
                            type="text"
                            value={form.expected_result}
                            onChange={(e) => setForm({ ...form, expected_result: e.target.value })}
                            placeholder="Resultado esperado"
                            className="px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Agregar
                    </button>
                </form>
            )}

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm">ID</th>
                            <th className="px-4 py-3 text-left text-sm">Tipo</th>
                            <th className="px-4 py-3 text-left text-sm">Caso</th>
                            <th className="px-4 py-3 text-left text-sm">Prueba</th>
                            <th className="px-4 py-3 text-left text-sm">Resultado Esperado</th>
                            {isAdmin && <th className="px-4 py-3 text-center text-sm">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {tests.map((test) => (
                            <tr key={test.id} className="border-t">
                                <td className="px-4 py-3">{test.id}</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 bg-gray-200 rounded text-sm">{test.test_type.name}</span>
                                </td>
                                <td className="px-4 py-3">{test.name}</td>
                                <td className="px-4 py-3">{test.description}</td>
                                <td className="px-4 py-3">{test.expected_result}</td>
                                {isAdmin && (
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleDelete(test.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
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
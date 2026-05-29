import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../layouts/Layout';

interface TestType {
    id: number;
    name: string;
    tests_count: number;
}

interface PageProps {
    testTypes: TestType[];
    isAdmin: boolean;
    currentUser?: string;
}

export default function TestTypesIndex({ testTypes, isAdmin, currentUser }: PageProps) {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/test-types', { name }, { preserveScroll: true });
        setName('');
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este tipo de prueba?')) {
            router.delete(`/test-types/${id}`, { preserveScroll: true });
        }
    };

    return (
        <Layout title="Tipos de Prueba">
            <h2 className="text-2xl font-bold mb-6">Tipos de Prueba</h2>

            {isAdmin && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nombre del tipo de prueba"
                            className="flex-1 px-4 py-2 border rounded"
                            required
                        />
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Agregar
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm">ID</th>
                            <th className="px-4 py-3 text-left text-sm">Nombre</th>
                            <th className="px-4 py-3 text-center text-sm">Pruebas</th>
                            {isAdmin && <th className="px-4 py-3 text-center text-sm">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {testTypes.map((type) => (
                            <tr key={type.id} className="border-t">
                                <td className="px-4 py-3">{type.id}</td>
                                <td className="px-4 py-3 font-semibold">{type.name}</td>
                                <td className="px-4 py-3 text-center">{type.tests_count}</td>
                                {isAdmin && (
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleDelete(type.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                        >
                                            Eliminar
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
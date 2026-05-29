import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../layouts/Layout';

interface Product {
    id: number;
    name: string;
    versions_count: number;
    versions: { id: number; version: string }[];
}

interface PageProps {
    products: Product[];
    isAdmin: boolean;
    currentUser?: string;
    errors?: { [key: string]: string };
}

export default function ProductsIndex({ products, isAdmin, currentUser }: PageProps) {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/products', { name }, { preserveScroll: true });
        setName('');
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este producto?')) {
            router.delete(`/products/${id}`, { preserveScroll: true });
        }
    };

    return (
        <Layout title="Productos">
            <h2 className="text-2xl font-bold mb-6">Productos</h2>

            {isAdmin && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nombre del producto"
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
                            <th className="px-4 py-3 text-left text-sm">Versiones</th>
                            {isAdmin && <th className="px-4 py-3 text-center text-sm">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-t">
                                <td className="px-4 py-3">{product.id}</td>
                                <td className="px-4 py-3">{product.name}</td>
                                <td className="px-4 py-3">
                                    {product.versions.length === 0 ? (
                                        <span className="text-gray-400 text-sm">Sin versiones</span>
                                    ) : (
                                        product.versions.map((v) => (
                                            <span key={v.id} className="mr-2 px-2 py-1 bg-gray-100 rounded text-sm">
                                                {v.version}
                                            </span>
                                        ))
                                    )}
                                </td>
                                {isAdmin && (
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleDelete(product.id)}
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
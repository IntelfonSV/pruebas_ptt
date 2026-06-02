import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';

interface Product {
    id: number;
    name: string;
}

interface ProductVersion {
    id: number;
    version: string;
    product_id: number;
    product: Product;
    apk_file: string | null;
    test_manual: string | null;
    url: string | null;
}

interface PageProps {
    versions: ProductVersion[];
    products: Product[];
    isAdmin: boolean;
    currentUser?: string;
}

export default function ProductVersionsIndex({ versions, products, isAdmin }: PageProps) {
    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar esta versión?')) {
            router.delete(`/product-versions/${id}`, { preserveScroll: true });
        }
    };

    return (
        <Layout title="Versiones de Producto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Versiones de Producto</h2>
                {isAdmin && (
                    <a
                        href="/product-versions/create"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Nueva Versión
                    </a>
                )}
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm">ID</th>
                            <th className="px-4 py-3 text-left text-sm">Producto</th>
                            <th className="px-4 py-3 text-left text-sm">Versión</th>
                            <th className="px-4 py-3 text-center text-sm">APK</th>
                            <th className="px-4 py-3 text-center text-sm">Manual</th>
                            <th className="px-4 py-3 text-center text-sm">URL</th>
                            <th className="px-4 py-3 text-center text-sm">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {versions.map((v) => {
                            const product = products.find((p) => p.id === v.product_id);
                            return (
                                <tr key={v.id} className="border-t">
                                    <td className="px-4 py-3">{v.id}</td>
                                    <td className="px-4 py-3">{product?.name}</td>
                                    <td className="px-4 py-3 font-mono">{v.version}</td>
                                    <td className="px-4 py-3 text-center">
                                        {v.apk_file ? (
                                            <a
                                                href={`/storage/${v.apk_file}`}
                                                target="_blank"
                                                className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                                            >
                                                Descargar
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm">Sin archivo</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {v.test_manual ? (
                                            <a
                                                href={`/storage/${v.test_manual}`}
                                                target="_blank"
                                                className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
                                            >
                                                PDF
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {v.url ? (
                                            <a
                                                href={v.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline text-sm"
                                            >
                                                Abrir
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <a
                                            href={`/product-versions/${v.id}`}
                                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 mr-2"
                                        >
                                            Ver
                                        </a>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDelete(v.id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
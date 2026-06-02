import { Head } from '@inertiajs/react';
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

interface Product {
    id: number;
    name: string;
}

interface ProductVersion {
    id: number;
    version: string;
    product: Product;
    test_types: TestType[];
    apk_file: string | null;
    test_manual: string | null;
    url: string | null;
}

interface PageProps {
    productVersion: ProductVersion;
    currentUser?: string;
    isAdmin?: boolean;
}

export default function ProductVersionsShow({ productVersion, currentUser, isAdmin }: PageProps) {
    const testTypes = productVersion.test_types || [];

    return (
        <Layout title={`${productVersion.product?.name} ${productVersion.version}`}>
            <a href="/product-versions" className="text-blue-600 hover:underline mb-4 inline-block">
                ← Volver a versiones
            </a>

            <h2 className="text-2xl font-bold mb-2">{productVersion.product?.name}</h2>
            <p className="text-xl text-gray-600 mb-4">{productVersion.version}</p>

            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-4">
                {productVersion.apk_file && (
                    <a
                        href={`/storage/${productVersion.apk_file}`}
                        target="_blank"
                        className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Descargar APK
                    </a>
                )}
                {productVersion.test_manual && (
                    <a
                        href={`/storage/${productVersion.test_manual}`}
                        target="_blank"
                        className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                        Ver Manual PDF
                    </a>
                )}
                {productVersion.url && (
                    <a
                        href={productVersion.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Abrir URL
                    </a>
                )}
            </div>

            {isAdmin && (
                <a
                    href={`/product-versions/${productVersion.id}/edit`}
                    className="inline-block mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Editar Tipos de Prueba
                </a>
            )}

            {testTypes.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-500">No hay tipos de prueba asignados a esta versión.</p>
                </div>
            ) : (
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {(type.tests || []).map((test) => (
                                        <tr key={test.id} className="border-t">
                                            <td className="px-4 py-3 text-sm">{test.name}</td>
                                            <td className="px-4 py-3 text-sm">{test.description}</td>
                                            <td className="px-4 py-3 text-sm">{test.expected_result}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            )}
        </Layout>
    );
}
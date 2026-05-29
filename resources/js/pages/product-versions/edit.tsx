import { Head, router } from '@inertiajs/react';
import Layout from '../../layouts/Layout';
import { useState } from 'react';

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
}

interface PageProps {
    productVersion: ProductVersion;
    testTypes: TestType[];
    currentUser?: string;
    isAdmin?: boolean;
}

export default function ProductVersionsEdit({ productVersion, testTypes, currentUser, isAdmin }: PageProps) {
    const assignedTypeIds = productVersion.test_types?.map(t => t.id) || [];

    const [selectedTypeIds, setSelectedTypeIds] = useState<number[]>(assignedTypeIds);

    const toggleType = (typeId: number) => {
        if (selectedTypeIds.includes(typeId)) {
            setSelectedTypeIds(selectedTypeIds.filter(id => id !== typeId));
        } else {
            setSelectedTypeIds([...selectedTypeIds, typeId]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(`/product-versions/${productVersion.id}`, {
            test_type_ids: selectedTypeIds,
        }, {
            preserveScroll: true,
        });
    };

    return (
        <Layout title={`Editar ${productVersion.product?.name} ${productVersion.version}`}>
            <a href={`/product-versions/${productVersion.id}`} className="text-blue-600 hover:underline mb-4 inline-block">
                ← Volver a versión
            </a>

            <h2 className="text-2xl font-bold mb-2">{productVersion.product?.name}</h2>
            <p className="text-xl text-gray-600 mb-6">Editar Tipos de Prueba: {productVersion.version}</p>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-2xl">
                <div className="mb-6">
                    <label className="block font-medium mb-4 text-lg">Tipos de Prueba</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {testTypes.map((type) => (
                            <label
                                key={type.id}
                                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
                                    selectedTypeIds.includes(type.id)
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedTypeIds.includes(type.id)}
                                    onChange={() => toggleType(type.id)}
                                    className="w-5 h-5 rounded"
                                />
                                <div>
                                    <span className="font-medium">{type.name}</span>
                                    <span className="text-gray-500 text-sm ml-2">({type.tests?.length || 0} pruebas)</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Guardar Cambios
                    </button>
                    <a
                        href={`/product-versions/${productVersion.id}`}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Cancelar
                    </a>
                </div>
            </form>
        </Layout>
    );
}
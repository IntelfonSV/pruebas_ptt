import { router } from '@inertiajs/react';
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
    apk_file: string | null;
    test_manual: string | null;
    url: string | null;
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
        const formData = new FormData();
        formData.append('test_type_ids', JSON.stringify(selectedTypeIds));
        const urlInput = document.getElementById('url') as HTMLInputElement;
        if (urlInput?.value) {
            formData.append('url', urlInput.value);
        }
        const fileInput = document.getElementById('apk_file') as HTMLInputElement;
        if (fileInput?.files?.[0]) {
            formData.append('apk_file', fileInput.files[0]);
        }
        const deleteCheckbox = document.getElementById('delete_apk') as HTMLInputElement;
        if (deleteCheckbox?.checked) {
            formData.append('delete_apk', '1');
        }
        const manualInput = document.getElementById('test_manual') as HTMLInputElement;
        if (manualInput?.files?.[0]) {
            formData.append('test_manual', manualInput.files[0]);
        }
        const deleteManualCheckbox = document.getElementById('delete_manual') as HTMLInputElement;
        if (deleteManualCheckbox?.checked) {
            formData.append('delete_manual', '1');
        }
        router.post(`/product-versions/${productVersion.id}`, {
            _method: 'put',
            ...Object.fromEntries(formData),
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

                <div className="mb-6">
                    <label className="block font-medium mb-2">Archivo APK</label>
                    {productVersion.apk_file && (
                        <div className="mb-3 p-3 bg-gray-100 rounded flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Archivo actual: {productVersion.apk_file.split('/').pop()}
                            </span>
                            <a
                                href={`/storage/${productVersion.apk_file}`}
                                target="_blank"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Ver
                            </a>
                        </div>
                    )}
                    <input
                        type="file"
                        id="apk_file"
                        name="apk_file"
                        accept=".apk,application/vnd.android.package-archive,application/zip"
                        className="w-full md:w-1/2 px-4 py-2 border rounded"
                    />
                    <p className="text-sm text-gray-500 mt-1">Subir un nuevo archivo reemplazará el actual</p>
                </div>

                {productVersion.apk_file && (
                    <div className="mb-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                id="delete_apk"
                                className="w-4 h-4"
                            />
                            <span className="text-red-600">Eliminar archivo actual</span>
                        </label>
                    </div>
                )}

                <div className="mb-6">
                    <label className="block font-medium mb-2">Manual de Pruebas (PDF)</label>
                    {productVersion.test_manual && (
                        <div className="mb-3 p-3 bg-gray-100 rounded flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Actual: {productVersion.test_manual.split('/').pop()}
                            </span>
                            <a
                                href={`/storage/${productVersion.test_manual}`}
                                target="_blank"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Ver
                            </a>
                        </div>
                    )}
                    <input
                        type="file"
                        id="test_manual"
                        name="test_manual"
                        accept="application/pdf,.pdf"
                        className="w-full md:w-1/2 px-4 py-2 border rounded"
                    />
                    <p className="text-sm text-gray-500 mt-1">Subir un nuevo archivo reemplazará el actual (máx 50MB)</p>
                </div>

                {productVersion.test_manual && (
                    <div className="mb-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                id="delete_manual"
                                className="w-4 h-4"
                            />
                            <span className="text-red-600">Eliminar manual actual</span>
                        </label>
                    </div>
                )}

                <div className="mb-6">
                    <label className="block font-medium mb-2">URL (para versiones web)</label>
                    <input
                        type="url"
                        id="url"
                        defaultValue={productVersion.url || ''}
                        placeholder="https://ejemplo.com"
                        className="w-full md:w-1/2 px-4 py-2 border rounded"
                    />
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
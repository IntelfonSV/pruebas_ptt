import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../layouts/Layout';

interface Product {
    id: number;
    name: string;
}

interface TestType {
    id: number;
    name: string;
}

interface PageProps {
    products: Product[];
    testTypes: TestType[];
    currentUser?: string;
    isAdmin: boolean;
}

export default function ProductVersionsCreate({ products, testTypes, currentUser, isAdmin }: PageProps) {
    const [form, setForm] = useState({
        product_id: '',
        version: '',
        test_type_ids: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('product_id', form.product_id);
        formData.append('version', form.version);
        form.test_type_ids.forEach((id) => {
            formData.append('test_type_ids[]', id.toString());
        });
        const urlInput = document.getElementById('url') as HTMLInputElement;
        if (urlInput?.value) {
            formData.append('url', urlInput.value);
        }
        const fileInput = document.getElementById('apk_file') as HTMLInputElement;
        if (fileInput?.files?.[0]) {
            formData.append('apk_file', fileInput.files[0]);
        }
        const manualInput = document.getElementById('test_manual') as HTMLInputElement;
        if (manualInput?.files?.[0]) {
            formData.append('test_manual', manualInput.files[0]);
        }
        router.post('/product-versions', formData, {
            preserveScroll: true,
        });
    };

    const toggleTestType = (id: number) => {
        const ids = form.test_type_ids.includes(id)
            ? form.test_type_ids.filter((tid) => tid !== id)
            : [...form.test_type_ids, id];
        setForm({ ...form, test_type_ids: ids });
    };

    return (
        <Layout title="Nueva Versión de Producto">
            <h2 className="text-2xl font-bold mb-6">Nueva Versión de Producto</h2>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                <div className="mb-6">
                    <label className="block font-medium mb-2">Producto</label>
                    <select
                        value={form.product_id}
                        onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                        className="w-full md:w-1/3 px-4 py-2 border rounded"
                        required
                    >
                        <option value="">Seleccionar producto</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block font-medium mb-2">Versión</label>
                    <input
                        type="text"
                        value={form.version}
                        onChange={(e) => setForm({ ...form, version: e.target.value })}
                        placeholder="Ej: v1.0.0"
                        className="w-full md:w-1/3 px-4 py-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block font-medium mb-2">Tipos de Prueba</label>
                    <div className="flex flex-wrap gap-3">
                        {testTypes.map((type) => (
                            <label key={type.id} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
                                <input
                                    type="checkbox"
                                    checked={form.test_type_ids.includes(type.id)}
                                    onChange={() => toggleTestType(type.id)}
                                    className="w-4 h-4"
                                />
                                <span>{type.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block font-medium mb-2">Archivo APK (opcional)</label>
                    <input
                        type="file"
                        id="apk_file"
                        name="apk_file"
                        accept=".apk,application/vnd.android.package-archive,application/zip"
                        className="w-full md:w-1/3 px-4 py-2 border rounded"
                    />
                    <p className="text-sm text-gray-500 mt-1">Máximo 200 MB</p>
                </div>

                <div className="mb-6">
                    <label className="block font-medium mb-2">Manual de Pruebas (PDF, opcional)</label>
                    <input
                        type="file"
                        id="test_manual"
                        name="test_manual"
                        accept="application/pdf,.pdf"
                        className="w-full md:w-1/3 px-4 py-2 border rounded"
                    />
                    <p className="text-sm text-gray-500 mt-1">Máximo 50 MB</p>
                </div>

                <div className="mb-6">
                    <label className="block font-medium mb-2">URL (opcional, para versiones web)</label>
                    <input
                        type="url"
                        id="url"
                        placeholder="https://ejemplo.com"
                        className="w-full md:w-1/2 px-4 py-2 border rounded"
                    />
                </div>

                <div className="flex gap-4">
                    <button type="submit" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Crear Versión
                    </button>
                    <a href="/product-versions" className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                        Cancelar
                    </a>
                </div>
            </form>
        </Layout>
    );
}
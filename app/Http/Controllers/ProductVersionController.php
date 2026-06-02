<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVersion;
use App\Models\TestType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;

class ProductVersionController extends Controller
{
    private function isAdmin(): bool
    {
        return in_array(Session::get('username'), ['AWCRUZ', 'CSANTOS', 'DBOLAINES']);
    }

    public function index(Request $request)
    {
        if (!Session::has('username') || !in_array(Session::get('username'), ['AWCRUZ', 'CSANTOS', 'DBOLAINES'])) {
            return redirect('/login');
        }

        $query = ProductVersion::with('product');

        if ($request->product_id) {
            $query->where('product_id', $request->product_id);
        }

        $versions = $query->get();
        $products = Product::all();

        return Inertia::render('product-versions/index', [
            'versions' => $versions,
            'products' => $products,
            'isAdmin' => $this->isAdmin(),
            'currentUser' => Session::get('username'),
        ]);
    }

    public function create()
    {
        if (!$this->isAdmin()) {
            return redirect('/')->with('error', 'No tienes permiso para crear versiones');
        }
        $products = Product::all();
        $testTypes = TestType::with('tests')->get();
        $productsWithVersions = Product::with('versions.testTypes')->get();

        return Inertia::render('product-versions/create', [
            'products' => $products,
            'testTypes' => $testTypes,
            'productsWithVersions' => $productsWithVersions,
        ]);
    }

    public function store(Request $request)
    {
        if (!$this->isAdmin()) {
            return redirect('/')->with('error', 'No tienes permiso para crear versiones');
        }
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'version' => 'required',
            'test_type_ids' => 'array',
            'test_type_ids.*' => 'exists:test_types,id',
            'apk_file' => 'nullable|file|mimes:zip|max:204800',
            'test_manual' => 'nullable|file|mimes:pdf|max:51200',
            'url' => 'nullable|url|max:500',
        ]);

        $version = ProductVersion::create([
            'product_id' => $validated['product_id'],
            'version' => $validated['version'],
            'url' => $validated['url'] ?? null,
        ]);

        if ($request->hasFile('apk_file')) {
            $file = $request->file('apk_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('apks', $filename, 'public');
            $version->apk_file = $path;
            $version->save();
        }

        if ($request->hasFile('test_manual')) {
            $file = $request->file('test_manual');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('manuals', $filename, 'public');
            $version->test_manual = $path;
            $version->save();
        }

        if (isset($validated['test_type_ids'])) {
            $version->testTypes()->attach($validated['test_type_ids']);
        }

        return redirect()->route('product-versions.show', $version->id);
    }

    public function show(ProductVersion $productVersion)
    {
        $productVersion->load('product');
        $productVersion->load('testTypes.tests');

        return Inertia::render('product-versions/show', [
            'productVersion' => $productVersion,
            'currentUser' => Session::get('username'),
            'isAdmin' => $this->isAdmin(),
        ]);
    }

    public function edit(ProductVersion $productVersion)
    {
        if (!$this->isAdmin()) {
            return redirect('/')->with('error', 'No tienes permiso para editar versiones');
        }
        $productVersion->load('product');
        $productVersion->load('testTypes');
        $testTypes = TestType::with('tests')->get();

        return Inertia::render('product-versions/edit', [
            'productVersion' => $productVersion,
            'testTypes' => $testTypes,
            'currentUser' => Session::get('username'),
            'isAdmin' => $this->isAdmin(),
        ]);
    }

    public function update(Request $request, ProductVersion $productVersion)
    {
        if (!$this->isAdmin()) {
            return redirect('/')->with('error', 'No tienes permiso para editar versiones');
        }

        $validated = $request->validate([
            'test_type_ids' => 'present',
            'apk_file' => 'nullable|file|mimes:zip|max:204800',
            'test_manual' => 'nullable|file|mimes:pdf|max:51200',
            'url' => 'nullable|url|max:500',
            'delete_apk' => 'nullable|string',
            'delete_manual' => 'nullable|string',
        ]);

        $testTypeIds = is_string($validated['test_type_ids'])
            ? json_decode($validated['test_type_ids'], true)
            : ($validated['test_type_ids'] ?? []);

        if ($request->input('delete_apk') === '1' && $productVersion->apk_file) {
            Storage::disk('public')->delete($productVersion->apk_file);
            $productVersion->apk_file = null;
        }

        if ($request->input('delete_manual') === '1' && $productVersion->test_manual) {
            Storage::disk('public')->delete($productVersion->test_manual);
            $productVersion->test_manual = null;
        }

        if ($request->hasFile('apk_file')) {
            if ($productVersion->apk_file) {
                Storage::disk('public')->delete($productVersion->apk_file);
            }
            $file = $request->file('apk_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('apks', $filename, 'public');
            $productVersion->apk_file = $path;
        }

        if ($request->hasFile('test_manual')) {
            if ($productVersion->test_manual) {
                Storage::disk('public')->delete($productVersion->test_manual);
            }
            $file = $request->file('test_manual');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('manuals', $filename, 'public');
            $productVersion->test_manual = $path;
        }

        $productVersion->url = $validated['url'] ?? null;
        $productVersion->testTypes()->sync($testTypeIds ?? []);
        $productVersion->save();

        return redirect()->route('product-versions.show', $productVersion->id);
    }

    public function destroy(ProductVersion $productVersion)
    {
        if (!$this->isAdmin()) {
            return redirect('/')->with('error', 'No tienes permiso para eliminar versiones');
        }
        $productVersion->delete();
        return redirect()->back();
    }
}
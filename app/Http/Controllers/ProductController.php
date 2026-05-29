<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

class ProductController extends Controller
{
    private function isAdmin(): bool
    {
        return in_array(Session::get('username'), ['AWCRUZ', 'CSANTOS', 'DBOLAINES']);
    }

    public function index()
    {
        if (!Session::has('username') || !in_array(Session::get('username'), ['AWCRUZ', 'CSANTOS', 'DBOLAINES'])) {
            return redirect('/login');
        }

        $products = Product::with('versions')->withCount('versions')->get();
        return Inertia::render('products/index', [
            'products' => $products,
            'isAdmin' => $this->isAdmin(),
            'currentUser' => Session::get('username'),
        ]);
    }

    public function store(Request $request)
    {
        if (!$this->isAdmin()) {
            return redirect('/')->with('error', 'No tienes permiso para crear productos');
        }
        Product::create($request->validate(['name' => 'required']));
        return redirect()->back();
    }

    public function destroy(Product $product)
    {
        if (!$this->isAdmin()) {
            return redirect('/')->with('error', 'No tienes permiso para eliminar productos');
        }
        $product->delete();
        return redirect()->back();
    }
}
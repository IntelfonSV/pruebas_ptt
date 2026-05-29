<?php

namespace App\Http\Controllers;

use App\Models\TestType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

class TestTypeController extends Controller
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

        $testTypes = TestType::withCount('tests')->get();
        return Inertia::render('test-types/index', [
            'testTypes' => $testTypes,
            'isAdmin' => $this->isAdmin(),
            'currentUser' => Session::get('username'),
        ]);
    }

    public function store(Request $request)
    {
        if (!$this->isAdmin()) {
            return redirect('/')->with('error', 'No tienes permiso para crear tipos de prueba');
        }
        TestType::create($request->validate(['name' => 'required']));
        return redirect()->back();
    }

    public function destroy(TestType $testType)
    {
        if (!$this->isAdmin()) {
            return redirect('/')->with('error', 'No tienes permiso para eliminar tipos de prueba');
        }
        $testType->delete();
        return redirect()->back();
    }
}
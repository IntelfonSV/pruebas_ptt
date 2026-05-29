<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\TestType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

class TestController extends Controller
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

        $query = Test::with('testType');

        if ($request->test_type_id) {
            $query->where('test_type_id', $request->test_type_id);
        }

        $tests = $query->get();
        $testTypes = TestType::all();

        return Inertia::render('tests/index', [
            'tests' => $tests,
            'testTypes' => $testTypes,
            'isAdmin' => $this->isAdmin(),
            'currentUser' => Session::get('username'),
        ]);
    }

    public function store(Request $request)
    {
        if (!$this->isAdmin()) {
            return redirect('/')->with('error', 'No tienes permiso para crear pruebas');
        }
        $validated = $request->validate([
            'test_type_id' => 'required|exists:test_types,id',
            'name' => 'required',
            'description' => 'nullable',
            'expected_result' => 'required',
        ]);

        Test::create($validated);
        return redirect()->back();
    }

    public function destroy(Test $test)
    {
        if (!$this->isAdmin()) {
            return redirect('/')->with('error', 'No tienes permiso para eliminar pruebas');
        }
        $test->delete();
        return redirect()->back();
    }
}
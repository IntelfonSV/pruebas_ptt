<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\TestResult;
use App\Models\TestType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

class TestResultController extends Controller
{
    private function isAdmin(): bool
    {
        return in_array(Session::get('username'), ['AWCRUZ', 'CSANTOS', 'DBOLAINES']);
    }

    public function index(Request $request)
    {
        if (!Session::has('username')) {
            return redirect('/login');
        }

        $query = TestResult::with('test.testType', 'testSession');

        if (!$this->isAdmin()) {
            $query->whereHas('testSession', fn($q) => $q->where('user_performer', Session::get('username')));
        }

        if ($request->test_type_id) {
            $query->whereHas('test', fn($q) => $q->where('test_type_id', $request->test_type_id));
        }

        if ($request->test_id) {
            $query->where('test_id', $request->test_id);
        }

        if ($request->result) {
            $query->where('result', $request->result);
        }

        $testResults = $query->orderBy('created_at', 'desc')->get();
        $testTypes = TestType::all();
        $tests = Test::with('testType')->get();

        return Inertia::render('test-results/index', [
            'testResults' => $testResults,
            'tests' => $tests,
            'testTypes' => $testTypes,
            'isAdmin' => $this->isAdmin(),
            'currentUser' => Session::get('username'),
        ]);
    }

    public function store(Request $request)
    {
        if (!Session::has('username')) {
            return redirect('/login');
        }

        $validated = $request->validate([
            'test_id' => 'required|exists:tests,id',
            'user_performer' => 'required',
            'result' => 'required|in:aprobado,reprobado',
            'notes' => 'nullable',
        ]);

        TestResult::create($validated);
        return redirect()->back();
    }

    public function destroy(TestResult $testResult)
    {
        if (!$this->isAdmin()) {
            return redirect('/')->with('error', 'No tienes permiso para eliminar resultados');
        }
        $testResult->delete();
        return redirect()->back();
    }
}
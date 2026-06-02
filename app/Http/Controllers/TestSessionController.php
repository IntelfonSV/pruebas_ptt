<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVersion;
use App\Models\TestSession;
use App\Models\TestResult;
use App\Models\TestType;
use App\Models\TestResultAttachment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;

class TestSessionController extends Controller
{
    private function isAdmin(): bool
    {
        return in_array(Session::get('username'), ['AWCRUZ', 'CSANTOS', 'DBOLAINES']);
    }

    public function index(Request $request)
    {
        $query = TestSession::with('productVersion.product')->withCount('results');

        if (!$this->isAdmin()) {
            $query->where('user_performer', Session::get('username'));
        }

        if ($request->product_version_id) {
            $query->where('product_version_id', $request->product_version_id);
        }

        $sessions = $query->orderBy('created_at', 'desc')->get();
        $versions = ProductVersion::with('product')->get();

        return Inertia::render('test-sessions/index', [
            'sessions' => $sessions,
            'versions' => $versions,
            'isAdmin' => $this->isAdmin(),
            'currentUser' => Session::get('username'),
        ]);
    }

    public function create()
    {
        $versions = ProductVersion::with('product')->with('testTypes.tests')->get();

        return Inertia::render('test-sessions/create', [
            'versions' => $versions,
            'currentUser' => Session::get('username'),
            'isAdmin' => $this->isAdmin(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_version_id' => 'required|exists:product_versions,id',
            'results' => 'required',
            'results.*.test_id' => 'required|exists:tests,id',
            'results.*.result' => 'required|in:aprobado,reprobado',
            'results.*.notes' => 'nullable|string',
        ]);

        $resultsData = is_string($validated['results'])
            ? json_decode($validated['results'], true)
            : $validated['results'];

        $session = TestSession::create([
            'session_code' => TestSession::generateCode(),
            'product_version_id' => $validated['product_version_id'],
            'user_performer' => Session::get('username'),
        ]);

        foreach ($resultsData as $result) {
            $testResult = TestResult::create([
                'test_session_id' => $session->id,
                'test_id' => $result['test_id'],
                'result' => $result['result'],
                'notes' => $result['notes'] ?? null,
            ]);

            $testId = $result['test_id'];
            if ($request->hasFile("attachments.{$testId}")) {
                $files = $request->file("attachments.{$testId}");
                foreach (is_array($files) ? $files : [$files] as $file) {
                    $filename = time() . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs('test-attachments', $filename, 'public');
                    TestResultAttachment::create([
                        'test_result_id' => $testResult->id,
                        'filename' => $path,
                        'original_name' => $file->getClientOriginalName(),
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize(),
                    ]);
                }
            }
        }

        return redirect()->route('test-sessions.show', $session->id);
    }

    public function show($id)
    {
        $testSession = TestSession::with([
            'results.test.testType',
            'results.attachments',
            'productVersion.product'
        ])->findOrFail($id);

        return Inertia::render('test-sessions/show', [
            'session' => $testSession,
            'currentUser' => Session::get('username'),
            'isAdmin' => $this->isAdmin(),
        ]);
    }
}
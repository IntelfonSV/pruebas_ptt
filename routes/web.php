<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductVersionController;
use App\Http\Controllers\TestTypeController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TestSessionController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\TestResultController;
use App\Models\TestSession;
use App\Models\TestResult;
use Illuminate\Support\Facades\Session;

function isAllowed(): bool {
    return Session::has('username');
}

function isAdmin(): bool {
    return in_array(Session::get('username'), ['AWCRUZ', 'CSANTOS', 'DBOLAINES']);
}

function currentUser(): ?string {
    return Session::get('username');
}

Route::get('/login', [LoginController::class, 'show'])->name('login');
Route::post('/login', [LoginController::class, 'store']);
Route::post('/logout', [LoginController::class, 'destroy']);

Route::get('/debug-session', function () {
    return ['username' => session()->get('username'), 'all' => session()->all()];
});

Route::get('/', function () {
    if (!Session::has('username') || !isAllowed()) {
        return redirect('/login');
    }

    $username = currentUser();
    $admin = isAdmin();

    $sessionsQuery = TestSession::withCount('results');
    $resultsQuery = TestResult::query();

    if (!$admin) {
        $sessionsQuery->where('user_performer', $username);
        $resultsQuery->whereHas('testSession', fn($q) => $q->where('user_performer', $username));
    }

    $stats = [
        'totalSessions' => $sessionsQuery->count(),
        'totalTests' => $resultsQuery->count(),
        'passedTests' => (clone $resultsQuery)->where('result', 'aprobado')->count(),
        'failedTests' => (clone $resultsQuery)->where('result', 'reprobado')->count(),
        'recentSessions' => TestSession::withCount('results')
            ->when(!$admin, fn($q) => $q->where('user_performer', $username))
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($session) {
                $session->load('productVersion.product');
                return $session;
            }),
    ];

    return inertia('welcome', [
        'stats' => $stats,
        'currentUser' => $username,
        'isAdmin' => $admin,
    ]);
});

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::delete('/products/{product}', [ProductController::class, 'destroy']);

Route::get('/product-versions', [ProductVersionController::class, 'index']);
Route::get('/product-versions/create', [ProductVersionController::class, 'create']);
Route::post('/product-versions', [ProductVersionController::class, 'store']);
Route::get('/product-versions/{productVersion}', [ProductVersionController::class, 'show'])->name('product-versions.show');
Route::get('/product-versions/{productVersion}/edit', [ProductVersionController::class, 'edit'])->name('product-versions.edit');
Route::put('/product-versions/{productVersion}', [ProductVersionController::class, 'update'])->name('product-versions.update');
Route::delete('/product-versions/{productVersion}', [ProductVersionController::class, 'destroy']);

Route::get('/test-types', [TestTypeController::class, 'index']);
Route::post('/test-types', [TestTypeController::class, 'store']);
Route::delete('/test-types/{testType}', [TestTypeController::class, 'destroy']);

Route::get('/tests', [TestController::class, 'index']);
Route::post('/tests', [TestController::class, 'store']);
Route::delete('/tests/{test}', [TestController::class, 'destroy']);

Route::get('/test-sessions', [TestSessionController::class, 'index']);
Route::get('/test-sessions/create', [TestSessionController::class, 'create']);
Route::post('/test-sessions', [TestSessionController::class, 'store']);
Route::get('/test-sessions/{testSession}', [TestSessionController::class, 'show'])->name('test-sessions.show');

Route::get('/test-results', [TestResultController::class, 'index']);
Route::post('/test-results', [TestResultController::class, 'store']);
Route::delete('/test-results/{testResult}', [TestResultController::class, 'destroy']);
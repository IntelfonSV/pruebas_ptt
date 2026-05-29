<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

class LoginController extends Controller
{
    public function show()
    {
        return Inertia::render('login');
    }

    public function store(\Illuminate\Http\Request $request): \Illuminate\Http\RedirectResponse|\Inertia\Response
    {
        $validated = $request->validate([
            'username' => 'required|string|max:50',
        ]);

        $username = strtoupper(trim($validated['username']));

        if (empty($username)) {
            return redirect()->back()->with('error', 'Usuario requerido');
        }

        Session::put('username', $username);
        Session::put('is_admin', in_array($username, ['AWCRUZ', 'CSANTOS', 'DBOLAINES']));

        if ($request->wantsJson()) {
            return Inertia::location('/');
        }

        return redirect('/');
    }

    public function destroy(): RedirectResponse
    {
        Session::forget(['username', 'is_admin']);
        return redirect('/login');
    }
}
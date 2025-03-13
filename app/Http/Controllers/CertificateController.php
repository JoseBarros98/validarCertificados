<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CertificateController extends Controller
{
    public function index()
    {
        return Inertia::render('Certificates/Index', [
            'auth' => [
                'user' => \Illuminate\Support\Facades\Auth::user(),
            ],
        ]);
    }

    public function validate(Request $request)
{
    $request->validate([
        'code' => 'required',
    ]);

    $certificate = Certificate::where('code', $request->code)->first();

    if (!$certificate) {
        return response()->json([
            'valid' => false,
            'message' => 'El certificado no existe.',
        ]);
    }

    if ($certificate->status !== 'valid') {
        return response()->json([
            'valid' => false,
            'message' => 'El certificado no es válido.',
        ]);
    }

    return response()->json([
        'valid' => true,
        'certificate' => $certificate,
    ]);
}
}
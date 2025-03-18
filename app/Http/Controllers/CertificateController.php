<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use Illuminate\Routing\Controller;

class CertificateController extends Controller
{
    /**
     * Constructor para aplicar middleware de permisos
     */
    public function __construct()
    {
        $this->middleware('can:view certificates')->only(['index', 'show']);
        $this->middleware('can:create certificates')->only(['create', 'store']);
        $this->middleware('can:edit certificates')->only(['edit', 'update']);
        $this->middleware('can:toggle certificate status')->only(['toggleStatus']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        
        // Consulta base
        $query = Certificate::query();
        
        // Aplicar filtro de búsqueda si existe
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('student_name', 'like', "%{$search}%")
                  ->orWhere('course_name', 'like', "%{$search}%");
            });
        }
        
        // Filtrar por estado si se especifica
        if ($status && in_array($status, ['valid', 'invalid'])) {
            $query->where('status', $status);
        }
        
        // Ordenar por fecha de emisión descendente
        $query->orderBy('issue_date', 'desc');
        
        // Obtener certificados
        $certificates = $query->get();
        
        return Inertia::render('Admin/Certificates/Index', [
            'certificates' => $certificates,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Certificates/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:certificates',
            'student_name' => 'required|string|max:255',
            'course_name' => 'required|string|max:255',
            'issue_date' => 'required|date',
            'status' => 'required|in:valid,invalid',
            'certificate_image' => 'nullable|image|max:2048',
        ]);

        $certificate = new Certificate();
        $certificate->code = $validated['code'];
        $certificate->student_name = $validated['student_name'];
        $certificate->course_name = $validated['course_name'];
        $certificate->issue_date = $validated['issue_date'];
        $certificate->status = $validated['status'];

        if ($request->hasFile('certificate_image')) {
            $path = $request->file('certificate_image')->store('certificates', 'public');
            $certificate->certificate_image = $path;
        }

        $certificate->save();

        return redirect()->route('admin.certificates.index')->with('message', 'Certificado creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Certificate $certificate)
    {
        return Inertia::render('Admin/Certificates/Show', [
            'certificate' => $certificate
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Certificate $certificate)
    {
        return Inertia::render('Admin/Certificates/Edit', [
            'certificate' => $certificate
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Certificate $certificate)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:certificates,code,' . $certificate->id,
            'student_name' => 'required|string|max:255',
            'course_name' => 'required|string|max:255',
            'issue_date' => 'required|date',
            'status' => 'required|in:valid,invalid',
            'certificate_image' => 'nullable|image|max:2048',
        ]);

        $certificate->code = $validated['code'];
        $certificate->student_name = $validated['student_name'];
        $certificate->course_name = $validated['course_name'];
        $certificate->issue_date = $validated['issue_date'];
        $certificate->status = $validated['status'];

        if ($request->hasFile('certificate_image')) {
            // Eliminar imagen anterior si existe
            if ($certificate->certificate_image) {
                Storage::disk('public')->delete($certificate->certificate_image);
            }
            
            $path = $request->file('certificate_image')->store('certificates', 'public');
            $certificate->certificate_image = $path;
        }

        $certificate->save();

        return redirect()->route('admin.certificates.index')->with('message', 'Certificado actualizado correctamente.');
    }

    /**
     * Toggle the status of the certificate.
     */
    public function toggleStatus(Certificate $certificate)
    {
        $certificate->status = $certificate->status === 'valid' ? 'invalid' : 'valid';
        $certificate->save();

        return redirect()->route('admin.certificates.index')->with('message', 'Estado del certificado actualizado correctamente.');
    }

    /**
     * Validate a certificate.
     */
    public function validate(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255',
        ]);

        $certificate = Certificate::where('code', $validated['code'])->first();

        if (!$certificate) {
            return response()->json([
                'valid' => false,
                'message' => 'El certificado no existe en nuestros registros.'
            ]);
        }

        return response()->json([
            'valid' => $certificate->status === 'valid',
            'certificate' => $certificate->status === 'valid' ? $certificate : null,
            'message' => $certificate->status === 'valid' 
                ? 'Certificado válido.' 
                : 'Este certificado ha sido invalidado o revocado.'
        ]);
    }
}


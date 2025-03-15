<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AdminCertificateController extends Controller
{
    public function index()
    {
        $certificates = Certificate::latest()->get();
        
        return Inertia::render('Admin/Certificates/Index', [
            'certificates' => $certificates
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Certificates/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|unique:certificates,code',
            'student_name' => 'required',
            'course_name' => 'required',
            'issue_date' => 'required|date',
            'status' => 'required|in:valid,invalid',
            'certificate_image' => 'nullable|image|max:2048', // Máximo 2MB
        ]);

        // Procesar la imagen si se ha subido
        if ($request->hasFile('certificate_image')) {
            $path = $request->file('certificate_image')->store('certificates', 'public');
            $validated['certificate_image'] = $path;
        }

        Certificate::create($validated);

        return redirect()->route('admin.certificates.index')
            ->with('message', 'Certificado creado correctamente.');
    }

    public function show(Certificate $certificate)
    {
        return Inertia::render('Admin/Certificates/Show', [
            'certificate' => $certificate
        ]);
    }

    public function edit(Certificate $certificate)
    {
        return Inertia::render('Admin/Certificates/Edit', [
            'certificate' => $certificate
        ]);
    }

    public function update(Request $request, Certificate $certificate)
    {
        $validated = $request->validate([
            'code' => 'required|unique:certificates,code,' . $certificate->id,
            'student_name' => 'required',
            'course_name' => 'required',
            'issue_date' => 'required|date',
            'status' => 'required|in:valid,invalid',
            'certificate_image' => 'nullable|image|max:2048', // Máximo 2MB
        ]);

        // Procesar la imagen si se ha subido una nueva
        if ($request->hasFile('certificate_image')) {
            // Eliminar la imagen anterior si existe
            if ($certificate->certificate_image) {
                Storage::disk('public')->delete($certificate->certificate_image);
            }
            
            $path = $request->file('certificate_image')->store('certificates', 'public');
            $validated['certificate_image'] = $path;
        } else {
            // Mantener la imagen existente
            unset($validated['certificate_image']);
        }

        $certificate->update($validated);

        return redirect()->route('admin.certificates.index')
            ->with('message', 'Certificado actualizado correctamente.');
    }

    public function destroy(Certificate $certificate)
    {
        $certificate->delete();

        return redirect()->route('admin.certificates.index')
            ->with('message', 'Certificado eliminado exitosamente.');
    }

    public function toggleStatus(Certificate $certificate)
    {
        // Cambiar el estado del certificado
        $certificate->status = $certificate->status === 'valid' ? 'invalid' : 'valid';
        $certificate->save();

        // Mensaje de éxito
        $statusText = $certificate->status === 'valid' ? 'validado' : 'invalidado';
        return redirect()->route('admin.certificates.index')
            ->with('message', "El certificado ha sido {$statusText} correctamente.");
    }
}
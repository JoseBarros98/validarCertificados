<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Services\CertificateImageService;

use Illuminate\Routing\Controller;

class CertificateController extends Controller
{
    protected $certificateImageService;

    /**
     * Constructor para aplicar middleware de permisos e inyectar servicios
     */
    public function __construct(CertificateImageService $certificateImageService)
    {
        $this->middleware('can:view certificates')->only(['index', 'show']);
        $this->middleware('can:create certificates')->only(['create', 'store']);
        $this->middleware('can:edit certificates')->only(['edit', 'update']);
        $this->middleware('can:toggle certificate status')->only(['toggleStatus']);
        
        $this->certificateImageService = $certificateImageService;
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
            // Guardar la imagen original
            $path = $request->file('certificate_image')->store('certificates', 'public');
            
            // Añadir el QR a la imagen
            $pathWithQr = $this->certificateImageService->addQrCodeToImage($path, $certificate->code);
            
            // Si se procesó correctamente, usar la nueva imagen
            if ($pathWithQr) {
                // Eliminar la imagen original
                Storage::disk('public')->delete($path);
                $certificate->certificate_image = $pathWithQr;
            } else {
                $certificate->certificate_image = $path;
            }
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
            
            // Guardar la nueva imagen
            $path = $request->file('certificate_image')->store('certificates', 'public');
            
            // Añadir el QR a la imagen
            $pathWithQr = $this->certificateImageService->addQrCodeToImage($path, $certificate->code);
            
            // Si se procesó correctamente, usar la nueva imagen
            if ($pathWithQr) {
                // Eliminar la imagen original
                Storage::disk('public')->delete($path);
                $certificate->certificate_image = $pathWithQr;
            } else {
                $certificate->certificate_image = $path;
            }
        }

        $certificate->save();

        return redirect()->route('admin.certificates.index')->with('message', 'Certificado actualizado correctamente.');
    }

    /**
     * Toggle the status of the certificate.
     */
    public function toggleStatus($id)
{
    try {
        // Buscar el certificado
        $certificate = Certificate::findOrFail($id);
        
        // Cambiar el estado
        $certificate->status = ($certificate->status === 'valid') ? 'invalid' : 'valid';
        $certificate->save();
        
        // Registrar la acción
        Log::info("Estado de certificado cambiado: ID={$id}, Código={$certificate->code}, Nuevo estado={$certificate->status}");
        
        // Redirigir con mensaje de éxito
        return back()->with('success', 'Estado del certificado actualizado exitosamente.');
    } catch (\Exception $e) {
        // Registrar el error
        Log::error("Error al cambiar estado del certificado: " . $e->getMessage());
        
        return back()->with('error', 'Error al cambiar el estado del certificado: ' . $e->getMessage());
    }
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

    public function download($id)
    {
        try {
            // Buscar el certificado
            $certificate = Certificate::findOrFail($id);
            
            // Verificar si existe la imagen con QR
            $imagePath = $certificate->image_with_qr;
            
            // Si no existe la imagen con QR, generarla
            if (!$imagePath || !Storage::disk('public')->exists($imagePath)) {
                // Verificar si existe la imagen original
                if (!$certificate->certificate_image || !Storage::disk('public')->exists($certificate->certificate_image)) {
                    return back()->with('error', 'No se encontró la imagen del certificado.');
                }
                
                // Generar la imagen con QR
                $certificateImageService = new CertificateImageService();
                $imagePath = $certificateImageService->addQrCodeToImage($certificate->certificate_image, $certificate->code);
                
                // Verificar si se generó correctamente
                if (!$imagePath) {
                    return back()->with('error', 'No se pudo generar la imagen con QR.');
                }
                
                // Actualizar el certificado con la nueva ruta
                $certificate->image_with_qr = $imagePath;
                $certificate->save();
            }
            
            // Verificar si existe la imagen después de intentar generarla
            if (!$imagePath || !Storage::disk('public')->exists($imagePath)) {
                return back()->with('error', 'No se pudo generar la imagen del certificado.');
            }
            
            // Obtener la ruta completa del archivo
            $fullPath = Storage::disk('public')->path($imagePath);
            
            // Normalizar la ruta (convertir todas las barras a la misma dirección)
            $fullPath = str_replace('\\', '/', $fullPath);
            
            // Verificar si el archivo existe físicamente
            if (!file_exists($fullPath)) {
                // Registrar el error
                Log::error("Archivo no encontrado: {$fullPath}");
                return back()->with('error', 'El archivo físico no existe.');
            }
            
            // Determinar el tipo MIME basado en la extensión
            $extension = strtolower(pathinfo($imagePath, PATHINFO_EXTENSION));
            
            // Mapeo de extensiones a tipos MIME
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'bmp' => 'image/bmp',
                'webp' => 'image/webp'
            ];
            
            $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';
            
            // Nombre para la descarga
            $downloadName = "certificado_{$certificate->code}.{$extension}";
            
            // Registrar información de depuración
            Log::info("Descargando certificado: ID={$id}, Ruta={$fullPath}, Nombre={$downloadName}, MIME={$mimeType}");
            
            // Usar el método file() para enviar el archivo
            return response()->file($fullPath, [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'attachment; filename="' . $downloadName . '"',
                'Cache-Control' => 'no-cache, no-store, must-revalidate',
                'Pragma' => 'no-cache',
                'Expires' => '0'
            ]);
        } catch (\Exception $e) {
            // Registrar el error
            Log::error("Error al descargar certificado: " . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return back()->with('error', 'Error al descargar el certificado: ' . $e->getMessage());
        }
    }

}


<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Certificate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class DirectDownloadController extends Controller
{
    /**
     * Descarga directa de la imagen del certificado
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function downloadCertificate($id)
    {
        try {
            // Buscar el certificado
            $certificate = Certificate::findOrFail($id);
            
            // Determinar qué imagen usar (con QR o sin QR)
            $imagePath = $certificate->image_with_qr ?? $certificate->certificate_image;
            
            if (!$imagePath || !Storage::disk('certificates')->exists($imagePath)) {
                return response()->json(['error' => 'Imagen no encontrada'], 404);
            }
            
            // Obtener la ruta completa del archivo
            $fullPath = Storage::disk('certificates')->path($imagePath);
            
            // Verificar si el archivo existe físicamente
            if (!file_exists($fullPath)) {
                return response()->json(['error' => 'Archivo no encontrado'], 404);
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
            
            // Registrar información
            Log::info("Descarga directa: ID={$id}, Ruta={$fullPath}, Nombre={$downloadName}, MIME={$mimeType}");
            
            // Usar readfile para enviar el archivo directamente
            return response()->file($fullPath, [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'attachment; filename="' . $downloadName . '"',
                'Cache-Control' => 'no-cache, no-store, must-revalidate',
                'Pragma' => 'no-cache',
                'Expires' => '0'
            ]);
        } catch (\Exception $e) {
            Log::error("Error en descarga directa: " . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}


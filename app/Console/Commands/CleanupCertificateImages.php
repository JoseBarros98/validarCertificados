<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Certificate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class CleanupCertificateImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'certificates:cleanup-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Limpia las imágenes de certificados con nombres duplicados';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Iniciando limpieza de imágenes de certificados...');
        
        // Obtener todos los certificados
        $certificates = Certificate::all();
        
        $count = 0;
        foreach ($certificates as $certificate) {
            // Verificar si la imagen con QR tiene múltiples sufijos _with_qr
            if ($certificate->image_with_qr && substr_count($certificate->image_with_qr, '_with_qr') > 1) {
                $this->info("Limpiando imagen para certificado ID: {$certificate->id}, Código: {$certificate->code}");
                
                // Eliminar la imagen actual con QR
                if (Storage::disk('public')->exists($certificate->image_with_qr)) {
                    Storage::disk('public')->delete($certificate->image_with_qr);
                    $this->info("  - Eliminada imagen: {$certificate->image_with_qr}");
                }
                
                // Establecer image_with_qr a null para que se regenere la próxima vez
                $certificate->image_with_qr = null;
                $certificate->save();
                
                $count++;
            }
        }
        
        $this->info("Limpieza completada. Se procesaron {$count} certificados.");
        
        return 0;
    }
}


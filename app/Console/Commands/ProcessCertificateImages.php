<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Certificate;
use App\Services\CertificateImageService;

class ProcessCertificateImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'certificates:process-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Procesa todas las imágenes de certificados existentes para añadir códigos QR';

    /**
     * Execute the console command.
     */
    public function handle(CertificateImageService $certificateImageService)
    {
        $certificates = Certificate::whereNotNull('certificate_image')->get();
        
        $this->info("Procesando {$certificates->count()} certificados...");
        $bar = $this->output->createProgressBar($certificates->count());
        
        foreach ($certificates as $certificate) {
            if ($certificate->certificate_image) {
                $newPath = $certificateImageService->addQrCodeToImage($certificate->certificate_image, $certificate->code);
                
                if ($newPath) {
                    $certificate->certificate_image = $newPath;
                    $certificate->save();
                }
            }
            
            $bar->advance();
        }
        
        $bar->finish();
        $this->newLine();
        $this->info('¡Procesamiento completado!');
    }
}

